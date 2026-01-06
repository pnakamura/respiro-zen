-- Insert 6 MBSR-specific meditations
INSERT INTO meditation_tracks (title, description, category_id, duration_display, duration_ms, has_narration, has_background_music, display_order, is_active)
VALUES 
  ('Body Scan', 'Escaneamento corporal progressivo para consciência das sensações físicas. Técnica fundamental do MBSR.', '043882a5-a168-49e2-98bd-4076896e0eb8', '20:00', 1200000, true, true, 10, true),
  ('Meditação Mindfulness', 'Prática de atenção plena ao momento presente, observando pensamentos sem julgamento.', '02d05a72-03a5-4271-a283-a7ae718edee3', '15:00', 900000, true, true, 11, true),
  ('Bondade Amorosa (Metta)', 'Cultivar compaixão e amor incondicional por si mesmo e pelos outros através de frases de intenção.', '043882a5-a168-49e2-98bd-4076896e0eb8', '12:00', 720000, true, true, 12, true),
  ('Meditação da Uva Passa', 'Exercício clássico de alimentação consciente e atenção plena aos sentidos. Técnica introdutória do MBSR.', '02d05a72-03a5-4271-a283-a7ae718edee3', '10:00', 600000, true, false, 13, true),
  ('Meditação do Silêncio', 'Prática de contemplação e quietude interior, conectando-se com o espaço de paz interna.', 'd9a54989-53d5-4ca0-bf1b-fd06fcf3ba8a', '15:00', 900000, false, true, 14, true),
  ('Atenção à Respiração', 'Meditação focada na respiração consciente como âncora para o momento presente.', '043882a5-a168-49e2-98bd-4076896e0eb8', '10:00', 600000, true, true, 15, true);