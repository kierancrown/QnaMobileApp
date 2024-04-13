export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      question_upvotes: {
        Row: {
          created_at: string
          id: number
          question_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          question_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          question_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_question_upvotes_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_question_upvotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      question_upvotes_count: {
        Row: {
          count: number
          id: number
          question_id: number
          updated_at: string
        }
        Insert: {
          count?: number
          id?: number
          question_id: number
          updated_at?: string
        }
        Update: {
          count?: number
          id?: number
          question_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_question_upvotes_count_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          attachments: Json[] | null
          created_at: string
          id: number
          nsfw: boolean
          question: string
          tags: number[]
          user_id: string
          user_meta: number | null
        }
        Insert: {
          attachments?: Json[] | null
          created_at?: string
          id?: number
          nsfw?: boolean
          question: string
          tags: number[]
          user_id?: string
          user_meta?: number | null
        }
        Update: {
          attachments?: Json[] | null
          created_at?: string
          id?: number
          nsfw?: boolean
          question?: string
          tags?: number[]
          user_id?: string
          user_meta?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_questions_user_meta_fkey"
            columns: ["user_meta"]
            isOneToOne: false
            referencedRelation: "user_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      responses: {
        Row: {
          created_at: string
          id: number
          popularity: number
          question_id: number
          response: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: number
          popularity?: number
          question_id: number
          response: string
          user_id?: string
          username?: string
        }
        Update: {
          created_at?: string
          id?: number
          popularity?: number
          question_id?: number
          response?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_metadata: {
        Row: {
          id: number
          profile_picture_key: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          verified: boolean
        }
        Insert: {
          id?: number
          profile_picture_key?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          verified?: boolean
        }
        Update: {
          id?: number
          profile_picture_key?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "public_user_metadata_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_user_metadata_username_fkey"
            columns: ["username"]
            isOneToOne: false
            referencedRelation: "usernames"
            referencedColumns: ["username"]
          },
        ]
      }
      usernames: {
        Row: {
          active: boolean
          created_at: string
          id: number
          user_id: string
          username: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: number
          user_id?: string
          username: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: number
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_usernames_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
