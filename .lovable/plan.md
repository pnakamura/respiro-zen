
## ✅ Implementado: Respostas Divididas em Múltiplas Bolhas com Pausas

### Arquivos Criados/Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/hooks/useMessageChunker.ts` | **CRIADO** - Lógica de divisão de mensagens em chunks naturais |
| `src/hooks/useGuideChat.ts` | Modificado para usar chunking e delays entre segmentos |
| `src/pages/GuideChat.tsx` | Adicionado estado de "pausing" entre bolhas |
| `src/components/guide/MessageBubble.tsx` | Suporte visual para chunks (oculta nome/avatar em continuações) |

### Funcionalidades Implementadas

1. **Divisão Inteligente de Mensagens**
   - Divide por parágrafos (`\n\n`)
   - Divide frases longas após ~250 caracteres
   - Mantém pontuação e formatação intactas

2. **Pausas entre Bolhas**
   - Base: 2000-2500ms entre chunks
   - Bônus por tamanho do chunk (até 1800ms extra)
   - Bônus para conteúdo emocional (+1200ms)
   - Variação aleatória para naturalidade

3. **Indicador Visual "Pensando..."**
   - Aparece entre as bolhas durante as pausas
   - Avatar continua pulsando suavemente

4. **Continuação Visual Limpa**
   - Primeiro chunk mostra nome e avatar do guia
   - Chunks subsequentes omitem nome/avatar (mantém alinhamento)

### Experiência do Usuário

- Respostas longas aparecem em 2-5 bolhas separadas
- Pausas de 2.5-5 segundos entre cada bolha
- Sensação de conversa real com tempo para reflexão
