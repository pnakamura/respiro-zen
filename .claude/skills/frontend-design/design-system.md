# Respiro Zen Design System

## Color Palette

### Primary Colors
- Primary: `#0EA5E9` (Sky Blue) - Main brand color
- Primary Dark: `#0284C7`
- Primary Light: `#38BDF8`

### Secondary Colors
- Secondary: `#8B5CF6` (Purple) - Spiritual, calming
- Secondary Dark: `#7C3AED`
- Secondary Light: `#A78BFA`

### Semantic Colors
- Success: `#10B981` (Green) - Positive feedback, completion
- Warning: `#F59E0B` (Amber) - Caution, attention needed
- Error: `#EF4444` (Red) - Errors, problems
- Info: `#3B82F6` (Blue) - Information, tips

### Neutral Scale
- Gray 50: `#F9FAFB` - Lightest background
- Gray 100: `#F3F4F6` - Light background
- Gray 200: `#E5E7EB` - Borders, dividers
- Gray 300: `#D1D5DB` - Disabled elements
- Gray 400: `#9CA3AF` - Placeholders
- Gray 500: `#6B7280` - Secondary text
- Gray 600: `#4B5563` - Body text
- Gray 700: `#374151` - Dark text
- Gray 800: `#1F2937` - Headings
- Gray 900: `#111827` - Darkest text

### Spiritual/Wellness Colors
- Lavender: `#C4B5FD` - Meditation, peace
- Mint: `#6EE7B7` - Freshness, breathing
- Peach: `#FBBF24` - Warmth, energy
- Rose: `#FDA4AF` - Love, compassion

## Typography

### Font Families
```css
--font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: "Fira Code", "Courier New", monospace;
```

### Type Scale (Modular Scale: 1.25)
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
```

### Font Weights
- Regular: 400 - Body text
- Medium: 500 - Subtle emphasis
- Semibold: 600 - Section headings
- Bold: 700 - Main headings

### Line Heights
- Tight: 1.25 - Headlines
- Normal: 1.5 - Body text
- Relaxed: 1.75 - Large paragraphs

## Spacing System

8px base grid:
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

## Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Tags, badges */
--radius-md: 0.5rem;    /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Large cards */
--radius-2xl: 1.5rem;   /* 24px - Modals */
--radius-full: 9999px;  /* Circular - Avatars */
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

## Transitions

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

## Component Sizing

### Buttons
- Small: `px-3 py-1.5 text-sm` (height: ~32px)
- Medium: `px-4 py-2 text-base` (height: ~40px)
- Large: `px-6 py-3 text-lg` (height: ~48px)

### Input Fields
- Small: `px-3 py-1.5 text-sm` (height: ~36px)
- Medium: `px-3 py-2 text-base` (height: ~40px)
- Large: `px-4 py-3 text-lg` (height: ~48px)

### Icons
- Small: 16px
- Medium: 20px
- Large: 24px
- XLarge: 32px

## Accessibility Standards

### Color Contrast Ratios (WCAG AA)
- Normal text (< 18px): 4.5:1 minimum
- Large text (≥ 18px or bold ≥ 14px): 3:1 minimum
- UI components: 3:1 minimum

### Focus Indicators
- Ring width: 2px
- Ring offset: 2px
- Ring color: Primary color with 50% opacity

### Touch Targets
- Minimum: 44x44px
- Recommended: 48x48px
- Spacing between targets: 8px minimum

## Animation Principles

1. **Purposeful**: Every animation should have a purpose
2. **Fast**: 200-300ms for most UI interactions
3. **Natural**: Use easing functions (ease-in-out)
4. **GPU-accelerated**: Prefer transform and opacity
5. **Reduced motion**: Respect `prefers-reduced-motion`

## Layout Patterns

### Page Structure
```
Header (sticky, 64px)
  ├─ Logo
  ├─ Navigation
  └─ User Menu

Main Content (flex-1)
  ├─ Page Header
  │   ├─ Title
  │   ├─ Description
  │   └─ Actions
  └─ Content Area

Bottom Navigation (mobile, 64px)
  └─ Nav Items
```

### Content Widths
- Max content width: 1280px (xl)
- Narrow content: 640px (sm) - Reading, forms
- Medium content: 768px (md) - Cards, lists
- Wide content: 1024px (lg) - Dashboards

## Responsive Breakpoints

```css
/* Mobile first approach */
xs: 320px   /* Mobile portrait */
sm: 640px   /* Mobile landscape, small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

## Component States

Every interactive component should have:
1. **Default** - Resting state
2. **Hover** - Mouse over (desktop)
3. **Focus** - Keyboard focus (ring visible)
4. **Active** - Being clicked/pressed
5. **Disabled** - Not interactive (reduced opacity)
6. **Loading** - Processing action (spinner/skeleton)
7. **Error** - Validation failure (red border)
8. **Success** - Validation success (green border)

## Icons

Use Lucide React icons:
- Consistent stroke width: 2px
- 16px for inline text
- 20px for buttons
- 24px for headers
- 32px+ for feature icons

## Illustrations & Images

- Aspect ratios: 16:9 (video), 4:3 (cards), 1:1 (avatars)
- Format: WebP with JPG fallback
- Loading: Show skeleton or blur-up
- Alt text: Always provide descriptive text
- Max file size: 200KB for thumbnails, 500KB for hero images
