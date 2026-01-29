# Component Examples - Respiro Zen

## Buttons

### Primary Button
```tsx
<button
  className="
    bg-primary text-white
    px-4 py-2 rounded-lg
    font-medium text-base
    hover:bg-primary/90
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
  "
  aria-label="Start breathing exercise"
>
  Começar
</button>
```

### Secondary Button
```tsx
<button
  className="
    bg-gray-100 text-gray-900
    px-4 py-2 rounded-lg
    font-medium text-base
    hover:bg-gray-200
    focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
  "
>
  Cancelar
</button>
```

### Icon Button
```tsx
<button
  className="
    p-2 rounded-full
    text-gray-600 hover:text-gray-900
    hover:bg-gray-100
    focus:outline-none focus:ring-2 focus:ring-gray-400
    transition-colors duration-200
  "
  aria-label="Close modal"
>
  <X className="w-5 h-5" />
</button>
```

## Cards

### Basic Card
```tsx
<div
  className="
    bg-white rounded-xl
    border border-gray-200
    p-6 shadow-sm
    hover:shadow-md
    transition-shadow duration-200
  "
>
  <h3 className="text-lg font-semibold text-gray-900">
    Título do Card
  </h3>
  <p className="mt-2 text-sm text-gray-600">
    Descrição do conteúdo do card.
  </p>
</div>
```

### Interactive Card (Clickable)
```tsx
<button
  className="
    w-full text-left
    bg-white rounded-xl
    border border-gray-200
    p-6 shadow-sm
    hover:shadow-lg hover:border-primary
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    active:scale-[0.98]
    transition-all duration-200
  "
  aria-label="Select breathing technique"
>
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0">
      <Wind className="w-8 h-8 text-primary" />
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-900">
        4-7-8 Respiração
      </h3>
      <p className="mt-1 text-sm text-gray-600">
        Técnica relaxante para reduzir ansiedade
      </p>
    </div>
  </div>
</button>
```

## Form Elements

### Text Input
```tsx
<div className="space-y-2">
  <label
    htmlFor="email"
    className="block text-sm font-medium text-gray-700"
  >
    Email
  </label>
  <input
    id="email"
    type="email"
    className="
      w-full px-3 py-2
      border border-gray-300 rounded-lg
      text-base text-gray-900
      placeholder:text-gray-400
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
      disabled:bg-gray-100 disabled:cursor-not-allowed
      transition-colors duration-200
    "
    placeholder="seu@email.com"
    aria-required="true"
    aria-describedby="email-error"
  />
  <p id="email-error" className="text-sm text-red-600" role="alert">
    Email inválido
  </p>
</div>
```

### Select Dropdown
```tsx
<div className="space-y-2">
  <label
    htmlFor="technique"
    className="block text-sm font-medium text-gray-700"
  >
    Técnica de Respiração
  </label>
  <select
    id="technique"
    className="
      w-full px-3 py-2
      border border-gray-300 rounded-lg
      text-base text-gray-900
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
      disabled:bg-gray-100 disabled:cursor-not-allowed
      transition-colors duration-200
    "
  >
    <option value="">Selecione uma técnica</option>
    <option value="478">4-7-8 Respiração</option>
    <option value="box">Box Breathing</option>
  </select>
</div>
```

### Checkbox
```tsx
<div className="flex items-center gap-2">
  <input
    id="terms"
    type="checkbox"
    className="
      w-4 h-4
      text-primary
      border-gray-300 rounded
      focus:ring-2 focus:ring-primary focus:ring-offset-2
      transition-colors duration-200
    "
  />
  <label htmlFor="terms" className="text-sm text-gray-700">
    Aceito os termos e condições
  </label>
</div>
```

## Loading States

### Skeleton Card
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4" />
  <div className="h-4 bg-gray-200 rounded w-1/2" />
  <div className="h-20 bg-gray-200 rounded" />
</div>
```

### Spinner
```tsx
<div
  className="
    inline-block
    w-8 h-8
    border-4 border-gray-200 border-t-primary
    rounded-full
    animate-spin
  "
  role="status"
  aria-label="Loading"
>
  <span className="sr-only">Carregando...</span>
</div>
```

### Loading Button
```tsx
<button
  disabled
  className="
    bg-primary text-white
    px-4 py-2 rounded-lg
    font-medium text-base
    opacity-50 cursor-not-allowed
    flex items-center gap-2
  "
>
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  Processando...
</button>
```

## Empty States

### No Results
```tsx
<div className="text-center py-12">
  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
    <Search className="w-8 h-8 text-gray-400" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Nenhum resultado encontrado
  </h3>
  <p className="text-sm text-gray-600 mb-4">
    Tente ajustar seus filtros ou buscar por outros termos
  </p>
  <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
    Limpar Filtros
  </button>
</div>
```

### Getting Started
```tsx
<div className="text-center py-12">
  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
    <Plus className="w-8 h-8 text-primary" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Comece sua jornada
  </h3>
  <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
    Você ainda não iniciou nenhuma jornada. Escolha uma para começar sua prática de bem-estar.
  </p>
  <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
    Explorar Jornadas
  </button>
