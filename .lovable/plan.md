

## Plano: Ajustar Pausas e Mensagens Entre Chunks

### Problemas Identificados

1. **Indicador inconsistente**: O estado `pausing` não está sendo gerenciado de forma consistente, fazendo com que o indicador de "digitando..." às vezes não apareça entre chunks.

2. **Frases genéricas demais**: Frases como "deixe-me me preparar..." aparecem em todos os contextos, quando deveriam aparecer principalmente após perguntas do usuário.

3. **Lógica de pausas inadequada**: O bônus de reticências (`ellipsisBonus`) verifica o chunk anterior do assistente, não o contexto da mensagem do usuário.

---

### Solução

Criar um sistema de pausas contextual que:
- Mostra indicador de "digitando..." consistentemente entre chunks
- Usa frases reflexivas apenas após perguntas do usuário
- Entre chunks normais, mostra apenas os pontos animados (sem frase)

---

### 1. Atualizar Frases por Tipo de Pausa

**Arquivo:** `src/hooks/useThinkingDelay.ts`

Adicionar nova categoria `pause` para pausas entre chunks (sem frases elaboradas):

```text
thinkingPhrasesByContext:
  pause: ['', '...']  // Mínimo ou vazio - apenas indicador visual
  
  // Manter as outras categorias existentes para uso antes da primeira resposta
```

---

### 2. Diferenciar Tipos de Pausa

**Arquivo:** `src/hooks/useMessageChunker.ts`

Adicionar propriedade `pauseType` aos chunks para indicar quando usar frase ou não:

```text
ChunkInfo:
  pauseType: 'simple' | 'reflective'
  
Lógica:
- Primeiro chunk após pergunta (?) do usuário: 'reflective'
- Todos os outros chunks: 'simple' (apenas pontos animados)
```

---

### 3. Propagar Contexto do Usuário

**Arquivo:** `src/hooks/useGuideChat.ts`

Passar o contexto da última mensagem do usuário para `processResponseIntoChunks`:

```text
const userQuestion = lastUserMessage?.content?.trim().endsWith('?');

processResponseIntoChunks(fullContent, baseMessageId, { 
  isAfterQuestion: userQuestion 
});
```

---

### 4. Atualizar TypingIndicator para Pausas Simples

**Arquivo:** `src/components/guide/TypingIndicator.tsx`

Modificar para aceitar prop `variant`:
- `thinking`: Mostra frase + pontos (comportamento atual para leitura/pensamento inicial)
- `simple`: Mostra apenas pontos animados (para pausas entre chunks)

```text
interface TypingIndicatorProps {
  variant?: 'thinking' | 'simple';
  // ...
}
```

---

### 5. Atualizar Lógica de Exibição

**Arquivo:** `src/pages/GuideChat.tsx`

Diferenciar o tipo de indicador baseado na fase e contexto:

```text
// Para fase 'pausing':
// - Se última mensagem do usuário foi pergunta E é o primeiro chunk: mostrar frase reflexiva
// - Senão: mostrar apenas pontos

const pauseVariant = phase === 'pausing' 
  ? (lastUserMessageContext === 'question' && currentChunkIndex === 0 ? 'thinking' : 'simple')
  : 'thinking';
```

---

### 6. Remover Bônus de Reticências Desnecessário

**Arquivo:** `src/hooks/useMessageChunker.ts`

Remover ou reduzir o `ellipsisBonus` que adiciona pausa extra quando chunk anterior termina com "...":

```text
// Antes:
const ellipsisBonus = prevChunk?.endsWith('...') ? 800 : 0;

// Depois:
// Remover - não é necessário pausar extra por reticências do assistente
```

---

### 7. Garantir Consistência do Estado

**Arquivo:** `src/hooks/useGuideChat.ts`

Garantir que `setIsPausing(true)` seja chamado ANTES do delay e `setIsPausing(false)` DEPOIS:

```text
// Antes de cada chunk subsequente:
setIsPausing(true);
onChunkPause?.(i, chunks.length);
await new Promise(resolve => setTimeout(resolve, chunk.delay));
setIsPausing(false);
```

---

### Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/hooks/useThinkingDelay.ts` | Adicionar categoria `pause` com frases mínimas |
| `src/hooks/useMessageChunker.ts` | Adicionar `pauseType`, remover `ellipsisBonus`, aceitar contexto |
| `src/hooks/useGuideChat.ts` | Passar contexto do usuário para chunker |
| `src/components/guide/TypingIndicator.tsx` | Adicionar variante `simple` (só pontos) |
| `src/pages/GuideChat.tsx` | Usar variante correta do indicador baseado em contexto |

---

### Comportamento Esperado

**Cenário 1: Usuário faz pergunta**
```text
[Usuário] Como posso meditar melhor?

[Indicador: "Boa pergunta..." + pontos] (3-5s)
[Guia] Existem várias técnicas que podem ajudar.

[Indicador: apenas pontos] (2-3s)
[Guia] Primeiro, encontre um lugar calmo...

[Indicador: apenas pontos] (2-3s)
[Guia] Com prática, ficará mais natural.
```

**Cenário 2: Usuário faz afirmação**
```text
[Usuário] Estou me sentindo melhor hoje.

[Indicador: "Acolhendo suas palavras..." + pontos] (3-5s)
[Guia] Que bom ouvir isso!

[Indicador: apenas pontos] (2-3s)
[Guia] É importante celebrar essas vitórias.
```

---

### Seção Técnica

**Estrutura do ChunkInfo atualizada:**
```typescript
interface ChunkInfo {
  id: string;
  content: string;
  delay: number;
  isFirst: boolean;
  isLast: boolean;
  pauseType: 'simple' | 'reflective';
}
```

**Nova lógica de delay sem ellipsisBonus:**
```typescript
export function getChunkDelay(
  chunk: string, 
  index: number, 
  options?: { isAfterQuestion?: boolean }
): number {
  const baseDelay = index === 0 ? 1500 : 2500;
  const lengthBonus = Math.min(chunk.length * 6, 1800);
  const emotionalBonus = hasEmotionalContent(chunk) ? 1200 : 0;
  const transitionBonus = index > 0 ? 500 : 0;
  const randomVariation = Math.random() * 1000;
  
  // Bônus apenas para primeiro chunk após pergunta
  const questionBonus = (index === 0 && options?.isAfterQuestion) ? 1000 : 0;
  
  return baseDelay + lengthBonus + emotionalBonus + transitionBonus + randomVariation + questionBonus;
}
```

**Variante simples do TypingIndicator:**
```typescript
// variant='simple' - mostra apenas os pontos, sem frase
{variant === 'simple' ? null : (
  <motion.span className="text-xs text-muted-foreground italic">
    {thinkingPhrase}
  </motion.span>
)}
```

---

### Resultado Esperado

- Indicador de "digitando..." aparece consistentemente entre TODOS os chunks
- Frases reflexivas aparecem apenas no início (leitura/pensamento) e após perguntas
- Pausas entre chunks mostram apenas pontos animados (mais natural)
- Comportamento mais similar a chats automatizados reais

