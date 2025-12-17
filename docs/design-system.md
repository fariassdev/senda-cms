# Senda Design System

_Version 2.0 - Updated 2025-12-16_
_Unified Design System for Senda Ecosystem (CMS + Mobile App)_

---

## Executive Summary

This Design System provides the unified visual language for all Senda products:

- **Senda CMS** - Admin platform for content creators
- **Senda App** - Consumer mobile application for meditation users

**Design Philosophy:** Calm, organic, and premium. Every element evokes the tranquility of a forest sanctuary while maintaining clarity and usability.

---

## 1. Color System

### 1.1 Core Palette

The color system is built around deep forest greens with a vibrant mint/emerald accent, extracted directly from the Senda app mockups.

**🎯 Primary Brand Color:**

| Token                | Hex Code                  | RGB               | Usage                                                |
| -------------------- | ------------------------- | ----------------- | ---------------------------------------------------- |
| `--color-primary`    | `#13ECA4`                 | rgb(19, 236, 164) | Primary CTA buttons, active navigation, accent icons |
| `--color-primary-20` | `rgba(19, 236, 164, 0.2)` | -                 | Icon backgrounds, badges, subtle highlights          |

**🌑 Dark Mode (Default):**

| Token                         | Hex Code                    | Usage                                     |
| ----------------------------- | --------------------------- | ----------------------------------------- |
| `--color-background-dark`     | `#10221C`                   | Main app background                       |
| `--color-surface`             | `#1C2723`                   | Cards, elevated surfaces, greeting box    |
| `--color-surface-transparent` | `rgba(255, 255, 255, 0.05)` | Stats boxes, session cards (`bg-white/5`) |
| `--color-border`              | `#27272A`                   | Card borders (zinc-800)                   |
| `--color-overlay`             | `rgba(16, 34, 28, 0.8)`     | Hero image overlays                       |

**☀️ Light Mode:**

| Token                      | Hex Code                   | Usage                   |
| -------------------------- | -------------------------- | ----------------------- |
| `--color-background-light` | `#F6F8F7`                  | Main app background     |
| `--color-surface-light`    | `rgba(255, 255, 255, 0.5)` | Cards (`bg-white/50`)   |
| `--color-border-light`     | `#E4E4E7`                  | Card borders (zinc-200) |

### 1.2 Text Colors

**Dark Mode (Default):**

| Token                      | Hex Code  | Usage                             |
| -------------------------- | --------- | --------------------------------- |
| `--color-text-primary`     | `#FFFFFF` | Headlines, primary text           |
| `--color-text-secondary`   | `#9DB9B0` | Subtitles, metadata, nav inactive |
| `--color-text-description` | `#C7DCD5` | Hero descriptions, body text      |
| `--color-text-muted`       | `#71717A` | Timestamps, disabled (zinc-500)   |
| `--color-text-on-primary`  | `#111816` | Text on primary buttons           |

**Light Mode:**

| Token                          | Hex Code  | Usage                |
| ------------------------------ | --------- | -------------------- |
| `--color-text-primary-light`   | `#18181B` | Headlines (zinc-900) |
| `--color-text-secondary-light` | `#52525B` | Body text (zinc-600) |
| `--color-text-muted-light`     | `#A1A1AA` | Metadata (zinc-400)  |

### 1.3 Semantic Colors

| State       | Color         | Hex Code  | Icon Pairing |
| ----------- | ------------- | --------- | ------------ |
| **Success** | Primary Green | `#13ECA4` | ✓ Checkmark  |
| **Warning** | Amber         | `#FBBF24` | ⏳ Hourglass |
| **Error**   | Rose          | `#F87171` | ✕ Close      |
| **Info**    | Sky           | `#38BDF8` | ℹ Info      |

### 1.4 Gradient Overlays

```css
/* Hero image overlay - bottom to top fade */
--gradient-hero: linear-gradient(
  0deg,
  rgba(16, 34, 28, 0.8) 0%,
  rgba(16, 34, 28, 0.1) 50%
);

/* CTA area gradient - top to bottom fade */
--gradient-cta: linear-gradient(
  to top,
  var(--color-background-dark) 0%,
  transparent 100%
);
```

---

## 2. Typography

### 2.1 Font Stack

```css
--font-display: 'Manrope', sans-serif;
--font-mono: 'Fira Code', 'Cascadia Code', monospace;
```

**Manrope** is the primary font (from mockups), chosen for:

- Modern geometric sans-serif with excellent legibility
- Wide range of weights (400-800)
- Perfect for both headings and body text
- Clean, contemporary feel that matches the meditation aesthetic

### 2.2 Type Scale

