-- Atualiza o status do usuário para ativa (valor correto do enum)
UPDATE usuarios 
SET status = 'ativa' 
WHERE email = 'paulo.nakamura@atitude45.com.br';