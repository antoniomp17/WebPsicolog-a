# Design Guidelines: PsicoBienestar - Psychology & Wellness Platform

## Design Approach
**System-Based with Custom Brand Identity**: This project uses Tailwind CSS as the foundation with a carefully crafted custom color palette that evokes warmth, trust, and professionalism—essential for a psychology and wellness platform.

## Core Design Principles
1. **Warmth & Accessibility**: The golden-cream palette creates an inviting, therapeutic atmosphere
2. **Clarity & Trust**: Clean layouts with ample whitespace build credibility
3. **Seamless Navigation**: SPA architecture ensures smooth, uninterrupted user journey
4. **Mobile-First Responsive**: Fully adaptive from mobile to desktop

---

## Color Palette

### Primary Colors
- **Crema** (`#FDFBF5`): Main background - soft, calming base
- **Beige** (`#F0EDE7`): Secondary backgrounds, gradients, card surfaces
- **Dorado** (`#C6A969`): Primary accent - buttons, CTAs, interactive elements, selected states
- **Marron** (`#4E443A`): Primary text, headings, footer

### Supporting Colors
- **Arena** (`#E7D4B5`): Soft accent for subtle highlights
- **Gris-claro** (`#D1D5DB`): Borders, dividers, disabled states
- **Gris-medio** (`#6B7280`): Secondary text, descriptions

### Color Usage
- **Backgrounds**: Crema for body, white/beige for cards
- **Text Hierarchy**: Marron for primary, gris-medio for secondary
- **Interactive Elements**: Dorado for all CTAs, hover states, selected items
- **Calendar**: Dorado for selected dates/times with 20% opacity for hover states

---

## Typography

### Font Family
**Inter** (Google Fonts): Modern, highly legible sans-serif perfect for digital wellness content
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Type Scale
- **Hero Headings**: 2.5rem-3rem (md: 4xl-5xl) - Bold weight
- **Section Headings**: 1.875rem (3xl) - Bold weight
- **Card Titles**: 1.25rem (xl) - Semibold
- **Body Text**: 1rem (base) - Regular weight
- **Secondary Text**: 0.875rem (sm) - Regular weight, gris-medio color

---

## Layout System

### Spacing Units
Use Tailwind's spacing scale with emphasis on:
- **Component Padding**: `p-6` to `p-8` for cards
- **Section Spacing**: `py-8` to `py-12` (mobile), `py-12` to `py-20` (desktop)
- **Element Gaps**: `gap-4` for tight spacing, `gap-8` for comfortable spacing
- **Container**: `max-w-7xl` for main content, `max-w-3xl` for centered content (FAQ)

### Grid Patterns
- **Course Cards**: 1 column (mobile) → 2 columns (md) → 3 columns (lg)
- **Testimonials**: 1 column (mobile) → 3 columns (md)
- **Calendar**: Responsive 7-column grid for days

---

## Component Library

### Navigation
**Sticky Header**: White background with 90% opacity and backdrop blur
- Height: `h-16`
- Desktop: Horizontal menu with text links + prominent CTA button
- Mobile: Hamburger menu with slide-down navigation
- Logo: Bold 2xl text in marron
- Links: Marron text with dorado hover state
- CTA Button: Dorado background, white text, rounded-lg, shadow-md

### Buttons
**Primary (CTA)**: 
- Background: `bg-dorado`, Text: `text-white`
- Padding: `px-8 py-3` (large), `px-4 py-2` (standard)
- Border radius: `rounded-lg`
- Shadow: `shadow-md`
- Hover: 90% opacity transition

**Secondary**:
- Background: `bg-white`, Border: `border-dorado`
- Text: `text-dorado`
- Hover: `bg-beige`

**Time Slot Buttons** (Calendar):
- Default: Border dorado, text dorado, transparent background
- Hover: Filled dorado background, white text
- Selected: Filled dorado, white text
- Disabled: Gray border/text, cursor not-allowed