| Token                  | Size | Weight     | Line Height | Usage                                |
| ---------------------- | ---- | ---------- | ----------- | ------------------------------------ |
| `--text-display`       | 32px | 700 (bold) | 1.1         | Hero headlines ("Rewire Your Mind")  |
| `--text-h2`            | 22px | 700 (bold) | tight       | Section titles ("Featured Courses")  |
| `--text-h3`            | 18px | 700 (bold) | tight       | Page titles, center headers          |
| `--text-body-lg`       | 18px | 700 (bold) | tight       | Greeting text ("Good morning, User") |
| `--text-body`          | 16px | 400        | normal      | Body text, session titles            |
| `--text-body-semibold` | 16px | 600        | normal      | Session names                        |
| `--text-sm`            | 14px | 400        | normal      | Metadata, durations                  |
| `--text-xs`            | 12px | 500/700    | normal      | Navigation labels, badges            |

### 2.3 Font Weight Scale

| Token              | Value | Usage            |
| ------------------ | ----- | ---------------- |
| `--font-normal`    | 400   | Body text        |
| `--font-medium`    | 500   | Labels           |
| `--font-semibold`  | 600   | Session titles   |
| `--font-bold`      | 700   | Headlines, CTAs  |
| `--font-extrabold` | 800   | Display emphasis |

---

## 3. Spacing System

Based on Tailwind's default spacing scale.

| Token       | Value   | Pixels | Usage                    |
| ----------- | ------- | ------ | ------------------------ |
| `--space-1` | 0.25rem | 4px    | Tight gaps               |
| `--space-2` | 0.5rem  | 8px    | Small gaps (pt-2)        |
| `--space-3` | 0.75rem | 12px   | Related elements (gap-3) |
| `--space-4` | 1rem    | 16px   | Standard padding (p-4)   |
| `--space-5` | 1.25rem | 20px   | Medium sections          |
| `--space-6` | 1.5rem  | 24px   | pt-6                     |
| `--space-8` | 2rem    | 32px   | Large sections (pt-8)    |

---

## 4. Border Radius

From the mockup Tailwind config:

| Token              | Value   | Pixels | Usage                      |
| ------------------ | ------- | ------ | -------------------------- |
| `--radius-default` | 0.25rem | 4px    | Default                    |
| `--radius-lg`      | 0.5rem  | 8px    | Buttons (rounded-lg)       |
| `--radius-xl`      | 0.75rem | 12px   | Cards, images (rounded-xl) |
| `--radius-full`    | 9999px  | -      | Pills, circular buttons    |

---

## 5. Shadows & Elevation

Minimal shadow usage - the design relies on borders and background transparency for depth.

```css
/* Backdrop blur for sticky elements */
--blur-sm: blur(4px);
--blur-lg: blur(12px);

/* Sticky header/nav */
.sticky-header {
  background: rgba(16, 34, 28, 0.8);
  backdrop-filter: blur(12px);
}
```

---

## 6. CSS Variables (Complete Reference)

```css
:root {
  /* Primary */
  --color-primary: #13eca4;
  --color-primary-20: rgba(19, 236, 164, 0.2);

  /* Background - Dark (Default) */
  --color-background: #10221c;
  --color-surface: #1c2723;
  --color-surface-transparent: rgba(255, 255, 255, 0.05);
  --color-border: #27272a;
  --color-overlay: rgba(16, 34, 28, 0.8);

  /* Background - Light */
  --color-background-light: #f6f8f7;
  --color-surface-light: rgba(255, 255, 255, 0.5);
  --color-border-light: #e4e4e7;

  /* Text - Dark Mode */
  --color-text-primary: #ffffff;
  --color-text-secondary: #9db9b0;
  --color-text-description: #c7dcd5;
  --color-text-muted: #71717a;
  --color-text-on-primary: #111816;

  /* Text - Light Mode */
  --color-text-primary-light: #18181b;
  --color-text-secondary-light: #52525b;
  --color-text-muted-light: #a1a1aa;

  /* Semantic */
  --color-success: #13eca4;
  --color-warning: #fbbf24;
  --color-error: #f87171;
  --color-info: #38bdf8;

  /* Typography */
  --font-display: 'Manrope', sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* Spacing (Tailwind defaults) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;

  /* Border Radius */
  --radius-default: 0.25rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;
}
```

---

