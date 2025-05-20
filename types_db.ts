export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          description: string
          id: string
          related_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number
          created_at?: string | null
          description: string
          id?: string
          related_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          description?: string
          id?: string
          related_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credits: {
        Row: {
          balance: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exchanges: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          id: string
          request_id: string | null
          status: string
          swap1_id: string | null
          swap2_id: string | null
          updated_at: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          request_id?: string | null
          status: string
          swap1_id?: string | null
          swap2_id?: string | null
          updated_at?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          request_id?: string | null
          status?: string
          swap1_id?: string | null
          swap2_id?: string | null
          updated_at?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchanges_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "skill_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_swap1_id_fkey"
            columns: ["swap1_id"]
            isOneToOne: false
            referencedRelation: "exchange_skill_offerings"
            referencedColumns: ["swap1_id"]
          },
          {
            foreignKeyName: "exchanges_swap1_id_fkey"
            columns: ["swap1_id"]
            isOneToOne: false
            referencedRelation: "exchange_skill_offerings"
            referencedColumns: ["swap2_id"]
          },
          {
            foreignKeyName: "exchanges_swap1_id_fkey"
            columns: ["swap1_id"]
            isOneToOne: false
            referencedRelation: "swaps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_swap2_id_fkey"
            columns: ["swap2_id"]
            isOneToOne: false
            referencedRelation: "exchange_skill_offerings"
            referencedColumns: ["swap1_id"]
          },
          {
            foreignKeyName: "exchanges_swap2_id_fkey"
            columns: ["swap2_id"]
            isOneToOne: false
            referencedRelation: "exchange_skill_offerings"
            referencedColumns: ["swap2_id"]
          },
          {
            foreignKeyName: "exchanges_swap2_id_fkey"
            columns: ["swap2_id"]
            isOneToOne: false
            referencedRelation: "swaps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          exchange_id: string | null
          id: string
          is_read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          exchange_id?: string | null
          id?: string
          is_read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          exchange_id?: string | null
          id?: string
          is_read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_exchange_id_fkey"
            columns: ["exchange_id"]
            isOneToOne: false
            referencedRelation: "exchange_skill_offerings"
            referencedColumns: ["exchange_id"]
          },
          {
            foreignKeyName: "messages_exchange_id_fkey"
            columns: ["exchange_id"]
            isOneToOne: false
            referencedRelation: "exchanges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          related_type: string | null
          title: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          related_type?: string | null
          title?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          related_type?: string | null
          title?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          location: string | null
          updated_at: string | null
          username: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          updated_at?: string | null
          username: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          updated_at?: string | null
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      recent_searches: {
        Row: {
          filters: Json | null
          id: string
          query: string | null
          searched_at: string | null
          user_id: string
        }
        Insert: {
          filters?: Json | null
          id?: string
          query?: string | null
          searched_at?: string | null
          user_id: string
        }
        Update: {
          filters?: Json | null
          id?: string
          query?: string | null
          searched_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recent_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string | null
          exchange_id: string | null
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          exchange_id?: string | null
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          exchange_id?: string | null
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_exchange_id_fkey"
            columns: ["exchange_id"]
            isOneToOne: false
            referencedRelation: "exchange_skill_offerings"
            referencedColumns: ["exchange_id"]
          },
          {
            foreignKeyName: "reviews_exchange_id_fkey"
            columns: ["exchange_id"]
            isOneToOne: false
            referencedRelation: "exchanges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string | null
          id: string
          name: string
          query: Json
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          query: Json
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          query?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      skill_offerings: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          experience_level: string | null
          id: string
          is_active: boolean | null
          max_students: number | null
          session_duration: number | null
          teaching_method: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          max_students?: number | null
          session_duration?: number | null
          teaching_method?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          max_students?: number | null
          session_duration?: number | null
          teaching_method?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_offerings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_offerings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_requests: {
        Row: {
          availability: Json | null
          category_id: string | null
          created_at: string | null
          current_skill_level: string | null
          description: string | null
          desired_level: string | null
          goals: string | null
          id: string
          is_active: boolean | null
          preferred_learning_method: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          availability?: Json | null
          category_id?: string | null
          created_at?: string | null
          current_skill_level?: string | null
          description?: string | null
          desired_level?: string | null
          goals?: string | null
          id?: string
          is_active?: boolean | null
          preferred_learning_method?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          availability?: Json | null
          category_id?: string | null
          created_at?: string | null
          current_skill_level?: string | null
          description?: string | null
          desired_level?: string | null
          goals?: string | null
          id?: string
          is_active?: boolean | null
          preferred_learning_method?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      swaps: {
        Row: {
          agreement_details: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          learner_feedback: string | null
          learner_id: string
          learner_rating: number | null
          notes: string | null
          scheduled_times: string[] | null
          skill_offering_id: string | null
          skill_request_id: string | null
          status: string
          teacher_feedback: string | null
          teacher_id: string
          teacher_rating: number | null
          updated_at: string | null
        }
        Insert: {
          agreement_details?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          learner_feedback?: string | null
          learner_id: string
          learner_rating?: number | null
          notes?: string | null
          scheduled_times?: string[] | null
          skill_offering_id?: string | null
          skill_request_id?: string | null
          status: string
          teacher_feedback?: string | null
          teacher_id: string
          teacher_rating?: number | null
          updated_at?: string | null
        }
        Update: {
          agreement_details?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          learner_feedback?: string | null
          learner_id?: string
          learner_rating?: number | null
          notes?: string | null
          scheduled_times?: string[] | null
          skill_offering_id?: string | null
          skill_request_id?: string | null
          status?: string
          teacher_feedback?: string | null
          teacher_id?: string
          teacher_rating?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swaps_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swaps_skill_offering_id_fkey"
            columns: ["skill_offering_id"]
            isOneToOne: false
            referencedRelation: "skill_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swaps_skill_request_id_fkey"
            columns: ["skill_request_id"]
            isOneToOne: false
            referencedRelation: "skill_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swaps_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      exchange_skill_offerings: {
        Row: {
          exchange_created_at: string | null
          exchange_id: string | null
          exchange_status: string | null
          swap1_id: string | null
          swap1_learner_id: string | null
          swap1_skill_description: string | null
          swap1_skill_offering_id: string | null
          swap1_skill_title: string | null
          swap1_status: string | null
          swap1_teacher_id: string | null
          swap2_id: string | null
          swap2_learner_id: string | null
          swap2_skill_description: string | null
          swap2_skill_offering_id: string | null
          swap2_skill_title: string | null
          swap2_status: string | null
          swap2_teacher_id: string | null
          user1_id: string | null
          user2_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exchanges_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchanges_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swaps_learner_id_fkey"
            columns: ["swap1_learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swaps_learner_id_fkey"
            columns: ["swap2_learner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swaps_skill_offering_id_fkey"
            columns: ["swap1_skill_offering_id"]
            isOneToOne: false
            referencedRelation: "skill_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swaps_skill_offering_id_fkey"
            columns: ["swap2_skill_offering_id"]
            isOneToOne: false
            referencedRelation: "skill_offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swaps_teacher_id_fkey"
            columns: ["swap1_teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swaps_teacher_id_fkey"
            columns: ["swap2_teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      add_user_credits: {
        Args: {
          p_user_id: string
          p_amount: number
          p_description: string
          p_related_swap_id?: string
        }
        Returns: undefined
      }
      create_credit_based_swap: {
        Args: {
          p_learner_id: string
          p_teacher_id: string
          p_skill_offering_id: string
          p_skill_request_id: string
          p_credit_amount?: number
        }
        Returns: string
      }
      create_full_exchange: {
        Args: {
          p_user1_id: string
          p_user2_id: string
          p_user1_offering_id: string
          p_user2_offering_id: string
          p_user1_request_id: string
          p_user2_request_id: string
        }
        Returns: string
      }
      create_notification: {
        Args: {
          p_user_id: string
          p_type: string
          p_title: string
          p_message: string
          p_related_id?: string
          p_related_type?: string
        }
        Returns: string
      }
      create_session_reminders: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      find_reciprocal_matches: {
        Args: { current_user_id: string }
        Returns: {
          user2_id: string
          user2_name: string
          user2_avatar_url: string
          i_can_teach_skill_id: string
          i_can_teach_skill_title: string
          i_can_teach_category: string
          they_can_teach_skill_id: string
          they_can_teach_skill_title: string
          they_can_teach_category: string
          match_score: number
        }[]
      }
      get_engagement_analytics: {
        Args: { user_id: string }
        Returns: Json
      }
      get_exchanges_by_skill_offering: {
        Args: { skill_id: string }
        Returns: {
          exchange_id: string
          exchange_status: string
          exchange_created_at: string
          is_teacher: boolean
          other_user_id: string
          other_user_name: string
          other_skill_id: string
          other_skill_title: string
        }[]
      }
      get_exchanges_by_skill_request: {
        Args: { request_id: string }
        Returns: {
          exchange_id: string
          exchange_status: string
          exchange_created_at: string
          is_learner: boolean
          other_user_id: string
          other_user_name: string
          skill_offering_id: string
          skill_offering_title: string
        }[]
      }
      get_learning_analytics: {
        Args: { user_id: string }
        Returns: Json
      }
      get_potential_matches_for_request: {
        Args: { request_uuid: string }
        Returns: {
          offering_id: string
          teacher_id: string
          teacher_name: string
          skill_title: string
          category_name: string
          match_score: number
        }[]
      }
      get_teaching_analytics: {
        Args: { user_id: string }
        Returns: Json
      }
      get_user_analytics_summary: {
        Args: { user_id: string }
        Returns: {
          total_teaching_hours: number
          total_learning_hours: number
          total_swaps: number
          active_swaps: number
        }[]
      }
      get_user_average_rating: {
        Args: { user_id: string }
        Returns: number
      }
      get_user_average_rating_legacy: {
        Args: { user_id: string }
        Returns: number
      }
      get_user_average_ratings: {
        Args: { user_ids: string[] }
        Returns: {
          user_id: string
          average_rating: number
        }[]
      }
      get_user_credit_balance: {
        Args: { user_id_param: string }
        Returns: number
      }
      has_enough_credits: {
        Args: { p_user_id: string; p_amount: number }
        Returns: boolean
      }
      mark_all_notifications_as_read: {
        Args: { user_uuid: string }
        Returns: undefined
      }
      mark_messages_as_read: {
        Args: { swap_uuid: string; user_uuid: string }
        Returns: undefined
      }
      mark_notification_as_read: {
        Args: { notification_uuid: string }
        Returns: undefined
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