</div>
```

## Modals

### Basic Modal
```tsx
<div
  className="fixed inset-0 z-50 flex items-center justify-center p-4"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  {/* Overlay */}
  <div
    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
    onClick={onClose}
    aria-hidden="true"
  />

  {/* Modal Content */}
  <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Close modal"
    >
      <X className="w-5 h-5" />
    </button>

    <h2 id="modal-title" className="text-xl font-semibold text-gray-900 mb-4">
      Título do Modal
    </h2>

    <p className="text-gray-600 mb-6">
      Conteúdo do modal aqui.
    </p>

    <div className="flex gap-3 justify-end">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
      >
        Cancelar
      </button>
      <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
        Confirmar
      </button>
    </div>
  </div>
</div>
```

## Toasts/Notifications

### Success Toast
```tsx
<div
  className="
    fixed bottom-4 right-4 z-50
    bg-white rounded-lg shadow-lg
    border-l-4 border-green-500
    p-4 pr-12
    max-w-sm
    animate-in slide-in-from-right duration-300
  "
  role="alert"
>
  <div className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
    <div>
      <p className="font-medium text-gray-900">Sucesso!</p>
      <p className="text-sm text-gray-600 mt-1">
        Sua jornada foi iniciada com sucesso.
      </p>
    </div>
  </div>
  <button
    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
    aria-label="Dismiss notification"
  >
    <X className="w-5 h-5" />
  </button>
</div>
```

## Badges

### Status Badge
```tsx
<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
  Ativo
</span>

<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
  Inativo
</span>
```

## Progress Bars

### Linear Progress
```tsx
<div className="w-full">
  <div className="flex justify-between text-sm text-gray-600 mb-2">
    <span>Progresso</span>
    <span>75%</span>
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    <div
      className="bg-primary h-full rounded-full transition-all duration-500"
      style={{ width: '75%' }}
      role="progressbar"
      aria-valuenow={75}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  </div>
</div>
```

### Circular Progress
```tsx
<div className="relative w-16 h-16">
  <svg className="transform -rotate-90 w-16 h-16">
    <circle
      cx="32"
      cy="32"
      r="28"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
      className="text-gray-200"
    />
    <circle
      cx="32"
      cy="32"
      r="28"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
      strokeDasharray={`${(75 / 100) * 175.93} 175.93`}
      className="text-primary transition-all duration-500"
    />
  </svg>
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-sm font-semibold text-gray-900">75%</span>
  </div>
</div>
```

## Tabs

### Horizontal Tabs
```tsx
<div className="border-b border-gray-200">
  <nav className="flex gap-8" aria-label="Tabs">
    <button
      className="
        pb-4 px-1
        border-b-2 border-primary
        text-sm font-medium text-primary
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      "
      aria-current="page"
    >
      Visão Geral
    </button>
    <button
      className="
        pb-4 px-1
        border-b-2 border-transparent
        text-sm font-medium text-gray-500
        hover:text-gray-700 hover:border-gray-300
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      "
    >
      Atividades
    </button>
    <button
      className="
        pb-4 px-1
        border-b-2 border-transparent
        text-sm font-medium text-gray-500
        hover:text-gray-700 hover:border-gray-300
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
      "
    >
      Estatísticas
    </button>
  </nav>
</div>
```

## Avatars

### User Avatar
```tsx
<div className="relative inline-block">
  <img
    src="/avatar.jpg"
    alt="Nome do Usuário"
    className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
  />
  <span
    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
    aria-label="Online"
  />
</div>
```

### Avatar Placeholder
```tsx
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
  <span className="text-sm font-medium text-primary">AB</span>
</div>
```

## Accessibility Patterns

### Skip Link
```tsx
<a
  href="#main-content"
  className="
    sr-only focus:not-sr-only
    focus:absolute focus:top-4 focus:left-4
    bg-primary text-white
    px-4 py-2 rounded-lg
    font-medium text-sm
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    z-50
  "
>
  Pular para conteúdo principal
</a>
```

### Screen Reader Only Text
```tsx
<span className="sr-only">
  Apenas para leitores de tela
</span>
```

## Responsive Patterns

### Mobile Navigation
```tsx
{/* Desktop */}
<nav className="hidden md:flex gap-6">
  <a href="/home">Início</a>
  <a href="/journeys">Jornadas</a>
  <a href="/profile">Perfil</a>
</nav>

{/* Mobile */}
<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
  <nav className="flex justify-around py-2">
    <a href="/home" className="flex flex-col items-center gap-1 p-2">
      <Home className="w-6 h-6" />
      <span className="text-xs">Início</span>
    </a>
    <a href="/journeys" className="flex flex-col items-center gap-1 p-2">
      <Compass className="w-6 h-6" />
      <span className="text-xs">Jornadas</span>
    </a>
    <a href="/profile" className="flex flex-col items-center gap-1 p-2">
      <User className="w-6 h-6" />
      <span className="text-xs">Perfil</span>
    </a>
  </nav>
</div>
```

These examples follow Respiro Zen's design system and accessibility standards. All components include proper ARIA attributes, keyboard navigation support, and responsive design considerations.
