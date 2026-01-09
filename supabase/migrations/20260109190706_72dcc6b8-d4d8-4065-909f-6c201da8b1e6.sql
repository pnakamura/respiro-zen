-- Marcar técnicas de respiração como premium para teste
UPDATE breathing_techniques 
SET access_level = 'premium' 
WHERE label IN ('Wim Hof', 'Narina Alternada');

-- Marcar jornadas como premium para teste  
UPDATE journeys 
SET is_premium = true 
WHERE title IN ('Despertar dos Chakras', 'MBSR - Redução de Estresse');

-- Marcar algumas meditações como premium (se não estiverem)
UPDATE meditation_tracks
SET access_level = 'premium'
WHERE title IN ('Meditação do Silêncio', 'Meditação Metta');