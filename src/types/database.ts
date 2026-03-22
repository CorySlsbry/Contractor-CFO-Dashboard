/**
 * Supabase database type definitions
 * Generated from database schema
 */

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          qbo_realm_id: string | null;
          qbo_access_token: string | null;
          qbo_refresh_token: string | null;
          qbo_token_expires_at: string | null;
          stripe_customer_id: string | null;
          subscription_status: "trialing" | "active" | "past_due" | "canceled";
          plan: "basic" | "pro" | "enterprise";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          qbo_realm_id?: string | null;
          qbo_access_token?: string | null;
          qbo_refresh_token?: string | null;
          qbo_token_expires_at?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: "trialing" | "active" | "past_due" | "canceled";
          plan?: "basic" | "pro" | "enterprise";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          qbo_realm_id?: string | null;
          qbo_access_token?: string | null;
          qbo_refresh_token?: string | null;
          qbo_token_expires_at?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: "trialing" | "active" | "past_due" | "canceled";
          plan?: "basic" | "pro" | "enterprise";
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          organization_id: string | null;
          role: "owner" | "admin" | "viewer";
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          organization_id?: string | null;
          role?: "owner" | "admin" | "viewer";
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          organization_id?: string | null;
          role?: "owner" | "admin" | "viewer";
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      dashboard_snapshots: {
        Row: {
          id: string;
          organization_id: string;
          data: Record<string, any>;
          pulled_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          data: Record<string, any>;
          pulled_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          data?: Record<string, any>;
          pulled_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
