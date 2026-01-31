
# Verificação de Botões - Problemas Identificados

## Resumo

Analisei o código das páginas `/guide/select` e `/guide` e identifiquei **2 problemas** que podem afetar a funcionalidade dos botões.

---

## Problemas Encontrados

### 1. MessageBubble sem `forwardRef` (Prioridade Alta)

**Arquivo:** `src/components/guide/MessageBubble.tsx`

O componente é usado dentro de `AnimatePresence mode="popLayout"` em `GuideChat.tsx`, mas não implementa `forwardRef`. Isso causa o warning no console e pode quebrar animações de transição.

**Correção:**
```tsx
// Converter de function component para forwardRef
export const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  function MessageBubble({ message, guideEmoji, ... }, ref) {
    return (
      <motion.div ref={ref} ...>
        {/* conteúdo */}
      </motion.div>
    );
  }
);
```

### 2. Botão "Continuar" em GuideSelect (Prioridade Média)

**Arquivo:** `src/pages/GuideSelect.tsx` (linha 32-35)

O fluxo está correto, mas o botão `handleContinue` depende de:
1. `selectedGuide` estar preenchido
2. `isAuthenticated` ser `true`

Se o usuário não estiver autenticado, o botão aparece mas não faz nada (retorna silenciosamente).

**Correção:** O botão já está dentro de `AnimatePresence` e só aparece quando `selectedGuide` existe. Porém, a navegação para `/guide` pode falhar se houver problemas no componente `MessageBubble`.

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/guide/MessageBubble.tsx` | Adicionar `forwardRef` e passar `ref` ao `motion.div` raiz |

---

## Plano de Implementação

1. **Modificar MessageBubble.tsx:**
   - Importar `forwardRef` do React
   - Converter componente para usar `forwardRef`
   - Passar `ref` para o elemento `motion.div` raiz (linha 60)

2. **Testar:**
   - Navegar para `/guide/select`
   - Selecionar um guia
   - Clicar em "Continuar com [Nome]"
   - Verificar que a navegação para `/guide` funciona
   - Verificar que não há warnings no console

---

## Resultado Esperado

- Warning de ref eliminado do console
- Animações de entrada/saída funcionando corretamente
- Navegação fluida entre `/guide/select` e `/guide`
