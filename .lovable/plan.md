
## Plano: Respostas Divididas em Múltiplas Bolhas com Pausas

### Problema Atual
A resposta do guia chega como um único bloco contínuo de texto. Mesmo com a velocidade de digitação lenta, a mensagem aparece como uma única "parede de texto", o que não parece natural para uma conversa real.

### Solução
Dividir respostas longas em múltiplas bolhas de mensagem, cada uma aparecendo após uma pausa significativa, simulando como uma pessoa real envia mensagens em um chat.

---

### Arquitetura da Solução

```text
Fluxo Atual:
[Resposta completa] → [Pacer caractere a caractere] → [1 bolha grande]

Novo Fluxo:
[Resposta completa] → [Divisor de segmentos] → [Bloco 1] → pausa 2-4s → [Bloco 2] → pausa 2-4s → [Bloco 3]
```

---

### 1. Novo Hook: useMessageChunker

**Arquivo:** `src/hooks/useMessageChunker.ts`

Hook que divide uma resposta em segmentos naturais:

- Divide por parágrafos (`\n\n`)
- Divide frases longas em grupos de 2-3 sentenças
- Limite máximo de ~250 caracteres por segmento
- Mantém pontuação e formatação intactas

Lógica de divisão:
```text
Prioridade 1: Quebra de parágrafo (\n\n)
Prioridade 2: Fim de frase (. ! ?) após 150+ chars
Prioridade 3: Reticências (...) como ponto de pausa natural
Prioridade 4: Vírgula ou ponto-vírgula após 200+ chars
```

---

### 2. Modificar useGuideChat

**Arquivo:** `src/hooks/useGuideChat.ts`

Mudanças:
- Ao receber resposta completa, dividir em segmentos usando `useMessageChunker`
- Criar múltiplas mensagens do assistente (uma por segmento)
- Cada segmento tem seu próprio ID único
- Adicionar delay entre cada segmento (2000-4000ms)

Nova estrutura de mensagens:
```text
Antes: [user, assistant]
Depois: [user, assistant-chunk-1, assistant-chunk-2, assistant-chunk-3]
```

---

### 3. Estado de "Pausando" entre Bolhas

**Arquivo:** `src/pages/GuideChat.tsx`

Novo estado visual entre segmentos:
- Após cada bolha aparecer, mostrar indicador de "digitando..." por 2-4s
- Avatar continua pulsando suavemente
- Próxima bolha aparece após o delay

Nova fase no state machine:
```text
reading → thinking → responding-chunk-1 → pausing → responding-chunk-2 → pausing → responding-chunk-3 → idle
```

---

### 4. Modificar MessageBubble para Chunks

**Arquivo:** `src/components/guide/MessageBubble.tsx`

- Adicionar prop `isChunk` para identificar mensagens que são parte de uma resposta maior
- Chunks intermediários não mostram nome do guia (evita repetição visual)
- Primeiro chunk mostra nome, últimos chunks são mais "limpos"

---

### Tempos de Pausa Entre Segmentos

| Contexto | Pausa |
|----------|-------|
| Entre parágrafos | 3000-4500ms |
| Entre frases | 2000-3000ms |
| Após reticências | 2500-3500ms |
| Resposta emocional | +1000ms adicional |

---

### Exemplo Visual

**Antes:**
```text
[Guia] Entendo como você se sente. É completamente natural ter esses pensamentos. 
Vou compartilhar uma técnica que pode ajudar. Primeiro, encontre um lugar calmo.
Depois, respire profundamente três vezes. Observe seus pensamentos sem julgamento.
Com o tempo, isso vai ficando mais fácil. Estou aqui se precisar de mais apoio.
```

**Depois:**
```text
[Guia] Entendo como você se sente. É completamente natural ter esses pensamentos.

    [indicador de digitando... por 2.5s]

[Guia] Vou compartilhar uma técnica que pode ajudar.

    [indicador de digitando... por 2s]

[Guia] Primeiro, encontre um lugar calmo. Depois, respire profundamente três vezes. 
Observe seus pensamentos sem julgamento.

    [indicador de digitando... por 3s]

[Guia] Com o tempo, isso vai ficando mais fácil. Estou aqui se precisar de mais apoio.
```

---

### Arquivos a Criar/Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/hooks/useMessageChunker.ts` | **CRIAR** - Lógica de divisão de mensagens |
| `src/hooks/useGuideChat.ts` | Modificar para usar chunking e delays |
| `src/pages/GuideChat.tsx` | Adicionar estado de "pausa entre bolhas" |
| `src/components/guide/MessageBubble.tsx` | Suporte visual para chunks |

---

### Seção Técnica

**Algoritmo de Divisão (useMessageChunker):**
```typescript
function splitIntoChunks(text: string): string[] {
  // 1. Dividir por parágrafos primeiro
  const paragraphs = text.split(/\n\n+/);
  
  // 2. Para cada parágrafo longo, subdividir por frases
  const chunks: string[] = [];
  for (const para of paragraphs) {
    if (para.length <= 250) {
      chunks.push(para.trim());
    } else {
      // Dividir em frases e agrupar em chunks de ~200 chars
      const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
      let currentChunk = '';
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > 250 && currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += sentence;
        }
      }
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
    }
  }
  return chunks.filter(c => c.length > 0);
}
```

**Delay Entre Chunks (useGuideChat):**
```typescript
const getChunkDelay = (chunk: string, index: number): number => {
  const baseDelay = 2000; // 2s mínimo
  const lengthBonus = Math.min(chunk.length * 5, 1500); // até 1.5s extra
  const emotionalBonus = hasEmotionalContent(chunk) ? 1000 : 0;
  const randomVariation = Math.random() * 800;
  
  return baseDelay + lengthBonus + emotionalBonus + randomVariation;
};
```

---

### Resultado Esperado

- Respostas longas aparecem em 2-5 bolhas separadas
- Pausas de 2-4 segundos entre cada bolha
- Indicador de "digitando..." visível entre bolhas
- Sensação de conversa real, não de receber um texto pronto
- Ritmo mais contemplativo e menos "robótico"
