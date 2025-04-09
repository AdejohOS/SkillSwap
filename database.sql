pnpx supabase gen types typescript --project-id rgyyznitmwseyialdnmx --schema public > types_db.ts


-- Create enhanced profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,                      -- City/Country for local exchanges
  timezone TEXT,                      -- Helps with scheduling
  availability TEXT,                  -- When they're available to teach/learn
  preferred_teaching_method TEXT,     -- Online/In-person/Both
  languages_spoken TEXT[],            -- Array of languages they speak
  social_links JSONB,                 -- Store links to social profiles
  education TEXT,                     -- Background/credentials
  interests TEXT[],                   -- Array of general interests
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view any profile
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  USING (true);

-- Create policy to allow users to update only their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policy to allow users to insert only their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create trigger to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(gen_random_uuid()::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add indexes for frequently queried columns
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_profiles_languages_spoken ON profiles USING gin(languages_spoken);


-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  timezone TEXT,
  availability TEXT,
  preferred_teaching_method TEXT,
  languages_spoken TEXT[],
  social_links JSONB,
  education TEXT,
  interests TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skill_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS skill_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skill_offerings table with enhanced fields
CREATE TABLE IF NOT EXISTS skill_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  category_id INTEGER REFERENCES skill_categories(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  experience_level TEXT NOT NULL, -- 'beginner', 'intermediate', 'advanced', 'expert'
  availability TEXT[] DEFAULT '{}', -- Array of available times (e.g., ['weekday_evenings', 'weekend_mornings'])
  teaching_method TEXT DEFAULT 'both', -- 'online', 'in_person', or 'both'
  difficulty_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced', 'all_levels'
  tags TEXT[] DEFAULT '{}', -- Array of tags for better searchability
  media_urls JSONB DEFAULT '{}', -- JSON object with links to images, videos, or other resources
  location TEXT, -- Optional location for in-person teaching
  is_active BOOLEAN DEFAULT true, -- Whether this skill offering is currently active
  max_students INTEGER DEFAULT 1, -- Maximum number of students at once
  session_duration INTEGER DEFAULT 60, -- Typical session duration in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_skill_offerings_user_id ON skill_offerings(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_offerings_category_id ON skill_offerings(category_id);

-- Insert sample skill categories if they don't exist
INSERT INTO skill_categories (name, description)
VALUES 
  ('Programming', 'Software development, coding, and computer science'),
  ('Languages', 'Speaking, writing, and understanding foreign languages'),
  ('Music', 'Playing instruments, singing, music theory, and production'),
  ('Art & Design', 'Drawing, painting, graphic design, and other visual arts'),
  ('Cooking', 'Food preparation, baking, and culinary techniques'),
  ('Fitness', 'Exercise, sports, and physical wellness'),
  ('Photography', 'Taking and editing photos'),
  ('Writing', 'Creative writing, technical writing, and content creation'),
  ('Business', 'Entrepreneurship, marketing, and management'),
  ('Crafts', 'Handmade arts and crafts')
ON CONFLICT (name) DO NOTHING;

-- Create a function to search skill offerings by title, description, or tags
CREATE OR REPLACE FUNCTION search_skill_offerings(search_term TEXT)
RETURNS SETOF skill_offerings AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM skill_offerings
  WHERE 
    title ILIKE '%' || search_term || '%' OR
    description ILIKE '%' || search_term || '%' OR
    search_term = ANY(tags);
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies for skill_offerings
ALTER TABLE skill_offerings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view any skill offering
CREATE POLICY "Anyone can view skill offerings"
  ON skill_offerings FOR SELECT
  USING (true);

-- Create policy to allow users to update only their own skill offerings
CREATE POLICY "Users can update their own skill offerings"
  ON skill_offerings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert only their own skill offerings
CREATE POLICY "Users can insert their own skill offerings"
  ON skill_offerings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete only their own skill offerings
CREATE POLICY "Users can delete their own skill offerings"
  ON skill_offerings FOR DELETE
  USING (auth.uid() = user_id);