-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SKILL CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SKILL OFFERINGS TABLE
CREATE TABLE IF NOT EXISTS public.skill_offerings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SKILL REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.skill_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  desired_level TEXT CHECK (desired_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SWAPS TABLE (underlying component of exchanges)
CREATE TABLE IF NOT EXISTS public.swaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  learner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_offering_id UUID REFERENCES public.skill_offerings(id) ON DELETE SET NULL,
  skill_request_id UUID REFERENCES public.skill_requests(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')),
  scheduled_times TIMESTAMP WITH TIME ZONE[],
  agreement_details TEXT,
  notes TEXT,
  teacher_rating INTEGER CHECK (teacher_rating BETWEEN 1 AND 5),
  learner_rating INTEGER CHECK (learner_rating BETWEEN 1 AND 5),
  teacher_feedback TEXT,
  learner_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EXCHANGES TABLE (new core entity)
CREATE TABLE IF NOT EXISTS public.exchanges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  swap1_id UUID REFERENCES public.swaps(id) ON DELETE SET NULL,
  swap2_id UUID REFERENCES public.swaps(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Add comments to help PostgreSQL understand the relationships
COMMENT ON CONSTRAINT exchanges_swap1_id_fkey ON public.exchanges IS 'Foreign key to swaps table';
COMMENT ON CONSTRAINT exchanges_swap2_id_fkey ON public.exchanges IS 'Foreign key to swaps table';

-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exchange_id UUID REFERENCES public.exchanges(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exchange_id UUID REFERENCES public.exchanges(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CREDITS TABLE
CREATE TABLE IF NOT EXISTS public.credits (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 5,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CREDIT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SAVED SEARCHES TABLE
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  query JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Function to find reciprocal matches
CREATE OR REPLACE FUNCTION find_reciprocal_matches(current_user_id UUID)
RETURNS TABLE (
  user2_id UUID,
  user2_name TEXT,
  user2_avatar_url TEXT,
  i_can_teach_skill_id UUID,
  i_can_teach_skill_title TEXT,
  i_can_teach_category TEXT,
  they_can_teach_skill_id UUID,
  they_can_teach_skill_title TEXT,
  they_can_teach_category TEXT,
  match_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  WITH my_skills AS (
    -- Skills I can teach
    SELECT 
      so.id AS skill_id,
      so.title AS skill_title,
      sc.name AS category_name
    FROM skill_offerings so
    LEFT JOIN skill_categories sc ON so.category_id = sc.id
    WHERE so.user_id = current_user_id AND so.is_active = TRUE
  ),
  my_requests AS (
    -- Skills I want to learn
    SELECT 
      sr.id AS request_id,
      sr.title AS request_title,
      sc.name AS category_name
    FROM skill_requests sr
    LEFT JOIN skill_categories sc ON sr.category_id = sc.id
    WHERE sr.user_id = current_user_id AND sr.is_active = TRUE
  ),
  potential_teachers AS (
    -- Users who can teach me skills I want to learn
    SELECT 
      p.id AS user_id,
      p.username,
      p.avatar_url,
      so.id AS skill_id,
      so.title AS skill_title,
      sc.name AS category_name,
      CASE
        WHEN mr.request_title ILIKE '%' || so.title || '%' OR so.title ILIKE '%' || mr.request_title || '%' THEN 3
        WHEN mr.category_name = sc.name THEN 1
        ELSE 0.5
      END AS match_score_they_teach
    FROM skill_offerings so
    JOIN profiles p ON so.user_id = p.id
    LEFT JOIN skill_categories sc ON so.category_id = sc.id
    CROSS JOIN my_requests mr
    WHERE so.is_active = TRUE
    AND so.user_id != current_user_id
    AND (
      mr.request_title ILIKE '%' || so.title || '%' 
      OR so.title ILIKE '%' || mr.request_title || '%'
      OR mr.category_name = sc.name
    )
  ),
  potential_students AS (
    -- Users who want to learn skills I can teach
    SELECT 
      p.id AS user_id,
      sr.id AS request_id,
      sr.title AS request_title,
      sc.name AS category_name,
      CASE
        WHEN ms.skill_title ILIKE '%' || sr.title || '%' OR sr.title ILIKE '%' || ms.skill_title || '%' THEN 3
        WHEN ms.category_name = sc.name THEN 1
        ELSE 0.5
      END AS match_score_i_teach
    FROM skill_requests sr
    JOIN profiles p ON sr.user_id = p.id
    LEFT JOIN skill_categories sc ON sr.category_id = sc.id
    CROSS JOIN my_skills ms
    WHERE sr.is_active = TRUE
    AND sr.user_id != current_user_id
    AND (
      ms.skill_title ILIKE '%' || sr.title || '%' 
      OR sr.title ILIKE '%' || ms.skill_title || '%'
      OR ms.category_name = sc.name
    )
  )
  SELECT 
    pt.user_id AS user2_id,
    pt.username AS user2_name,
    pt.avatar_url AS user2_avatar_url,
    ms.skill_id AS i_can_teach_skill_id,
    ms.skill_title AS i_can_teach_skill_title,
    ms.category_name AS i_can_teach_category,
    pt.skill_id AS they_can_teach_skill_id,
    pt.skill_title AS they_can_teach_skill_title,
    pt.category_name AS they_can_teach_category,
    (pt.match_score_they_teach + ps.match_score_i_teach) * 10 AS match_score
  FROM potential_teachers pt
  JOIN potential_students ps ON pt.user_id = ps.user_id
  JOIN my_skills ms ON (
    ms.skill_title ILIKE '%' || ps.request_title || '%' 
    OR ps.request_title ILIKE '%' || ms.skill_title || '%'
    OR ms.category_name = ps.category_name
  )
  WHERE NOT EXISTS (
    SELECT 1 FROM exchanges ex
    WHERE ((ex.user1_id = current_user_id AND ex.user2_id = pt.user_id)
       OR (ex.user1_id = pt.user_id AND ex.user2_id = current_user_id))
    AND ex.status NOT IN ('rejected', 'cancelled')
  )
  ORDER BY match_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to create a full exchange with two swaps
CREATE OR REPLACE FUNCTION create_full_exchange(
  p_user1_id UUID,
  p_user2_id UUID,
  p_user1_offering_id UUID,
  p_user2_offering_id UUID,
  p_user1_request_id UUID,
  p_user2_request_id UUID
) RETURNS UUID AS $$
DECLARE
  v_swap1_id UUID;
  v_swap2_id UUID;
  v_exchange_id UUID;
BEGIN
  -- Create swap 1 (user1 teaches user2)
  INSERT INTO swaps (
    teacher_id,
    learner_id,
    skill_offering_id,
    skill_request_id,
    status
  ) VALUES (
    p_user1_id,
    p_user2_id,
    p_user1_offering_id,
    p_user2_request_id,
    'pending'
  ) RETURNING id INTO v_swap1_id;
  
  -- Create swap 2 (user2 teaches user1)
  INSERT INTO swaps (
    teacher_id,
    learner_id,
    skill_offering_id,
    skill_request_id,
    status
  ) VALUES (
    p_user2_id,
    p_user1_id,
    p_user2_offering_id,
    p_user1_request_id,
    'pending'
  ) RETURNING id INTO v_swap2_id;
  
  -- Create the exchange linking both swaps
  INSERT INTO exchanges (
    user1_id,
    user2_id,
    swap1_id,
    swap2_id,
    status,
    created_by
  ) VALUES (
    p_user1_id,
    p_user2_id,
    v_swap1_id,
    v_swap2_id,
    'pending',
    p_user1_id
  ) RETURNING id INTO v_exchange_id;
  
  -- Create notification for user2
  INSERT INTO notifications (
    user_id,
    type,
    content,
    related_id,
    is_read
  ) VALUES (
    p_user2_id,
    'exchange_request',
    'You have received a new skill exchange request',
    v_exchange_id,
    FALSE
  );
  
  RETURN v_exchange_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update exchange status based on swap statuses
CREATE OR REPLACE FUNCTION update_exchange_status() RETURNS TRIGGER AS $$
BEGIN
  -- Find the exchange this swap belongs to
  UPDATE exchanges
  SET status = 
    CASE
      WHEN EXISTS (
        SELECT 1 FROM swaps 
        WHERE (id = NEW.id OR id = (
          SELECT CASE
            WHEN swap1_id = NEW.id THEN swap2_id
            WHEN swap2_id = NEW.id THEN swap1_id
            ELSE NULL
          END
          FROM exchanges WHERE swap1_id = NEW.id OR swap2_id = NEW.id
        ))
        AND status = 'rejected'
      ) THEN 'rejected'
      WHEN EXISTS (
        SELECT 1 FROM swaps 
        WHERE (id = NEW.id OR id = (
          SELECT CASE
            WHEN swap1_id = NEW.id THEN swap2_id
            WHEN swap2_id = NEW.id THEN swap1_id
            ELSE NULL
          END
          FROM exchanges WHERE swap1_id = NEW.id OR swap2_id = NEW.id
        ))
        AND status = 'cancelled'
      ) THEN 'cancelled'
      WHEN (
        SELECT COUNT(*) FROM swaps 
        WHERE (id = NEW.id OR id = (
          SELECT CASE
            WHEN swap1_id = NEW.id THEN swap2_id
            WHEN swap2_id = NEW.id THEN swap1_id
            ELSE NULL
          END
          FROM exchanges WHERE swap1_id = NEW.id OR swap2_id = NEW.id
        ))
        AND status = 'completed'
      ) = 2 THEN 'completed'
      WHEN (
        SELECT COUNT(*) FROM swaps 
        WHERE (id = NEW.id OR id = (
          SELECT CASE
            WHEN swap1_id = NEW.id THEN swap2_id
            WHEN swap2_id = NEW.id THEN swap1_id
            ELSE NULL
          END
          FROM exchanges WHERE swap1_id = NEW.id OR swap2_id = NEW.id
        ))
        AND status = 'in_progress'
      ) > 0 THEN 'in_progress'
      WHEN (
        SELECT COUNT(*) FROM swaps 
        WHERE (id = NEW.id OR id = (
          SELECT CASE
            WHEN swap1_id = NEW.id THEN swap2_id
            WHEN swap2_id = NEW.id THEN swap1_id
            ELSE NULL
          END
          FROM exchanges WHERE swap1_id = NEW.id OR swap2_id = NEW.id
        ))
        AND status = 'accepted'
      ) = 2 THEN 'accepted'
      ELSE 'pending'
    END,
    updated_at = NOW()
  WHERE swap1_id = NEW.id OR swap2_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update exchange status when swap status changes
DROP TRIGGER IF EXISTS update_exchange_status_trigger ON swaps;
CREATE TRIGGER update_exchange_status_trigger
AFTER UPDATE OF status ON swaps
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION update_exchange_status();
