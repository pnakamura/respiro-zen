
## Objetivo (o que vai ser corrigido)
1) O botão **“Salvar Registro”** precisa ficar **visível de forma confiável** na etapa 5 (Reflexão), já que hoje ele “não aparece”, mas o clique embaixo acaba salvando (sinal de que o botão provavelmente está fora da área visível ou coberto).
2) A **restauração do rascunho** precisa **parar de voltar para o passo 5** e, quando o usuário parou logo após energia, deve voltar para o **passo 4 (Energia)**.
3) Após salvar um registro, **novo registro** deve começar no **passo 1**, e nunca “pular” direto para o passo 5.

---

## Diagnóstico com base no código atual
### A) Por que “o botão não aparece mas clicando embaixo salva”
No `MealCheckModal.tsx` o botão existe (step `notes`, linhas ~654-667). Se ele não aparece mas clicar “no footer/parte de baixo” salva, o cenário mais provável é:
- o botão está sendo renderizado, mas **fica abaixo da dobra** (precisa scroll) dentro do container `overflow-y-auto`, e o usuário clica na área onde ele está (mesmo sem perceber), ou
- há algum efeito de layout/overflow/altura (`max-h-[80dvh]` + conteúdo) que faz o botão ficar **fora da área visível**, apesar de estar no DOM.

Atualmente ele não é `sticky` e vem **depois** de tags/prompts, o que empurra ele para baixo.

### B) Por que volta para o passo 5 e novo registro também
A restauração hoje depende do conteúdo salvo no localStorage (`nutrition-check-in-draft`) e da lógica:
- Se `draft.step === 'notes'` e `notes` tem conteúdo “não vazio” (mesmo que seja lixo/whitespace), ele vai para `notes`.
- Se o draft **não está sendo limpo** (ou está sendo regravado após limpar), ao abrir novamente ele restaura.

Além disso, hoje a restauração apenas checa `draft.step` ∈ `['category','energy','notes']`, mas não valida consistência (ex.: `step: notes` com `selectedMood`/`selectedHunger` ausentes).

---

## Mudanças planejadas (implementação)
### 1) Tornar o botão “Salvar Registro” inevitavelmente visível (etapa 5)
No step `notes`, vamos:
1. **Mover o botão para imediatamente após a textarea** (antes das tags/“reflection prompts”).  
   - Isso sozinho já reduz muito o risco de ficar “abaixo”.
2. Colocar o botão dentro de um container **`sticky bottom-0`** (dentro do scroll) para ficar sempre acessível mesmo com scroll/viewport menor.
   - Exemplo de container:
     - `className="sticky bottom-0 -mx-5 px-5 pt-3 bg-card border-t border-border/30 safe-area-bottom z-20"`
3. Ajustar o espaçamento do scroll:
   - Manter `pb-24` (ou ajustar para `pb-28`) no container scrollável principal, para garantir que o conteúdo final não fique escondido.

Resultado esperado: na etapa 5, o botão aparece sempre; se o teclado abrir, ainda assim fica acessível.

### 2) Eliminar qualquer “salvamento invisível” fora da etapa 5
Hoje o usuário relata que clica “no footer” e salva, mesmo sem ver o botão. Para evitar confusão:
- Garantir que **não exista nenhum botão/área clicável de submit** fora da etapa `notes`.
- Revalidar a renderização do footer: no código atual o footer não renderiza em `notes`, então vamos confirmar que isso permanece e remover qualquer handler residual (se houver) que esteja causando submit indireto.

### 3) Restauração à prova de inconsistência (sempre volta para o passo correto)
Vamos reescrever a decisão do passo de restauração para ser **baseada em dados**, não só no `draft.step`.

Regras novas (ordem de prioridade):
1. Se o draft não tiver o mínimo necessário para o “modo rascunho” (ex.: `selectedMood` ou `selectedHunger` ausentes), então:
   - **não restaurar**
   - **limpar o draft** (`clearDraft()`)
   - iniciar no passo `mood`
2. Se `selectedCategory` existe e `selectedEnergy` **não existe** → restaurar em `energy` (passo 4) ou `category`?  
   - Pelo fluxo do app: se já escolheu categoria, próximo é energia → restaurar em **`energy`** (mais útil).
3. Se `selectedEnergy` existe e `notes.trim()` está vazio → restaurar em **`energy`** (passo 4).  
   - Esse é o caso que você quer garantir.
4. Se `notes.trim()` tem conteúdo real → restaurar em **`notes`** (passo 5).
5. Caso contrário → restaurar em `category` (passo 3) apenas se for o primeiro incompleto.

Isso evita “pular” para o passo 5 por `draft.step` inconsistente, e também evita voltar para 3 quando o correto é 4.

### 4) Garantir que, após salvar, nunca exista draft residual que force passo 5
Mesmo já chamando `clearDraft()` no `handleSubmit`, vamos reforçar com 2 camadas:
1. Após salvar com sucesso, além de `clearDraft()`, também:
   - setar um “flag” local em memória (ex.: `hasRestoredRef.current = true` e/ou um `justSavedRef`) para impedir qualquer restauração na mesma sessão por race de abertura/fechamento.
2. Ao abrir o modal (`isOpen === true`), se `step` estiver em `mood` e existir draft, restaurar apenas se o draft for consistente (regra do item 3). Caso contrário, limpar e começar do zero.

Isso cobre o cenário “salvou e depois novo registro já abre no passo 5”.

---

## Arquivos que serão alterados
- `src/components/nutrition/MealCheckModal.tsx`
  - Reposicionamento do botão “Salvar Registro”
  - Container `sticky` no step `notes`
  - Ajuste de padding no container scrollável (manter/ajustar `pb-24`)
  - Reescrita da lógica de restauração com validação de consistência do draft
  - Reforço do “clear draft” pós-sucesso e prevenção de re-restauração indevida

Nenhuma mudança necessária em `useNutritionDraft.ts` a princípio (ele só persiste/expira), mas se identificarmos que drafts inconsistentes são frequentes, podemos endurecer validação também ali numa segunda rodada.

---

## Critérios de aceitação (testes que você vai conseguir validar)
1) Abrir modal → chegar na etapa 5:
   - Botão “Salvar Registro” aparece **logo após a caixa de texto** e fica visível (sticky).
2) Etapa 4 → selecionar energia → fechar imediatamente → reabrir:
   - volta na **etapa 4 (Energia)**.
3) Escrever uma nota real (texto) na etapa 5 → fechar → reabrir:
   - volta na **etapa 5 (Reflexão)**.
4) Salvar registro com sucesso → abrir novo registro:
   - começa no **passo 1** (Humor), sem “pular” para o passo 5.

---

## Notas técnicas (para evitar regressões)
- Usar `notesTrimmed = (typeof notes === 'string' ? notes : '').trim()` em toda decisão.
- Considerar “conteúdo real” para restaurar em `notes` apenas quando `notesTrimmed.length > 0`.
- Validar consistência mínima do draft antes de restaurar (mood/hunger/categoria) para não cair em estados impossíveis.
