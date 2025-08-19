# Shining Stars Platform Guidelines

## Layout and Alignment Guidelines

### Container and Spacing Rules
* Use `max-w-7xl mx-auto` for main content containers to ensure consistent width across the platform
* Apply responsive padding: `px-4 sm:px-6 lg:px-8` for consistent horizontal spacing
* Use `py-4 sm:py-6 lg:py-8` for vertical spacing between major sections
* Maintain consistent gap spacing: `space-y-4 sm:space-y-6` for vertical layouts
* Use `space-x-2 sm:space-x-3 lg:space-x-4` for horizontal element spacing

### Responsive Design Standards
* Always implement mobile-first responsive design
* Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:` for breakpoint-specific styling
* Ensure touch targets are minimum 44px (h-11 w-11) on mobile devices
* Use responsive text sizing: `text-sm sm:text-base lg:text-lg`
* Implement responsive grid layouts: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### Component Positioning
* Use `relative` positioning for component containers when needed
* Apply `fixed` positioning sparingly, primarily for floating elements like chat bots
* Ensure proper z-index layering: modals (z-50), floating buttons (z-40), headers (z-30)
* Position floating elements with proper spacing: `bottom-4 sm:bottom-6 right-4 sm:right-6`

## Design System Guidelines

### Typography
* Use base font-size of 14px (defined in CSS variables)
* Apply consistent font weights: `font-normal` (400) for body text, `font-medium` (500) for headings
* Maintain proper line heights: 1.5 for readability
* Use semantic HTML elements with default typography (h1-h6, p, label, button)

### Color Scheme
* Primary brand colors: Purple gradient (`from-purple-600 to-blue-600`)
* Background: Light gray (`bg-gray-50/50`) for main areas
* Cards and surfaces: White (`bg-white`) with subtle borders
* Text hierarchy: `text-gray-900` for primary, `text-gray-600` for secondary, `text-gray-500` for tertiary

### Interactive Elements
* Buttons should have hover states with `hover:` prefixes
* Apply smooth transitions: `transition-all duration-300`
* Use shadow elevation: `shadow-lg hover:shadow-xl`
* Implement subtle transform effects: `hover:scale-[1.02]` for emphasis

### Modal and Dialog Standards
* Center modals with proper backdrop blur: `backdrop-blur-md`
* Use consistent modal sizing: `max-w-2xl` for content modals, `max-w-sm sm:max-w-md` for forms
* Apply proper padding: `p-6 sm:p-8` for modal content
* Ensure modals are responsive with mobile-friendly sizing

## Component-Specific Guidelines

### Header Component
* Should be sticky positioned (`sticky top-0`) for consistent navigation
* Apply backdrop blur for modern glass effect: `bg-white/95 backdrop-blur-md`
* Include proper border separation: `border-b border-gray-200/50`

### Chat Bot Guidelines
* Position as fixed element in bottom-right corner
* Use gradient background for brand consistency
* Implement smooth animations with Framer Motion
* Ensure responsive sizing: `h-12 w-12 sm:h-14 sm:w-14`
* Apply proper z-indexing to avoid conflicts with other UI elements

### Card Components
* Use consistent border radius: `rounded-lg` or `rounded-xl` for emphasis
* Apply subtle shadows: `shadow-md` for standard cards, `shadow-lg` for elevated cards
* Maintain consistent padding: `p-4` for compact cards, `p-6` for standard cards
* Use proper background colors: `bg-white` with `border border-gray-200`

### Form Elements
* Apply consistent styling: `border border-gray-300 rounded-lg`
* Use focus states: `focus:ring-2 focus:ring-purple-500 focus:border-transparent`
* Implement proper spacing between form elements: `space-y-4 sm:space-y-6`
* Ensure form labels are properly associated and styled

### Animation Guidelines
* Use Framer Motion for smooth transitions and micro-interactions
* Apply consistent easing and duration: `duration-300` for standard transitions
* Implement entrance animations: `initial={{ opacity: 0, scale: 0.8 }}`
* Use exit animations for better UX when elements disappear
* Keep animations subtle and purposeful - avoid overwhelming users

**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