### Cards
**Course/Service Cards**:
- Background: White
- Border radius: `rounded-xl`
- Shadow: `shadow-lg`
- Hover: `scale-[1.02]` transform with 300ms duration
- Image: `h-48` fixed height, `object-cover`
- Content padding: `p-6`
- Price: 2xl bold dorado text

**Testimonial Cards**:
- Background: White
- Large decorative quotation mark (6xl, beige, 75% opacity, absolutely positioned)
- Padding: `p-6`
- Italic text for quote content

### Calendar Component
**Grid Structure**:
- 7 columns for weekdays
- Days: Rounded buttons with hover states
- Today: 20% dorado background, dorado text, semibold
- Selected: Full dorado background, white text
- Disabled/Past: Reduced opacity, non-interactive

### Modals
**Structure**:
- Overlay: Fixed, full-screen, semi-transparent dark background
- Content: Centered, white background, rounded-xl, max-width constraints
- Close button: Top-right, dorado color with hover state
- Padding: Generous `p-8` to `p-12`

**Types**:
- Payment Modal: Form with card details
- Article Modal: Prose styling for rich text content
- Success States: Green checkmark with confirmation message

### Forms
**Input Fields**:
- Border: `border-gris-claro`
- Focus: Dorado border color, ring effect
- Padding: `p-3`
- Border radius: `rounded-lg`
- Full width on mobile, constrained on desktop

**Labels**: Marron color, semibold weight, mb-2

---

## Images

### Hero Section (Home Page)
- Background: Gradient from beige to gris-claro/30 (no photo)
- Alternative: Could use subtle pattern or abstract wellness imagery as background
- CTA buttons with blurred background if over imagery

### Course Cards
- Placeholder images: 600x400px
- Suggested themes: 
  - Anxiety course: Calming natural scene, meditation space
  - Mindfulness: Peaceful environment, zen elements
  - Communication: People connecting, collaborative setting
- Aspect ratio: 3:2, object-cover to maintain consistency

### Blog/Article Images
- Featured images for each article snippet
- Size: Similar to course cards for visual consistency

---

## Interactions & Animations

### Navigation Transitions
- View changes: Fade-in animation (0.5s ease-in-out)
- Mobile menu: Slide transition when toggling

### Hover States
- Cards: Subtle scale transform (1.02)
- Buttons: Opacity reduction (90%) or background color change
- Links: Color change to dorado
- Time slots: Background fill on hover (non-disabled)

### Loading/Success States
- Success messages auto-hide after 3-4 seconds
- Smooth opacity transitions for state changes

### Calendar
- Selected day persists highlight
- Selected time persists highlight
- Progressive disclosure: Steps reveal sequentially

---

## Accessibility

- High contrast between text and backgrounds (WCAG AA minimum)
- Keyboard navigation support for all interactive elements
- Focus states visible on all inputs and buttons
- Disabled states clearly distinguished
- Semantic HTML maintained throughout
- Icon library (Feather Icons) with proper ARIA labels where needed

---

## Responsive Breakpoints

Follow Tailwind defaults:
- **sm**: 640px (tablets portrait)
- **md**: 768px (tablets landscape, small laptops)
- **lg**: 1024px (desktops)

### Key Responsive Behaviors
- Navigation: Hamburger below md, horizontal above
- Course grid: Stacks 1→2→3 columns
- Testimonials: Stack 1→3 columns
- Calendar: Adjusts cell sizes, maintains 7-column grid
- Hero text: Scales from 2.5rem to 4xl-5xl
- Section padding: Reduces on mobile (py-8 vs py-12+)

---

## Special Components

### FAQ Section (Details/Summary)
- Uses native `<details>` element
- Chevron icon rotates 180° when open
- Open state: Title changes to dorado color
- Smooth transitions for expand/collapse

### Progress Indicators (Booking Flow)
- Three-step process clearly numbered
- Active step highlighted
- Completed steps marked with checkmark

This design system creates a cohesive, professional wellness platform that balances warmth with credibility, ensuring users feel supported throughout their journey.