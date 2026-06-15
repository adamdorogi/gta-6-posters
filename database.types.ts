export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      credits: {
        Row: {
          created_at: string
          credits: number
          ip_address: string
          reset_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number
          ip_address: string
          reset_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          credits?: number
          ip_address?: string
          reset_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generation_groups: {
        Row: {
          created_at: string
          id: string
          style_id: string
          user_prompt: string
        }
        Insert: {
          created_at?: string
          id?: string
          style_id: string
          user_prompt?: string
        }
        Update: {
          created_at?: string
          id?: string
          style_id?: string
          user_prompt?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_groups_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "styles"
            referencedColumns: ["id"]
          },
        ]
      }
      generations: {
        Row: {
          created_at: string
          generation_group_id: string
          id: string
          path: string | null
          status: Database["public"]["Enums"]["generation_status"]
        }
        Insert: {
          created_at?: string
          generation_group_id: string
          id?: string
          path?: string | null
          status?: Database["public"]["Enums"]["generation_status"]
        }
        Update: {
          created_at?: string
          generation_group_id?: string
          id?: string
          path?: string | null
          status?: Database["public"]["Enums"]["generation_status"]
        }
        Relationships: [
          {
            foreignKeyName: "generations_generation_group_id_fkey"
            columns: ["generation_group_id"]
            isOneToOne: false
            referencedRelation: "generation_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          city: string
          country: string
          created_at: string
          email: string
          generation_id: string
          id: string
          line1: string
          line2: string | null
          name: string
          postal_code: string
          printify_id: string | null
          size: Database["public"]["Enums"]["canvas_size"]
          state: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          city?: string
          country?: string
          created_at?: string
          email?: string
          generation_id: string
          id?: string
          line1?: string
          line2?: string | null
          name?: string
          postal_code?: string
          printify_id?: string | null
          size: Database["public"]["Enums"]["canvas_size"]
          state?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          email?: string
          generation_id?: string
          id?: string
          line1?: string
          line2?: string | null
          name?: string
          postal_code?: string
          printify_id?: string | null
          size?: Database["public"]["Enums"]["canvas_size"]
          state?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "orders_generation_id_fkey"
            columns: ["generation_id"]
            isOneToOne: false
            referencedRelation: "generations"
            referencedColumns: ["id"]
          },
        ]
      }
      styles: {
        Row: {
          created_at: string
          id: string
          name: string
          prompt: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          prompt: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          prompt?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          created_at: string
          generation_group_id: string | null
          id: string
          path: string
        }
        Insert: {
          created_at?: string
          generation_group_id?: string | null
          id?: string
          path: string
        }
        Update: {
          created_at?: string
          generation_group_id?: string | null
          id?: string
          path?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploads_generation_group_id_fkey"
            columns: ["generation_group_id"]
            isOneToOne: false
            referencedRelation: "generation_groups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_credit: {
        Args: { ip_address: string; user_id: string }
        Returns: undefined
      }
      get_credits: {
        Args: { ip_address: string; user_id: string }
        Returns: {
          credits: number
          remaining: string
        }[]
      }
      init_or_reset_credits: {
        Args: { ip_address: string; user_id: string }
        Returns: string
      }
    }
    Enums: {
      canvas_size: "Small" | "Medium" | "Large" | "XL"
      generation_status: "in_progress" | "failed" | "succeeded"
      order_status: "pending" | "submitted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      canvas_size: ["Small", "Medium", "Large", "XL"],
      generation_status: ["in_progress", "failed", "succeeded"],
      order_status: ["pending", "submitted"],
    },
  },
} as const
