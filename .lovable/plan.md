

# Plano: Corrigir Visibilidade do Botão Salvar + Fluxo de Restauração

## Problemas Identificados

### 1. Botão "Salvar" Ainda Invisível

Após análise detalhada, o problema é que:
- O footer tem `pb-6` (24px) + `safe-area-bottom` (mais 24px) = ~48px de padding-bottom
- Mas o conteúdo scrollável também tem `pb-6`, criando excesso
- O `max-h-[85dvh]` ainda pode ser muito para dispositivos com viewports menores

**Causa raiz**: A classe `safe-area-bottom` aplica `padding-bottom: max(1.5rem, ...)`, mas o footer JÁ TEM `pb-6` na mesma linha. Isso causa conflito - o Tailwind `pb-6` está sendo sobrescrito pela classe CSS customizada, mas a especificidade pode variar.

### 2. Restauração Voltando para Pergunta 5 (deveria ser 4)

O hook `useNutritionDraft.ts` salva o step atual a cada mudança. Porém:
- O auto-save acontece quando `step` muda E está em `['category', 'energy', 'notes']`
- Se o usuário está no step 4 (energy), seleciona uma opção e o app fecha, o draft salva `step: 'energy'`
- **MAS** ao selecionar energia, `handleEnergySelect` chama `goToStep('notes', 1)`, salvando o draft com `step: 'notes'`

O problema está na ordem dos eventos:
1. Usuário seleciona energia no step 4
2. `handleEnergySelect` é chamado → `setSelectedEnergy` + `goToStep('notes')`
3. O `useEffect` de auto-save detecta `step='notes'` e salva com step 5
4. Ao restaurar, volta no step 5 em vez de 4

---

## Solução

### Solução 1: Footer Sempre Visível

**Arquivo: `src/components/nutrition/MealCheckModal.tsx`**

Estratégia mais agressiva para garantir que o footer apareça:

1. **Reduzir max-height para 80dvh** - Deixa mais margem na parte inferior
2. **Remover pb-6 do footer** - Deixar apenas `safe-area-bottom` controlar o padding
3. **Remover pb-6 do conteúdo scrollável** - Evitar padding duplo
4. **Adicionar `overflow-hidden` no container principal** - Forçar o flex a calcular corretamente

```tsx
// Container do modal (linha 296-299)
className={cn(
  "relative w-full max-w-lg flex flex-col overflow-hidden bg-card rounded-t-3xl shadow-xl border-t border-border/50",
  "max-h-[80dvh]"  // Reduzido de 85dvh
)}

// Conteúdo scrollável (linha 337)
<div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">  // Removido pb-6

// Footer (linha 650)
<div className="flex-shrink-0 px-5 pt-3 border-t border-border/30 bg-card shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-[130] safe-area-bottom">
// Removido pb-6, safe-area-bottom já cuida do padding inferior
```

### Solução 2: Corrigir Lógica de Restauração

**Arquivo: `src/hooks/useNutritionDraft.ts`**

Mudar para salvar o step ANTERIOR ao avançar, ou seja, salvar o step onde o usuário fez a última seleção:

Na verdade, a correção mais simples é no `MealCheckModal.tsx`: restaurar para o step ANTERIOR ao salvo, quando aplicável.

**Arquivo: `src/components/nutrition/MealCheckModal.tsx`**

Adicionar lógica para voltar 1 step ao restaurar:

```tsx
// Linhas 102-120 - Restore draft
useEffect(() => {
  if (isOpen && !hasRestoredRef.current) {
    const draft = loadDraft();
    if (draft && ['category', 'energy', 'notes'].includes(draft.step)) {
      // Restaurar dados
      setSelectedMood(draft.selectedMood);
      setSelectedHunger(draft.selectedHunger);
      setSelectedCategory(draft.selectedCategory);
      setSelectedEnergy(draft.selectedEnergy);
      setNotes(draft.notes);
      
      // Restaurar para o step ANTERIOR se for 'notes' ou 'energy'
      // (porque o usuário pode não ter completado o step atual)
      let restoreStep = draft.step;
      if (draft.step === 'notes' && !draft.notes.trim()) {
        restoreStep = 'energy';
      }
      if (draft.step === 'energy' && !draft.selectedEnergy) {
        restoreStep = 'category';
      }
      
      setStep(restoreStep);
      hasRestoredRef.current = true;
      toast.info('Continuando de onde você parou...', { duration: 2000 });
    }
  }
  if (!isOpen) {
    hasRestoredRef.current = false;
  }
}, [isOpen, loadDraft]);
```

Esta lógica verifica: se o draft está em 'notes' mas não tem notas, volta para 'energy'. Se está em 'energy' mas não tem energia selecionada, volta para 'category'.

---

## Mudanças Específicas

### Arquivo: `src/components/nutrition/MealCheckModal.tsx`

**Mudança 1 - Container do modal (linhas 296-299):**
```tsx
// DE:
className={cn(
  "relative w-full max-w-lg flex flex-col bg-card rounded-t-3xl shadow-xl border-t border-border/50",
  "max-h-[85dvh]"
)}

// PARA:
className={cn(
  "relative w-full max-w-lg flex flex-col overflow-hidden bg-card rounded-t-3xl shadow-xl border-t border-border/50",
  "max-h-[80dvh]"
)}
```

**Mudança 2 - Conteúdo scrollável (linha 337):**
```tsx
// DE:
<div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 pb-6">

// PARA:
<div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
```

**Mudança 3 - Footer (linha 650):**
```tsx
// DE:
<div className="flex-shrink-0 px-5 pt-3 pb-6 border-t border-border/30 bg-card shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-[130] safe-area-bottom">

// PARA:
<div className="flex-shrink-0 px-5 pt-3 border-t border-border/30 bg-card shadow-[0_-4px_12px_rgba(0,0,0,0.1)] z-[130] safe-area-bottom">
```

**Mudança 4 - Lógica de restauração (linhas 102-120):**
Adicionar verificação para restaurar no step correto baseado nos dados presentes.

---

## Arquivos Afetados

| Arquivo | Mudança |
|---------|---------|
| `src/components/nutrition/MealCheckModal.tsx` | Ajustar max-height, remover paddings duplicados, corrigir lógica de restauração |

---

## Testes Recomendados
1. Abrir modal de nutrição no Android Chrome e verificar se botão "Salvar" está visível no passo 5
2. Ir até o passo 4 (Energia), selecionar uma opção, fechar o modal
3. Reabrir o modal e verificar que restaura no passo 4, não no passo 5
4. Ir até o passo 3 (Refeição), fechar e reabrir - deve restaurar no passo 3
5. Testar com diferentes tamanhos de tela