## 7. Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#13ECA4',
        'background-light': '#F6F8F7',
        'background-dark': '#10221C',
        surface: {
          DEFAULT: '#1C2723',
          transparent: 'rgba(255, 255, 255, 0.05)',
        },
        text: {
          primary: {
            DEFAULT: '#FFFFFF',
            light: '#18181B',
          },
          secondary: {
            DEFAULT: '#9DB9B0',
            light: '#52525B',
          },
          description: '#C7DCD5',
          muted: {
            DEFAULT: '#71717A',
            light: '#A1A1AA',
          },
          'on-primary': '#111816',
        },
        success: '#13ECA4',
        warning: '#FBBF24',
        error: '#F87171',
        info: '#38BDF8',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
};
```

---

## 6. Iconography

### 6.1 Icon System

- **Style:** Outlined icons with 1.5-2px stroke weight
- **Size Scale:**
  - `--icon-xs`: 12px
  - `--icon-sm`: 16px
  - `--icon-md`: 20px (default)
  - `--icon-lg`: 24px
  - `--icon-xl`: 32px
  - `--icon-2xl`: 48px

### 6.2 Status Icons

Always pair with semantic colors:

| Status      | Icon                          | Description                 |
| ----------- | ----------------------------- | --------------------------- |
| Play        | ▶ (filled circle background) | Start/resume content        |
| Locked      | 🔒                            | Premium/unavailable content |
| Completed   | ✓                             | Finished items              |
| In Progress | ⏳ or partial circle          | Ongoing items               |
| Error       | ✕                             | Failed states               |
| Loading     | Spinner                       | Processing                  |

### 6.3 Play Button Pattern

From mockups - circular filled button with play icon:

```css
.play-button {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-inverse);
}
```

---

## 7. Component Patterns

### 7.1 Buttons

#### Primary Button

```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  font-size: var(--text-body);
}
```

#### Secondary Button (Outline)

```css
.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-full);
}
```

#### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  padding: var(--space-2) var(--space-4);
}
```

### 7.2 Cards

#### Course Card (Grid)

From Mockup 3 - Library view:

```css
.course-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.course-card__image {
  aspect-ratio: 16/10;
  object-fit: cover;
  width: 100%;
}

.course-card__content {
  padding: var(--space-4);
}

.course-card__title {
  font-size: var(--text-h4);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.course-card__description {
  font-size: var(--text-body-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

.course-card__meta {
  font-size: var(--text-caption);
  color: var(--color-text-muted);
}
```

#### Session/Lesson Card (List)

From Mockup 1 - Session list:

```css
.session-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
}

.session-card__play {
  /* Play button styles from 6.3 */
}

.session-card__info {
  flex: 1;
}

.session-card__title {
  font-size: var(--text-body);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.session-card__duration {
  font-size: var(--text-caption);
  color: var(--color-text-muted);
}

.session-card__lock {
  color: var(--color-text-muted);
}
```

### 7.3 Category Pills / Filters

From Mockup 3 - Category filter bar:

```css
.category-pill {
  display: inline-flex;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-body-sm);
  font-weight: var(--font-medium);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.category-pill--active {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}
```

### 7.4 Stats Boxes

From Mockup 1 - Sessions/Total Time boxes:

```css
.stat-box {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
}

.stat-box__label {
  font-size: var(--text-caption);
  color: var(--color-text-muted);
  margin-bottom: var(--space-1);
}

.stat-box__value {
  font-size: var(--text-h2);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}
```

### 7.5 Goal/Category Cards

From Mockup 2 - "Your Path to a Calmer Mind" grid:

```css
.goal-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-align: center;
  border: 1px solid var(--color-border);
}

.goal-card__title {
  font-size: var(--text-body);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}
```

### 7.6 Featured Course Card

From Mockup 2 - Horizontal scroll cards:

```css
.featured-card {
  position: relative;
  width: 280px;
  aspect-ratio: 4/5;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.featured-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-4);
  background: var(--gradient-card);
}

.featured-card__title {
  font-size: var(--text-h4);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.featured-card__meta {
  font-size: var(--text-caption);
  color: var(--color-text-muted);
}
```

---

## 8. Navigation Patterns

### 8.1 Bottom Navigation (Mobile App)

From Mockup 2 & 3:

```css
.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: var(--space-3) 0;
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-text-muted);
  font-size: var(--text-caption);
}

.bottom-nav__item--active {
  color: var(--color-primary);
}
```

**Navigation Items:**

- Home
- Meditate / Library
- Courses
- Profile

### 8.2 Top Header (Mobile App)

```css
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-4);
  background: var(--color-background);
}

.app-header__title {
  font-size: var(--text-h3);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}
```

### 8.3 Sidebar Navigation (CMS Web)

```css
.sidebar {
  width: 256px;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  padding: var(--space-4);
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.sidebar__item:hover {
  background: var(--color-surface-highlight);
  color: var(--color-text-primary);
}

.sidebar__item--active {
  background: var(--color-primary-muted);
  color: var(--color-primary);
  border-left: 3px solid var(--color-primary);
}
```

---

## 9. Form Elements

### 9.1 Input Fields

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--text-body);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-muted);
}

