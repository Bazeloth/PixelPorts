export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: '12.2.3 (519615d)';
    };
    public: {
        Tables: {
            collection_shots: {
                Row: {
                    added_at: string | null;
                    collection_id: string;
                    shot_id: string;
                };
                Insert: {
                    added_at?: string | null;
                    collection_id: string;
                    shot_id: string;
                };
                Update: {
                    added_at?: string | null;
                    collection_id?: string;
                    shot_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'collection_shots_collection_id_fkey';
                        columns: ['collection_id'];
                        isOneToOne: false;
                        referencedRelation: 'collections';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'collection_shots_shot_id_fkey';
                        columns: ['shot_id'];
                        isOneToOne: false;
                        referencedRelation: 'shots';
                        referencedColumns: ['id'];
                    },
                ];
            };
            collections: {
                Row: {
                    cover_image: string | null;
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    is_private: boolean | null;
                    name: string;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    cover_image?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    is_private?: boolean | null;
                    name: string;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    cover_image?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    is_private?: boolean | null;
                    name?: string;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            comments: {
                Row: {
                    content: string;
                    created_at: string | null;
                    id: string;
                    shot_id: string;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    content: string;
                    created_at?: string | null;
                    id?: string;
                    shot_id: string;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    content?: string;
                    created_at?: string | null;
                    id?: string;
                    shot_id?: string;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'comments_shot_id_fkey';
                        columns: ['shot_id'];
                        isOneToOne: false;
                        referencedRelation: 'shots';
                        referencedColumns: ['id'];
                    },
                ];
            };
            follows: {
                Row: {
                    created_at: string | null;
                    follower_id: string;
                    following_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    follower_id: string;
                    following_id: string;
                };
                Update: {
                    created_at?: string | null;
                    follower_id?: string;
                    following_id?: string;
                };
                Relationships: [];
            };
            likes: {
                Row: {
                    created_at: string | null;
                    shot_id: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    shot_id: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string | null;
                    shot_id?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'likes_shot_id_fkey';
                        columns: ['shot_id'];
                        isOneToOne: false;
                        referencedRelation: 'shots';
                        referencedColumns: ['id'];
                    },
                ];
            };
            shot_blocks: {
                Row: {
                    content: string | null;
                    created_at: string | null;
                    id: string;
                    position: number;
                    shot_id: string;
                    subtitle: string | null;
                    title: string | null;
                    type: string;
                    updated_at: string | null;
                    upload_id: string | null;
                };
                Insert: {
                    content?: string | null;
                    created_at?: string | null;
                    id?: string;
                    position: number;
                    shot_id: string;
                    subtitle?: string | null;
                    title?: string | null;
                    type: string;
                    updated_at?: string | null;
                    upload_id?: string | null;
                };
                Update: {
                    content?: string | null;
                    created_at?: string | null;
                    id?: string;
                    position?: number;
                    shot_id?: string;
                    subtitle?: string | null;
                    title?: string | null;
                    type?: string;
                    updated_at?: string | null;
                    upload_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'shot_blocks_shot_id_fkey';
                        columns: ['shot_id'];
                        isOneToOne: false;
                        referencedRelation: 'shots';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'shot_blocks_upload_id_fkey';
                        columns: ['upload_id'];
                        isOneToOne: false;
                        referencedRelation: 'shot_uploads';
                        referencedColumns: ['id'];
                    },
                ];
            };
            shot_carousel_uploads: {
                Row: {
                    created_at: string | null;
                    id: string;
                    position: number;
                    shot_block_id: string;
                    upload_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    position: number;
                    shot_block_id: string;
                    upload_id: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    position?: number;
                    shot_block_id?: string;
                    upload_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'shot_carousel_uploads_shot_block_id_fkey';
                        columns: ['shot_block_id'];
                        isOneToOne: false;
                        referencedRelation: 'shot_blocks';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'shot_carousel_uploads_upload_id_fkey';
                        columns: ['upload_id'];
                        isOneToOne: false;
                        referencedRelation: 'shot_uploads';
                        referencedColumns: ['id'];
                    },
                ];
            };
            shot_uploads: {
                Row: {
                    created_at: string | null;
                    file_ext: string | null;
                    file_size: number;
                    file_type: string;
                    height: number | null;
                    id: string;
                    width: number | null;
                };
                Insert: {
                    created_at?: string | null;
                    file_ext?: string | null;
                    file_size?: number;
                    file_type: string;
                    height?: number | null;
                    id?: string;
                    width?: number | null;
                };
                Update: {
                    created_at?: string | null;
                    file_ext?: string | null;
                    file_size?: number;
                    file_type?: string;
                    height?: number | null;
                    id?: string;
                    width?: number | null;
                };
                Relationships: [];
            };
            shots: {
                Row: {
                    alt: string | null;
                    brief: string | null;
                    category: string | null;
                    client: string | null;
                    color_space: string | null;
                    complexity: string | null;
                    created_at: string | null;
                    creator_role: string | null;
                    dimensions: string | null;
                    file_format: string | null;
                    id: string;
                    industry: string | null;
                    inspiration: string[] | null;
                    is_curated: boolean;
                    is_premium: boolean | null;
                    is_promoted: boolean | null;
                    iterations: number | null;
                    last_step: number;
                    license_type: string | null;
                    project_duration: string | null;
                    project_type: string | null;
                    published_at: string | null;
                    removal_reason: string | null;
                    removed_at: string | null;
                    software_used: string[] | null;
                    tags: string[] | null;
                    target_audience: string | null;
                    team_size: string | null;
                    time_invested: string | null;
                    title: string;
                    tools_used: string[] | null;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    alt?: string | null;
                    brief?: string | null;
                    category?: string | null;
                    client?: string | null;
                    color_space?: string | null;
                    complexity?: string | null;
                    created_at?: string | null;
                    creator_role?: string | null;
                    dimensions?: string | null;
                    file_format?: string | null;
                    id?: string;
                    industry?: string | null;
                    inspiration?: string[] | null;
                    is_curated?: boolean;
                    is_premium?: boolean | null;
                    is_promoted?: boolean | null;
                    iterations?: number | null;
                    last_step?: number;
                    license_type?: string | null;
                    project_duration?: string | null;
                    project_type?: string | null;
                    published_at?: string | null;
                    removal_reason?: string | null;
                    removed_at?: string | null;
                    software_used?: string[] | null;
                    tags?: string[] | null;
                    target_audience?: string | null;
                    team_size?: string | null;
                    time_invested?: string | null;
                    title: string;
                    tools_used?: string[] | null;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    alt?: string | null;
                    brief?: string | null;
                    category?: string | null;
                    client?: string | null;
                    color_space?: string | null;
                    complexity?: string | null;
                    created_at?: string | null;
                    creator_role?: string | null;
                    dimensions?: string | null;
                    file_format?: string | null;
                    id?: string;
                    industry?: string | null;
                    inspiration?: string[] | null;
                    is_curated?: boolean;
                    is_premium?: boolean | null;
                    is_promoted?: boolean | null;
                    iterations?: number | null;
                    last_step?: number;
                    license_type?: string | null;
                    project_duration?: string | null;
                    project_type?: string | null;
                    published_at?: string | null;
                    removal_reason?: string | null;
                    removed_at?: string | null;
                    software_used?: string[] | null;
                    tags?: string[] | null;
                    target_audience?: string | null;
                    team_size?: string | null;
                    time_invested?: string | null;
                    title?: string;
                    tools_used?: string[] | null;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'shots_userprofiles_fkey';
                        columns: ['user_id'];
                        isOneToOne: false;
                        referencedRelation: 'userprofiles';
                        referencedColumns: ['id'];
                    },
                ];
            };
            userprofiles: {
                Row: {
                    avatar_file_ext: string | null;
                    avatar_updated_at: string | null;
                    bio: string | null;
                    cover_photo_ext: string | null;
                    cover_photo_updated_at: string | null;
                    created_at: string | null;
                    dribbble_url: string | null;
                    id: string;
                    instagram_url: string | null;
                    is_admin: boolean;
                    linkedin_url: string | null;
                    location: string | null;
                    name: string;
                    twitter_url: string | null;
                    updated_at: string | null;
                    username: string;
                    website: string | null;
                };
                Insert: {
                    avatar_file_ext?: string | null;
                    avatar_updated_at?: string | null;
                    bio?: string | null;
                    cover_photo_ext?: string | null;
                    cover_photo_updated_at?: string | null;
                    created_at?: string | null;
                    dribbble_url?: string | null;
                    id: string;
                    instagram_url?: string | null;
                    is_admin?: boolean;
                    linkedin_url?: string | null;
                    location?: string | null;
                    name: string;
                    twitter_url?: string | null;
                    updated_at?: string | null;
                    username: string;
                    website?: string | null;
                };
                Update: {
                    avatar_file_ext?: string | null;
                    avatar_updated_at?: string | null;
                    bio?: string | null;
                    cover_photo_ext?: string | null;
                    cover_photo_updated_at?: string | null;
                    created_at?: string | null;
                    dribbble_url?: string | null;
                    id?: string;
                    instagram_url?: string | null;
                    is_admin?: boolean;
                    linkedin_url?: string | null;
                    location?: string | null;
                    name?: string;
                    twitter_url?: string | null;
                    updated_at?: string | null;
                    username?: string;
                    website?: string | null;
                };
                Relationships: [];
            };
            views: {
                Row: {
                    ip_address: string | null;
                    shot_id: string;
                    user_id: string | null;
                    viewed_at: string | null;
                };
                Insert: {
                    ip_address?: string | null;
                    shot_id: string;
                    user_id?: string | null;
                    viewed_at?: string | null;
                };
                Update: {
                    ip_address?: string | null;
                    shot_id?: string;
                    user_id?: string | null;
                    viewed_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'views_shot_id_fkey';
                        columns: ['shot_id'];
                        isOneToOne: false;
                        referencedRelation: 'shots';
                        referencedColumns: ['id'];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
              DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
            DefaultSchema['Views'])
      ? (DefaultSchema['Tables'] &
            DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema['Tables']
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema['Tables']
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema['Enums']
        | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
      ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
      : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema['CompositeTypes']
        | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals;
    }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
        : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
      ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
      : never;

export const Constants = {
    public: {
        Enums: {},
    },
} as const;
