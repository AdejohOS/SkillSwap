// Define the Database interface to match your Supabase schema
export interface SkillSwapDatabase {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          updated_at: string | null
          location: string | null
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
          location?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
          location?: string | null
        }
      }
      skill_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string | null
        }
      }
      skill_offerings: {
        Row: {
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
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category_id?: string | null
          experience_level?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          teaching_method?: string | null
          difficulty_level?: string | null
          session_duration?: number | null
          max_students?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category_id?: string | null
          experience_level?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          teaching_method?: string | null
          difficulty_level?: string | null
          session_duration?: number | null
          max_students?: number | null
        }
      }
      skill_requests: {
        Row: {
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
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          category_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          current_skill_level?: string | null
          desired_level?: string | null
          preferred_learning_method?: string | null
          goals?: string | null
          availability?: {
            weekdays: boolean
            weekends: boolean
            mornings: boolean
            afternoons: boolean
            evenings: boolean
          } | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          category_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          current_skill_level?: string | null
          desired_level?: string | null
          preferred_learning_method?: string | null
          goals?: string | null
          availability?: {
            weekdays: boolean
            weekends: boolean
            mornings: boolean
            afternoons: boolean
            evenings: boolean
          } | null
        }
      }
      swaps: {
        Row: {
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
        Insert: {
          id?: string
          teacher_id: string
          learner_id: string
          skill_offering_id?: string | null
          skill_request_id?: string | null
          status: string
          created_at?: string | null
          updated_at?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          is_credit_based?: boolean
        }
        Update: {
          id?: string
          teacher_id?: string
          learner_id?: string
          skill_offering_id?: string | null
          skill_request_id?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          is_credit_based?: boolean
        }
      }
      exchanges: {
        Row: {
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
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          swap1_id?: string | null
          swap2_id?: string | null
          status: string
          created_at?: string | null
          updated_at?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          credit_amount?: number | null
          is_credit_based?: boolean
          created_by: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          swap1_id?: string | null
          swap2_id?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
          scheduled_at?: string | null
          completed_at?: string | null
          credit_amount?: number | null
          is_credit_based?: boolean
          created_by?: string
        }
      }
      credits: {
        Row: {
          user_id: string
          balance: number
          updated_at: string | null
        }
        Insert: {
          user_id: string
          balance: number
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          balance?: number
          updated_at?: string | null
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          description: string
          related_id: string | null
          balance_after: number
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          description: string
          related_id?: string | null
          balance_after: number
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          description?: string
          related_id?: string | null
          balance_after?: number
          created_at?: string | null
        }
      }
      saved_searches: {
        Row: {
          id: string
          user_id: string
          search_params: Record<string, any>
          created_at: string
          name: string | null
        }
        Insert: {
          id?: string
          user_id: string
          search_params: Record<string, any>
          created_at?: string
          name?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          search_params?: Record<string, any>
          created_at?: string
          name?: string | null
        }
      }
      recent_searches: {
        Row: {
          id: string
          user_id: string
          search_params: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          search_params: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          search_params?: Record<string, any>
          created_at?: string
        }
      }
    }
    Functions: {
      add_credits: {
        Args: {
          p_user_id: string
          p_amount: number
          p_description: string
          p_related_id?: string
        }
        Returns: string
      }
      spend_credits: {
        Args: {
          p_user_id: string
          p_amount: number
          p_description: string
          p_related_id?: string
        }
        Returns: string
      }
      has_enough_credits: {
        Args: {
          p_user_id: string
          p_amount: number
        }
        Returns: boolean
      }
      get_user_credit_balance: {
        Args: {
          p_user_id: string
        }
        Returns: number
      }
      search_skills: {
        Args: {
          search_query: string | null
          category_id: string | null
          experience_level: string | null
          teaching_method: string | null
          location: string | null
          min_rating: number
          available_now: boolean
          has_reviews: boolean
          current_user_id: string
        }
        Returns: {
          id: string
          user_id: string
          title: string
          description: string
          category_id: string
          experience_level: string
          teaching_method: string
          available_now: boolean
          rating: number
          has_reviews: boolean
        }[]
      }
      get_user_average_ratings: {
        Args: {
          user_ids: string[]
        }
        Returns: {
          user_id: string
          average_rating: number
        }[]
      }
      find_reciprocal_matches: {
        Args: {
          p_user_id: string
        }
        Returns: {
          match_user_id: string
          match_username: string
          match_avatar_url: string
          my_skill_id: string
          my_skill_title: string
          their_skill_id: string
          their_skill_title: string
        }[]
      }
      // Add other functions here
    }
  }
}

// You can use this type with createClientComponentClient or createServerComponentClient
// Example: const supabase = createClientComponentClient<SkillSwapDatabase>()