.input::placeholder {
  color: var(--color-text-muted);
}
```

### 9.2 Labels

```css
.label {
  display: block;
  font-size: var(--text-body-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}
```

---

## 10. Responsive Breakpoints

| Token              | Width  | Target        |
| ------------------ | ------ | ------------- |
| `--breakpoint-sm`  | 640px  | Small tablets |
| `--breakpoint-md`  | 768px  | Tablets       |
| `--breakpoint-lg`  | 1024px | Desktop       |
| `--breakpoint-xl`  | 1280px | Large desktop |
| `--breakpoint-2xl` | 1536px | Wide screens  |

### Mobile-First Approach

- Design for mobile first
- Enhance for larger screens
- Touch targets minimum 44x44px on mobile

---

## 11. Animation & Motion

### 11.1 Timing Functions

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 11.2 Duration Scale

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;
```

### 11.3 Standard Transitions

```css
/* Button hover */
transition: all var(--duration-normal) var(--ease-default);

/* Card hover lift */
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Focus ring */
transition: box-shadow var(--duration-fast) var(--ease-out);
```

---

## 12. Accessibility Requirements

### 12.1 Color Contrast

All text combinations meet WCAG AA (4.5:1 for normal text, 3:1 for large text):

| Foreground | Background | Ratio  | Pass   |
| ---------- | ---------- | ------ | ------ |
| `#FFFFFF`  | `#0B1A17`  | 15.2:1 | ✅ AAA |
| `#D1D5DB`  | `#0B1A17`  | 11.4:1 | ✅ AAA |
| `#9CA3AF`  | `#0B1A17`  | 7.1:1  | ✅ AA  |
| `#2DD4BF`  | `#0B1A17`  | 8.4:1  | ✅ AAA |

### 12.2 Focus States

All interactive elements must have visible focus states:

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 12.3 Touch Targets

- Minimum 44x44px on touch devices
- Minimum 8px spacing between targets

---

## 13. Platform-Specific Adaptations

### 13.1 Senda CMS (Web)

- Sidebar navigation (left)
- Desktop-first responsive
- Higher information density acceptable
- Keyboard shortcuts supported
- Full form capabilities

### 13.2 Senda App (Mobile)

- Bottom navigation
- Mobile-first design
- Touch-optimized interactions
- Gesture support (swipe, pull-to-refresh)
- Reduced cognitive load per screen

---

## 14. CSS Variables (Complete Reference)

```css
:root {
  /* Colors - Background */
  --color-background: #0b1a17;
  --color-surface: #122622;
  --color-surface-elevated: #1a3330;
  --color-surface-highlight: #1e3d38;

  /* Colors - Border */
  --color-border: #2a4a44;
  --color-border-strong: #3a5a54;

  /* Colors - Primary */
  --color-primary: #2dd4bf;
  --color-primary-hover: #5eead4;
  --color-primary-active: #14b8a6;
  --color-primary-muted: rgba(45, 212, 191, 0.15);

  /* Colors - Text */
  --color-text-primary: #ffffff;
  --color-text-secondary: #d1d5db;
  --color-text-muted: #9ca3af;
  --color-text-disabled: #6b7280;
  --color-text-inverse: #0b1a17;

  /* Colors - Semantic */
  --color-success: #34d399;
  --color-warning: #fbbf24;
  --color-error: #f87171;
  --color-info: #38bdf8;

  /* Typography */
  --font-sans:
    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(45, 212, 191, 0.3);

  /* Animation */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}
```

---

## 15. Tailwind CSS Configuration

For projects using Tailwind CSS:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#0B1A17',
        surface: {
          DEFAULT: '#122622',
          elevated: '#1A3330',
          highlight: '#1E3D38',
        },
        border: {
          DEFAULT: '#2A4A44',
          strong: '#3A5A54',
        },
        primary: {
          DEFAULT: '#2DD4BF',
          hover: '#5EEAD4',
          active: '#14B8A6',
          muted: 'rgba(45, 212, 191, 0.15)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#D1D5DB',
          muted: '#9CA3AF',
          disabled: '#6B7280',
          inverse: '#0B1A17',
        },
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        info: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
};
```

---

## 16. Version History

| Date       | Version | Changes                            | Author              |
| ---------- | ------- | ---------------------------------- | ------------------- |
| 2025-12-16 | 2.0     | Unified Design System from mockups | Sally (UX Designer) |
| 2025-11-28 | 1.0     | Original CMS UX Specification      | Rupo                |

---

## 17. Related Documents

- **CMS UX Specification:** `docs/ux-design-specification.md`
- **PRD:** `docs/PRD.md`
- **Architecture:** `docs/architecture.md`

---

_This Design System is the single source of truth for all Senda visual design. All components and UI implementations should reference these tokens and patterns._
