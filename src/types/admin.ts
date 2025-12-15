export interface BreathingTechnique {
  id: string;
  emotion_id: string;
  label: string;
  description: string;
  explanation: string | null;
  icon: string;
  color_class: string;
  bg_class: string;
  inhale_ms: number;
  hold_in_ms: number;
  exhale_ms: number;
  hold_out_ms: number;
  pattern_name: string;
  pattern_description: string | null;
  cycles: number;
  is_special_technique: boolean;
  special_config: Record<string, unknown>;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  deleted_at: string | null;
  background_audio_url: string | null;
}

export interface MeditationCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MeditationTrack {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  duration_display: string;
  duration_ms: number;
  background_audio_url: string | null;
  narration_audio_url: string | null;
  thumbnail_url: string | null;
  has_background_music: boolean;
  has_narration: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  deleted_at: string | null;
  category?: MeditationCategory;
}

export type BreathingTechniqueInsert = Omit<BreathingTechnique, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type BreathingTechniqueUpdate = Partial<BreathingTechniqueInsert>;

export type MeditationTrackInsert = Omit<MeditationTrack, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'category'>;
export type MeditationTrackUpdate = Partial<MeditationTrackInsert>;

export type MeditationCategoryInsert = Omit<MeditationCategory, 'id' | 'created_at'>;
export type MeditationCategoryUpdate = Partial<MeditationCategoryInsert>;
