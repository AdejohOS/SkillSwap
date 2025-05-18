import { Database } from '../../types_db'

export type ProfileType = Database['public']['Tables']['profiles']['Row']

// Database types for TypeScript
export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string | null
  updated_at: string | null
  location?: string | null
}

export interface SkillCategory {
  id: string
  name: string
  description: string | null
  created_at: string | null
  updated_at: string | null
}

export interface SkillOffering {
  id: string
  user_id: string
  title: string
  description: string | null
  category_id: string | null
  experience_level: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at: string | null
  teaching_method: string | null
  difficulty_level: string | null
  session_duration: number | null
  max_students: number | null

  // Relations
  skill_categories?: SkillCategory | null
  profiles?: Profile
  exchanges?: Exchange[]
}

export interface SkillRequest {
  id: string
  user_id: string
  title: string
  description: string | null
  category_id: string | null
  created_at: string | null
  updated_at: string | null
  current_skill_level: string | null
  desired_level: string | null
  preferred_learning_method: string | null
  goals: string | null
  availability: {
    weekdays: boolean
    weekends: boolean
    mornings: boolean
    afternoons: boolean
    evenings: boolean
  } | null

  // Relations
  skill_categories?: SkillCategory | null
  exchanges?: Exchange[]
}

export interface Swap {
  id: string
  teacher_id: string
  learner_id: string
  skill_offering_id: string | null
  skill_request_id: string | null
  status: string
  created_at: string | null
  updated_at: string | null
  scheduled_at: string | null
  completed_at: string | null
  is_credit_based: boolean
}

export interface Exchange {
  id: string
  user1_id: string
  user2_id: string
  swap1_id: string | null
  swap2_id: string | null
  status: string
  created_at: string | null
  updated_at: string | null
  scheduled_at: string | null
  completed_at: string | null
  credit_amount: number | null
  is_credit_based: boolean
  created_by: string
}

export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  type: string
  description: string | null
  exchange_id: string | null
  created_at: string | null
}

export interface Message {
  id: string
  exchange_id: string
  sender_id: string
  content: string
  created_at: string | null
  is_read: boolean
}

export interface Notification {
  id: string
  user_id: string
  type: string
  content: string
  related_id: string | null
  created_at: string | null
  is_read: boolean
}

export interface Review {
  id: string
  exchange_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string | null
}
