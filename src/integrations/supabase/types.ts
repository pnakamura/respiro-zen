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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_email: string | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_email?: string | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_email?: string | null
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      assinatura_temporaria: {
        Row: {
          checkout_link: string | null
          created_at: string
          data_inicio: string | null
          email: string | null
          id: number
          plano_id: string | null
          status: string | null
          telefone: string | null
        }
        Insert: {
          checkout_link?: string | null
          created_at?: string
          data_inicio?: string | null
          email?: string | null
          id?: number
          plano_id?: string | null
          status?: string | null
          telefone?: string | null
        }
        Update: {
          checkout_link?: string | null
          created_at?: string
          data_inicio?: string | null
          email?: string | null
          id?: number
          plano_id?: string | null
          status?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      breathing_sessions: {
        Row: {
          completed_at: string
          cycles_completed: number
          duration_ms: number
          emotion_entry_id: string | null
          id: string
          technique_id: string | null
          technique_name: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          cycles_completed?: number
          duration_ms?: number
          emotion_entry_id?: string | null
          id?: string
          technique_id?: string | null
          technique_name: string
          user_id: string
        }
        Update: {
          completed_at?: string
          cycles_completed?: number
          duration_ms?: number
          emotion_entry_id?: string | null
          id?: string
          technique_id?: string | null
          technique_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "breathing_sessions_emotion_entry_id_fkey"
            columns: ["emotion_entry_id"]
            isOneToOne: false
            referencedRelation: "emotion_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breathing_sessions_technique_id_fkey"
            columns: ["technique_id"]
            isOneToOne: false
            referencedRelation: "breathing_techniques"
            referencedColumns: ["id"]
          },
        ]
      }
      breathing_techniques: {
        Row: {
          background_audio_url: string | null
          bg_class: string | null
          color_class: string | null
          created_at: string | null
          created_by: string | null
          cycles: number
          deleted_at: string | null
          description: string
          display_order: number | null
          emotion_id: string
          exhale_ms: number
          explanation: string | null
          hold_in_ms: number
          hold_out_ms: number
          icon: string | null
          id: string
          inhale_ms: number
          is_active: boolean | null
          is_special_technique: boolean | null
          label: string
          pattern_description: string | null
          pattern_name: string
          special_config: Json | null
          updated_at: string | null
        }
        Insert: {
          background_audio_url?: string | null
          bg_class?: string | null
          color_class?: string | null
          created_at?: string | null
          created_by?: string | null
          cycles?: number
          deleted_at?: string | null
          description: string
          display_order?: number | null
          emotion_id: string
          exhale_ms?: number
          explanation?: string | null
          hold_in_ms?: number
          hold_out_ms?: number
          icon?: string | null
          id?: string
          inhale_ms?: number
          is_active?: boolean | null
          is_special_technique?: boolean | null
          label: string
          pattern_description?: string | null
          pattern_name: string
          special_config?: Json | null
          updated_at?: string | null
        }
        Update: {
          background_audio_url?: string | null
          bg_class?: string | null
          color_class?: string | null
          created_at?: string | null
          created_by?: string | null
          cycles?: number
          deleted_at?: string | null
          description?: string
          display_order?: number | null
          emotion_id?: string
          exhale_ms?: number
          explanation?: string | null
          hold_in_ms?: number
          hold_out_ms?: number
          icon?: string | null
          id?: string
          inhale_ms?: number
          is_active?: boolean | null
          is_special_technique?: boolean | null
          label?: string
          pattern_description?: string | null
          pattern_name?: string
          special_config?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categorias_refeicao: {
        Row: {
          descricao: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: []
      }
      dependentes: {
        Row: {
          atualizado_em: string | null
          celular: string | null
          criado_em: string | null
          deletado_em: string | null
          email: string
          id: string
          nome_completo: string
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string | null
          celular?: string | null
          criado_em?: string | null
          deletado_em?: string | null
          email: string
          id?: string
          nome_completo: string
          usuario_id: string
        }
        Update: {
          atualizado_em?: string | null
          celular?: string | null
          criado_em?: string | null
          deletado_em?: string | null
          email?: string
          id?: string
          nome_completo?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dependentes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      emotion_entries: {
        Row: {
          created_at: string
          detected_dyads: Json | null
          free_text: string | null
          id: string
          recommended_treatment: Json | null
          selected_emotions: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          detected_dyads?: Json | null
          free_text?: string | null
          id?: string
          recommended_treatment?: Json | null
          selected_emotions?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          detected_dyads?: Json | null
          free_text?: string | null
          id?: string
          recommended_treatment?: Json | null
          selected_emotions?: Json
          user_id?: string
        }
        Relationships: []
      }
      emotion_nutrition_context: {
        Row: {
          created_at: string
          energy_after: string | null
          hunger_type: string
          id: string
          meal_category: string | null
          mindful_eating_notes: string | null
          mood_before: string
          nutrition_entry_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          energy_after?: string | null
          hunger_type?: string
          id?: string
          meal_category?: string | null
          mindful_eating_notes?: string | null
          mood_before: string
          nutrition_entry_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          energy_after?: string | null
          hunger_type?: string
          id?: string
          meal_category?: string | null
          mindful_eating_notes?: string | null
          mood_before?: string
          nutrition_entry_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotion_nutrition_context_nutrition_entry_id_fkey"
            columns: ["nutrition_entry_id"]
            isOneToOne: false
            referencedRelation: "informacoes_nutricionais"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_achievements: {
        Row: {
          code: string
          created_at: string
          criteria: Json
          description: string
          id: number
          points_award: number
          title: string
        }
        Insert: {
          code: string
          created_at?: string
          criteria?: Json
          description: string
          id?: number
          points_award?: number
          title: string
        }
        Update: {
          code?: string
          created_at?: string
          criteria?: Json
          description?: string
          id?: number
          points_award?: number
          title?: string
        }
        Relationships: []
      }
      gamification_user_achievements: {
        Row: {
          achievement_id: number
          unlocked_at: string
          usuario_id: string
        }
        Insert: {
          achievement_id: number
          unlocked_at?: string
          usuario_id: string
        }
        Update: {
          achievement_id?: number
          unlocked_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gamification_user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "gamification_achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gamification_user_achievements_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_user_stats: {
        Row: {
          atualizado_em: string
          conquistas_desbloqueadas: number
          melhor_sequencia: number
          nivel: number
          registros_agua_30_dias: number
          registros_nutricao_30_dias: number
          registros_peso_30_dias: number
          sequencia_atual: number
          total_conquistas: number
          total_pontos: number
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string
          conquistas_desbloqueadas?: number
          melhor_sequencia?: number
          nivel?: number
          registros_agua_30_dias?: number
          registros_nutricao_30_dias?: number
          registros_peso_30_dias?: number
          sequencia_atual?: number
          total_conquistas?: number
          total_pontos?: number
          usuario_id: string
        }
        Update: {
          atualizado_em?: string
          conquistas_desbloqueadas?: number
          melhor_sequencia?: number
          nivel?: number
          registros_agua_30_dias?: number
          registros_nutricao_30_dias?: number
          registros_peso_30_dias?: number
          sequencia_atual?: number
          total_conquistas?: number
          total_pontos?: number
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gamification_user_stats_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_conversations: {
        Row: {
          created_at: string | null
          guide_id: string
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          guide_id: string
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          guide_id?: string
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_conversations_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "spiritual_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "guide_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      informacoes_nutricionais: {
        Row: {
          calorias: number | null
          carboidratos: number | null
          categoria_refeicao_id: string | null
          dados_n8n: Json | null
          dados_raw_ia: Json | null
          data_registro: string | null
          deletado_em: string | null
          descricao_ia: string | null
          gorduras: number | null
          id: string
          proteinas: number | null
          usuario_id: string
        }
        Insert: {
          calorias?: number | null
          carboidratos?: number | null
          categoria_refeicao_id?: string | null
          dados_n8n?: Json | null
          dados_raw_ia?: Json | null
          data_registro?: string | null
          deletado_em?: string | null
          descricao_ia?: string | null
          gorduras?: number | null
          id?: string
          proteinas?: number | null
          usuario_id: string
        }
        Update: {
          calorias?: number | null
          carboidratos?: number | null
          categoria_refeicao_id?: string | null
          dados_n8n?: Json | null
          dados_raw_ia?: Json | null
          data_registro?: string | null
          deletado_em?: string | null
          descricao_ia?: string | null
          gorduras?: number | null
          id?: string
          proteinas?: number | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "informacoes_nutricionais_categoria_refeicao_id_fkey"
            columns: ["categoria_refeicao_id"]
            isOneToOne: false
            referencedRelation: "categorias_refeicao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "informacoes_nutricionais_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          detected_emotions: Json | null
          emotion_entry_id: string | null
          id: string
          updated_at: string
          user_id: string
          word_count: number
        }
        Insert: {
          content: string
          created_at?: string
          detected_emotions?: Json | null
          emotion_entry_id?: string | null
          id?: string
          updated_at?: string
          user_id: string
          word_count?: number
        }
        Update: {
          content?: string
          created_at?: string
          detected_emotions?: Json | null
          emotion_entry_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_emotion_entry_id_fkey"
            columns: ["emotion_entry_id"]
            isOneToOne: false
            referencedRelation: "emotion_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_day_completions: {
        Row: {
          challenge_done: boolean | null
          completed_at: string | null
          day_number: number
          id: string
          mood_after: string | null
          mood_before: string | null
          practice_done: boolean | null
          reflection_note: string | null
          teaching_read: boolean | null
          user_journey_id: string
        }
        Insert: {
          challenge_done?: boolean | null
          completed_at?: string | null
          day_number: number
          id?: string
          mood_after?: string | null
          mood_before?: string | null
          practice_done?: boolean | null
          reflection_note?: string | null
          teaching_read?: boolean | null
          user_journey_id: string
        }
        Update: {
          challenge_done?: boolean | null
          completed_at?: string | null
          day_number?: number
          id?: string
          mood_after?: string | null
          mood_before?: string | null
          practice_done?: boolean | null
          reflection_note?: string | null
          teaching_read?: boolean | null
          user_journey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_day_completions_user_journey_id_fkey"
            columns: ["user_journey_id"]
            isOneToOne: false
            referencedRelation: "user_journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_days: {
        Row: {
          activity_description: string | null
          activity_type: string | null
          bonus_tip: string | null
          challenge_description: string | null
          challenge_title: string | null
          created_at: string | null
          day_number: number
          id: string
          journey_id: string
          reflection_prompt: string | null
          suggested_breathing_id: string | null
          suggested_meditation_id: string | null
          teaching_author: string | null
          teaching_text: string
          title: string
        }
        Insert: {
          activity_description?: string | null
          activity_type?: string | null
          bonus_tip?: string | null
          challenge_description?: string | null
          challenge_title?: string | null
          created_at?: string | null
          day_number: number
          id?: string
          journey_id: string
          reflection_prompt?: string | null
          suggested_breathing_id?: string | null
          suggested_meditation_id?: string | null
          teaching_author?: string | null
          teaching_text: string
          title: string
        }
        Update: {
          activity_description?: string | null
          activity_type?: string | null
          bonus_tip?: string | null
          challenge_description?: string | null
          challenge_title?: string | null
          created_at?: string | null
          day_number?: number
          id?: string
          journey_id?: string
          reflection_prompt?: string | null
          suggested_breathing_id?: string | null
          suggested_meditation_id?: string | null
          teaching_author?: string | null
          teaching_text?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_days_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_days_suggested_breathing_id_fkey"
            columns: ["suggested_breathing_id"]
            isOneToOne: false
            referencedRelation: "breathing_techniques"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_days_suggested_meditation_id_fkey"
            columns: ["suggested_meditation_id"]
            isOneToOne: false
            referencedRelation: "meditation_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      journeys: {
        Row: {
          benefits: Json | null
          category: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string
          difficulty: string | null
          display_order: number | null
          duration_days: number
          icon: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          subtitle: string | null
          theme_color: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          benefits?: Json | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description: string
          difficulty?: string | null
          display_order?: number | null
          duration_days?: number
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          subtitle?: string | null
          theme_color?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          benefits?: Json | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string
          difficulty?: string | null
          display_order?: number | null
          duration_days?: number
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          subtitle?: string | null
          theme_color?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lembretes_automaticos: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          deletado_em: string | null
          dias_semana: string
          horario: string
          id: string
          tipo_lembrete: Database["public"]["Enums"]["tipo_lembrete"]
          usuario_id: string
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          deletado_em?: string | null
          dias_semana: string
          horario: string
          id?: string
          tipo_lembrete: Database["public"]["Enums"]["tipo_lembrete"]
          usuario_id: string
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          deletado_em?: string | null
          dias_semana?: string
          horario?: string
          id?: string
          tipo_lembrete?: Database["public"]["Enums"]["tipo_lembrete"]
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lembretes_automaticos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      meditation_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      meditation_tracks: {
        Row: {
          background_audio_url: string | null
          category_id: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string | null
          display_order: number | null
          duration_display: string
          duration_ms: number
          has_background_music: boolean | null
          has_narration: boolean | null
          id: string
          is_active: boolean | null
          narration_audio_url: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_audio_url?: string | null
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_display: string
          duration_ms: number
          has_background_music?: boolean | null
          has_narration?: boolean | null
          id?: string
          is_active?: boolean | null
          narration_audio_url?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_audio_url?: string | null
          category_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_display?: string
          duration_ms?: number
          has_background_music?: boolean | null
          has_narration?: boolean | null
          id?: string
          is_active?: boolean | null
          narration_audio_url?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meditation_tracks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "meditation_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      metas_usuario: {
        Row: {
          agua_diaria_ml: number | null
          atualizado_em: string | null
          calorias_diarias: number | null
          peso_objetivo: number | null
          usuario_id: string
        }
        Insert: {
          agua_diaria_ml?: number | null
          atualizado_em?: string | null
          calorias_diarias?: number | null
          peso_objetivo?: number | null
          usuario_id: string
        }
        Update: {
          agua_diaria_ml?: number | null
          atualizado_em?: string | null
          calorias_diarias?: number | null
          peso_objetivo?: number | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "metas_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      moda_teste: {
        Row: {
          created_at: string
          etapa: string | null
          id: number
          image_1: string | null
          image_2: string | null
          whatsapp_id: string | null
        }
        Insert: {
          created_at?: string
          etapa?: string | null
          id?: number
          image_1?: string | null
          image_2?: string | null
          whatsapp_id?: string | null
        }
        Update: {
          created_at?: string
          etapa?: string | null
          id?: number
          image_1?: string | null
          image_2?: string | null
          whatsapp_id?: string | null
        }
        Relationships: []
      }
      notificacoes: {
        Row: {
          horario_notificacoes: string | null
          lembrete_agua: boolean | null
          lembrete_refeicao: boolean | null
          usuario_id: string
        }
        Insert: {
          horario_notificacoes?: string | null
          lembrete_agua?: boolean | null
          lembrete_refeicao?: boolean | null
          usuario_id: string
        }
        Update: {
          horario_notificacoes?: string | null
          lembrete_agua?: boolean | null
          lembrete_refeicao?: boolean | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      objetivos_usuario: {
        Row: {
          data_inicio: string
          data_meta: string | null
          descricao: string | null
          nivel_dificuldade:
            | Database["public"]["Enums"]["tipo_nivel_dificuldade"]
            | null
          peso_desejado: number | null
          taxa_semanal_esperada: number | null
          tipo_objetivo: Database["public"]["Enums"]["tipo_objetivo"]
          usuario_id: string
        }
        Insert: {
          data_inicio: string
          data_meta?: string | null
          descricao?: string | null
          nivel_dificuldade?:
            | Database["public"]["Enums"]["tipo_nivel_dificuldade"]
            | null
          peso_desejado?: number | null
          taxa_semanal_esperada?: number | null
          tipo_objetivo: Database["public"]["Enums"]["tipo_objetivo"]
          usuario_id: string
        }
        Update: {
          data_inicio?: string
          data_meta?: string | null
          descricao?: string | null
          nivel_dificuldade?:
            | Database["public"]["Enums"]["tipo_nivel_dificuldade"]
            | null
          peso_desejado?: number | null
          taxa_semanal_esperada?: number | null
          tipo_objetivo?: Database["public"]["Enums"]["tipo_objetivo"]
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "objetivos_usuario_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          codigo_transacao: string
          data_pagamento: string | null
          deletado_em: string | null
          forma_pagamento: string
          id: string
          plano_id: string
          status_pagamento: Database["public"]["Enums"]["tipo_status_pagamento"]
          usuario_id: string
          valor_pago: number
        }
        Insert: {
          codigo_transacao: string
          data_pagamento?: string | null
          deletado_em?: string | null
          forma_pagamento: string
          id?: string
          plano_id: string
          status_pagamento: Database["public"]["Enums"]["tipo_status_pagamento"]
          usuario_id: string
          valor_pago: number
        }
        Update: {
          codigo_transacao?: string
          data_pagamento?: string | null
          deletado_em?: string | null
          forma_pagamento?: string
          id?: string
          plano_id?: string
          status_pagamento?: Database["public"]["Enums"]["tipo_status_pagamento"]
          usuario_id?: string
          valor_pago?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          action: string | null
          ativo: boolean | null
          checkout_plano_id: string | null
          checkout_signature_link: string | null
          criado_em: string | null
          deletado_em: string | null
          descricao: string | null
          eh_plano_gestor: boolean | null
          features: string | null
          id: string
          max_dependentes: number | null
          nome_plano: string
          periodo: string | null
          popular: boolean | null
          valor: number
        }
        Insert: {
          action?: string | null
          ativo?: boolean | null
          checkout_plano_id?: string | null
          checkout_signature_link?: string | null
          criado_em?: string | null
          deletado_em?: string | null
          descricao?: string | null
          eh_plano_gestor?: boolean | null
          features?: string | null
          id?: string
          max_dependentes?: number | null
          nome_plano: string
          periodo?: string | null
          popular?: boolean | null
          valor: number
        }
        Update: {
          action?: string | null
          ativo?: boolean | null
          checkout_plano_id?: string | null
          checkout_signature_link?: string | null
          criado_em?: string | null
          deletado_em?: string | null
          descricao?: string | null
          eh_plano_gestor?: boolean | null
          features?: string | null
          id?: string
          max_dependentes?: number | null
          nome_plano?: string
          periodo?: string | null
          popular?: boolean | null
          valor?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          peso_atual_kg: number | null
          plano_id: string | null
          role: string | null
          updated_at: string
          user_id: string
          whatsapp_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          peso_atual_kg?: number | null
          plano_id?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
          whatsapp_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          peso_atual_kg?: number | null
          plano_id?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
          whatsapp_id?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          attempt_count: number
          blocked_until: string | null
          created_at: string
          first_attempt_at: string
          id: string
          last_attempt_at: string
          throttle_key: string
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string
          first_attempt_at?: string
          id?: string
          last_attempt_at?: string
          throttle_key: string
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          blocked_until?: string | null
          created_at?: string
          first_attempt_at?: string
          id?: string
          last_attempt_at?: string
          throttle_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      registro_exercicios: {
        Row: {
          calorias_gastas: number | null
          data_exercicio: string
          deletado_em: string | null
          duracao_minutos: number | null
          id: string
          intensidade:
            | Database["public"]["Enums"]["tipo_intensidade_exercicio"]
            | null
          observacoes: string | null
          tipo_exercicio: string
          usuario_id: string
        }
        Insert: {
          calorias_gastas?: number | null
          data_exercicio?: string
          deletado_em?: string | null
          duracao_minutos?: number | null
          id?: string
          intensidade?:
            | Database["public"]["Enums"]["tipo_intensidade_exercicio"]
            | null
          observacoes?: string | null
          tipo_exercicio: string
          usuario_id: string
        }
        Update: {
          calorias_gastas?: number | null
          data_exercicio?: string
          deletado_em?: string | null
          duracao_minutos?: number | null
          id?: string
          intensidade?:
            | Database["public"]["Enums"]["tipo_intensidade_exercicio"]
            | null
          observacoes?: string | null
          tipo_exercicio?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registro_exercicios_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      registro_hidratacao: {
        Row: {
          deletado_em: string | null
          horario: string | null
          id: string
          quantidade_ml: number
          tipo_liquido: Database["public"]["Enums"]["tipo_liquido"] | null
          usuario_id: string
        }
        Insert: {
          deletado_em?: string | null
          horario?: string | null
          id?: string
          quantidade_ml: number
          tipo_liquido?: Database["public"]["Enums"]["tipo_liquido"] | null
          usuario_id: string
        }
        Update: {
          deletado_em?: string | null
          horario?: string | null
          id?: string
          quantidade_ml?: number
          tipo_liquido?: Database["public"]["Enums"]["tipo_liquido"] | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registro_hidratacao_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      registro_medidas: {
        Row: {
          altura_cm: number | null
          circunferencia_cintura: number | null
          circunferencia_quadril: number | null
          data_registro: string
          deletado_em: string | null
          id: string
          usuario_id: string
        }
        Insert: {
          altura_cm?: number | null
          circunferencia_cintura?: number | null
          circunferencia_quadril?: number | null
          data_registro?: string
          deletado_em?: string | null
          id?: string
          usuario_id: string
        }
        Update: {
          altura_cm?: number | null
          circunferencia_cintura?: number | null
          circunferencia_quadril?: number | null
          data_registro?: string
          deletado_em?: string | null
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registro_medidas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      registro_peso: {
        Row: {
          data_registro: string
          deletado_em: string | null
          id: string
          observacoes: string | null
          peso_kg: number
          usuario_id: string
        }
        Insert: {
          data_registro?: string
          deletado_em?: string | null
          id?: string
          observacoes?: string | null
          peso_kg: number
          usuario_id: string
        }
        Update: {
          data_registro?: string
          deletado_em?: string | null
          id?: string
          observacoes?: string | null
          peso_kg?: number
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registro_peso_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      relatorios_semanais: {
        Row: {
          comparacao_semanal: Json | null
          criado_em: string | null
          dados_nutricionais: Json
          data_fim: string
          data_inicio: string
          enviado_em: string | null
          html_content: string | null
          id: string
          insights: string | null
          status_envio: Database["public"]["Enums"]["tipo_status_envio"] | null
          usuario_id: string
        }
        Insert: {
          comparacao_semanal?: Json | null
          criado_em?: string | null
          dados_nutricionais: Json
          data_fim: string
          data_inicio: string
          enviado_em?: string | null
          html_content?: string | null
          id?: string
          insights?: string | null
          status_envio?: Database["public"]["Enums"]["tipo_status_envio"] | null
          usuario_id: string
        }
        Update: {
          comparacao_semanal?: Json | null
          criado_em?: string | null
          dados_nutricionais?: Json
          data_fim?: string
          data_inicio?: string
          enviado_em?: string | null
          html_content?: string | null
          id?: string
          insights?: string | null
          status_envio?: Database["public"]["Enums"]["tipo_status_envio"] | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatorios_semanais_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      spiritual_guides: {
        Row: {
          approach: string
          avatar_emoji: string | null
          created_at: string | null
          description: string
          display_order: number | null
          example_messages: Json | null
          id: string
          is_active: boolean | null
          name: string
          personality_traits: Json | null
          suggested_questions: Json | null
          system_prompt: string
          topics: Json | null
          updated_at: string | null
          welcome_message: string | null
        }
        Insert: {
          approach: string
          avatar_emoji?: string | null
          created_at?: string | null
          description: string
          display_order?: number | null
          example_messages?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          personality_traits?: Json | null
          suggested_questions?: Json | null
          system_prompt: string
          topics?: Json | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Update: {
          approach?: string
          avatar_emoji?: string | null
          created_at?: string | null
          description?: string
          display_order?: number | null
          example_messages?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          personality_traits?: Json | null
          suggested_questions?: Json | null
          system_prompt?: string
          topics?: Json | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      user_accessibility_settings: {
        Row: {
          created_at: string
          font_scale: string
          high_contrast: boolean
          reduce_motion: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          font_scale?: string
          high_contrast?: boolean
          reduce_motion?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          font_scale?: string
          high_contrast?: boolean
          reduce_motion?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_guide_preferences: {
        Row: {
          created_at: string | null
          preferred_guide_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          preferred_guide_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          preferred_guide_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_guide_preferences_preferred_guide_id_fkey"
            columns: ["preferred_guide_id"]
            isOneToOne: false
            referencedRelation: "spiritual_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      user_journeys: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_day: number | null
          id: string
          is_active: boolean | null
          journey_id: string
          last_activity_at: string | null
          started_at: string | null
          streak_count: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_day?: number | null
          id?: string
          is_active?: boolean | null
          journey_id: string
          last_activity_at?: string | null
          started_at?: string | null
          streak_count?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_day?: number | null
          id?: string
          is_active?: boolean | null
          journey_id?: string
          last_activity_at?: string | null
          started_at?: string | null
          streak_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_journeys_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          admin_responsavel_id: string | null
          atualizado_em: string | null
          celular: string | null
          checkout_payer_id: string | null
          CPF: string | null
          data_de_expiracao: string | null
          data_de_inscricao: string | null
          email: string | null
          endereco: string | null
          id: string
          nome_completo: string | null
          peso_atual_kg: number | null
          plano: string | null
          plano_id: string | null
          receber_relatorio_semanal: boolean | null
          status: Database["public"]["Enums"]["tipo_status_assinatura"] | null
          tipo_usuario: Database["public"]["Enums"]["tipo_usuario"] | null
          valor: string | null
          whatsapp_id: string | null
        }
        Insert: {
          admin_responsavel_id?: string | null
          atualizado_em?: string | null
          celular?: string | null
          checkout_payer_id?: string | null
          CPF?: string | null
          data_de_expiracao?: string | null
          data_de_inscricao?: string | null
          email?: string | null
          endereco?: string | null
          id: string
          nome_completo?: string | null
          peso_atual_kg?: number | null
          plano?: string | null
          plano_id?: string | null
          receber_relatorio_semanal?: boolean | null
          status?: Database["public"]["Enums"]["tipo_status_assinatura"] | null
          tipo_usuario?: Database["public"]["Enums"]["tipo_usuario"] | null
          valor?: string | null
          whatsapp_id?: string | null
        }
        Update: {
          admin_responsavel_id?: string | null
          atualizado_em?: string | null
          celular?: string | null
          checkout_payer_id?: string | null
          CPF?: string | null
          data_de_expiracao?: string | null
          data_de_inscricao?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome_completo?: string | null
          peso_atual_kg?: number | null
          plano?: string | null
          plano_id?: string | null
          receber_relatorio_semanal?: boolean | null
          status?: Database["public"]["Enums"]["tipo_status_assinatura"] | null
          tipo_usuario?: Database["public"]["Enums"]["tipo_usuario"] | null
          valor?: string | null
          whatsapp_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_admin_responsavel"
            columns: ["admin_responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios_admin: {
        Row: {
          atualizado_em: string | null
          data_ativacao: string | null
          data_expiracao_plano: string | null
          id: string
          max_dependentes: number | null
          notificacoes_habilitadas: boolean | null
          plano_ativo: boolean | null
          pode_gerenciar_planos: boolean | null
          pode_visualizar_tudo: boolean | null
          usuario_id: string
        }
        Insert: {
          atualizado_em?: string | null
          data_ativacao?: string | null
          data_expiracao_plano?: string | null
          id?: string
          max_dependentes?: number | null
          notificacoes_habilitadas?: boolean | null
          plano_ativo?: boolean | null
          pode_gerenciar_planos?: boolean | null
          pode_visualizar_tudo?: boolean | null
          usuario_id: string
        }
        Update: {
          atualizado_em?: string | null
          data_ativacao?: string | null
          data_expiracao_plano?: string | null
          id?: string
          max_dependentes?: number | null
          notificacoes_habilitadas?: boolean | null
          plano_ativo?: boolean | null
          pode_gerenciar_planos?: boolean | null
          pode_visualizar_tudo?: boolean | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_admin_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      vinculos_usuarios: {
        Row: {
          ativo: boolean | null
          data_vinculo: string | null
          tipo_vinculo: Database["public"]["Enums"]["tipo_vinculo"]
          usuario_id: string
          usuario_principal_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          data_vinculo?: string | null
          tipo_vinculo: Database["public"]["Enums"]["tipo_vinculo"]
          usuario_id: string
          usuario_principal_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          data_vinculo?: string | null
          tipo_vinculo?: Database["public"]["Enums"]["tipo_vinculo"]
          usuario_id?: string
          usuario_principal_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vinculos_usuarios_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vinculos_usuarios_usuario_principal_id_fkey"
            columns: ["usuario_principal_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_links: {
        Row: {
          data_envio_email: string | null
          deletado_em: string | null
          id: string
          link: string
          status: Database["public"]["Enums"]["tipo_link_status"] | null
          usuario_id: string
        }
        Insert: {
          data_envio_email?: string | null
          deletado_em?: string | null
          id?: string
          link: string
          status?: Database["public"]["Enums"]["tipo_link_status"] | null
          usuario_id: string
        }
        Update: {
          data_envio_email?: string | null
          deletado_em?: string | null
          id?: string
          link?: string
          status?: Database["public"]["Enums"]["tipo_link_status"] | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_links_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_achievement: {
        Args: { achievement_code: string; u_id: string }
        Returns: boolean
      }
      can_gestor_access_user: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      can_manage_dependents: { Args: never; Returns: boolean }
      can_manage_user_type: {
        Args: { target_user_type: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_max_attempts?: number
          p_throttle_key: string
          p_window_minutes?: number
        }
        Returns: Json
      }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      compute_user_streak: {
        Args: { u_id: string }
        Returns: {
          best_streak: number
          current_streak: number
        }[]
      }
      evaluate_user_achievements: { Args: { u_id: string }; Returns: number }
      get_current_user_role: { Args: never; Returns: string }
      get_gamification_all_users: {
        Args: never
        Returns: {
          email: string
          nivel: number
          nome_completo: string
          registros_agua_30_dias: number
          registros_nutricao_30_dias: number
          registros_peso_30_dias: number
          tipo_usuario: string
          total_pontos: number
          usuario_id: string
        }[]
      }
      get_user_achievements: {
        Args: { u_id?: string }
        Returns: {
          code: string
          description: string
          id: number
          points_award: number
          title: string
          unlocked: boolean
          unlocked_at: string
        }[]
      }
      get_user_achievements_progress: {
        Args: { u_id?: string }
        Returns: {
          code: string
          description: string
          id: number
          points_award: number
          progress_value: number
          target_value: number
          title: string
          unlocked: boolean
          unlocked_at: string
        }[]
      }
      get_user_dashboard_data: {
        Args: { user_id: string }
        Returns: {
          agua_hoje: number
          calorias_hoje: number
          meta_agua: number
          meta_calorias: number
          meta_peso: number
          peso_atual: number
          registros_agua_30_dias: number
          registros_nutricao_30_dias: number
          registros_peso_30_dias: number
          ultimo_peso: number
        }[]
      }
      get_user_gamification_stats:
        | {
            Args: never
            Returns: {
              conquistas_desbloqueadas: number
              melhor_sequencia: number
              nivel: number
              registros_agua_30_dias: number
              registros_nutricao_30_dias: number
              registros_peso_30_dias: number
              sequencia_atual: number
              total_conquistas: number
              total_pontos: number
            }[]
          }
        | {
            Args: { u_id?: string }
            Returns: {
              conquistas_desbloqueadas: number
              melhor_sequencia: number
              nivel: number
              registros_agua_30_dias: number
              registros_nutricao_30_dias: number
              registros_peso_30_dias: number
              sequencia_atual: number
              total_conquistas: number
              total_pontos: number
            }[]
          }
      get_user_stats: {
        Args: never
        Returns: {
          total_clientes: number
          total_dependentes: number
          total_gestores: number
          total_socios: number
          total_usuarios: number
          usuarios_ativos_30_dias: number
        }[]
      }
      get_user_stats_by_role: {
        Args: never
        Returns: {
          total_clientes: number
          total_dependentes: number
          total_gestores: number
          total_socios: number
          total_usuarios: number
          usuarios_ativos_30_dias: number
        }[]
      }
      has_higher_or_equal_privilege: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
      is_current_user: { Args: { user_id: string }; Returns: boolean }
      is_socio: { Args: { user_id?: string }; Returns: boolean }
      log_admin_action: {
        Args: {
          action_details?: Json
          action_type: string
          target_email?: string
          target_user_id?: string
        }
        Returns: undefined
      }
      make_user_admin: { Args: { user_email: string }; Returns: undefined }
      refresh_user_gamification: {
        Args: { u_id?: string }
        Returns: {
          atualizado_em: string
          conquistas_desbloqueadas: number
          melhor_sequencia: number
          nivel: number
          registros_agua_30_dias: number
          registros_nutricao_30_dias: number
          registros_peso_30_dias: number
          sequencia_atual: number
          total_conquistas: number
          total_pontos: number
          usuario_id: string
        }
        SetofOptions: {
          from: "*"
          to: "gamification_user_stats"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      tipo_ciclo_faturamento: "mensal" | "trimestral" | "semestral" | "anual"
      tipo_intensidade_exercicio: "leve" | "moderada" | "intensa"
      tipo_lembrete: "água" | "refeição" | "exercício" | "peso"
      tipo_link_status: "pendente" | "enviado" | "erro"
      tipo_liquido: "água" | "chá" | "café" | "suco" | "outro"
      tipo_nivel_dificuldade: "iniciante" | "intermediario" | "avancado"
      tipo_objetivo:
        | "perda_peso"
        | "ganho_massa"
        | "manutencao"
        | "melhorar_saude"
      tipo_status_assinatura: "ativa" | "cancelada" | "suspensa" | "expirada"
      tipo_status_envio: "pendente" | "enviado" | "falha"
      tipo_status_pagamento: "aprovado" | "pendente" | "falhou"
      tipo_usuario: "cliente" | "socio" | "gestor" | "dependente"
      tipo_vinculo:
        | "titular"
        | "dependente"
        | "profissional"
        | "gestor"
        | "socio"
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
      tipo_ciclo_faturamento: ["mensal", "trimestral", "semestral", "anual"],
      tipo_intensidade_exercicio: ["leve", "moderada", "intensa"],
      tipo_lembrete: ["água", "refeição", "exercício", "peso"],
      tipo_link_status: ["pendente", "enviado", "erro"],
      tipo_liquido: ["água", "chá", "café", "suco", "outro"],
      tipo_nivel_dificuldade: ["iniciante", "intermediario", "avancado"],
      tipo_objetivo: [
        "perda_peso",
        "ganho_massa",
        "manutencao",
        "melhorar_saude",
      ],
      tipo_status_assinatura: ["ativa", "cancelada", "suspensa", "expirada"],
      tipo_status_envio: ["pendente", "enviado", "falha"],
      tipo_status_pagamento: ["aprovado", "pendente", "falhou"],
      tipo_usuario: ["cliente", "socio", "gestor", "dependente"],
      tipo_vinculo: [
        "titular",
        "dependente",
        "profissional",
        "gestor",
        "socio",
      ],
    },
  },
} as const
