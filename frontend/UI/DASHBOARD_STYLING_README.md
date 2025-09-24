# 📦 KandyPack Logistics Dashboard - Styling Guide

## 🎨 Overview

This document provides a comprehensive guide to the custom styling system implemented for the KandyPack Logistics Platform dashboard. The styling is built on **Tailwind CSS v4** with a custom color palette designed specifically for logistics and supply chain management interfaces.

---

## 🚀 Quick Start

### Using the New Tailwind v4 Utility Classes

```jsx
// Primary Colors - Use these for main branding elements
<div className="bg-primary-coral text-white">Coral Background</div>
<div className="bg-primary-navy text-white">Navy Background</div>
<span className="text-primary-coral">Coral Text</span>

// Dashboard Specific Colors
<nav className="bg-dashboard-sidebar text-dashboard-sidebar">
  <h2 className="text-dashboard-accent">KandyPack Navigation</h2>
</nav>

// Action Buttons with Hover Effects
<button className="bg-dashboard-accent hover:bg-dashboard-accent text-white px-4 py-2 rounded">
  Track Shipment
</button>

// Status Indicators
<span className="bg-status-shipped text-white px-3 py-1 rounded-full">Shipped</span>
<span className="bg-status-pending text-white px-3 py-1 rounded-full">Pending</span>
<span className="bg-status-delivered text-white px-3 py-1 rounded-full">Delivered</span>
<span className="bg-status-cancelled text-white px-3 py-1 rounded-full">Cancelled</span>

// Chart Elements
<div className="bg-dashboard-chart text-dashboard-chart p-4 rounded">
  Chart Container
</div>
```

---

## 🎯 Design Philosophy

### Color Psychology for Logistics
- **Deep Navy Blue**: Trust, reliability, professionalism - perfect for navigation and primary elements
- **Coral/Orange-Red**: Urgency, action, attention - ideal for CTAs and important alerts
- **Light Blue-Gray**: Calm, clean, organized - excellent for backgrounds and content areas
- **Status Colors**: Industry-standard colors for different shipment states

### Accessibility
- All colors meet WCAG 2.1 AA contrast standards
- Dark mode support for better user experience
- Clear visual hierarchy for dashboard elements

---

## 🎨 Color Palette

### Primary Colors

| Color | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|--------|
| **Primary** | Deep Navy (`oklch(0.208 0.042 265.755)`) | Light (`oklch(0.984 0.003 247.858)`) | Sidebar, primary buttons |
| **Accent** | Coral (`oklch(0.72 0.15 25)`) | Dimmed Coral (`oklch(0.65 0.12 25)`) | CTAs, highlights |
| **Background** | White (`oklch(1 0 0)`) | Dark Navy (`oklch(0.129 0.042 264.695)`) | Page background |
| **Card** | White (`oklch(1 0 0)`) | Dark Navy (`oklch(0.129 0.042 264.695)`) | Card backgrounds |

### Dashboard-Specific Colors

| Variable | Light Mode | Dark Mode | Purpose |
|----------|------------|-----------|---------|
| `--dashboard-sidebar` | Deep Navy | Darker Navy | Sidebar background |
| `--dashboard-accent` | Coral | Dimmed Coral | Action buttons, highlights |
| `--dashboard-chart` | Chart Blue | Dimmed Chart Blue | Chart backgrounds |
| `--dashboard-bg` | Very Light Blue-Gray | Dark Blue-Gray | Dashboard background |

### Status Colors

| Status | Color | CSS Class | Usage |
|--------|-------|-----------|--------|
| **Shipped** | Green (`oklch(0.65 0.15 140)`) | `.status-shipped` | Successfully shipped orders |
| **Pending** | Yellow (`oklch(0.75 0.15 60)`) | `.status-pending` | Orders awaiting processing |
| **Delivered** | Blue (`oklch(0.65 0.15 220)`) | `.status-delivered` | Successfully delivered orders |
| **Cancelled** | Red (`oklch(0.577 0.245 27.325)`) | `.status-cancelled` | Cancelled orders |

---

## 🔧 Technical Implementation

### Technology Stack
- **Tailwind CSS v4.1.4** - Latest version with new `@layer utilities` system
- **OKLCH Color Space** - Modern color format for better color accuracy and wider gamut
- **Vite Plugin** - `@tailwindcss/vite` for seamless integration (no config file needed)
- **React Router v7** - Full-stack framework integration

### How Tailwind v4 Works Differently

#### Key Changes from v3 to v4:
1. **No Config File**: Configuration is done entirely in CSS
2. **New Import Syntax**: `@import "tailwindcss"` instead of `@tailwind` directives
3. **Utility Layer System**: Custom utilities defined with `@layer utilities`
4. **Vite Plugin**: Direct integration without separate configuration

#### File Structure
```
frontend/UI/
├── app/
│   └── app.css          # Main styling file (contains ALL configuration)
├── vite.config.ts       # Minimal Vite config with Tailwind plugin
└── package.json         # Dependencies
```

### Vite Configuration (vite.config.ts)
```typescript
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(), // No configuration needed - everything is in CSS
    reactRouter(), 
    tsconfigPaths()
  ],
});
```

### CSS Configuration (app/app.css)
```css
@import "tailwindcss";

/* Define custom utilities using @layer utilities */
@layer utilities {
  /* Primary colors */
  .text-primary-coral { color: oklch(0.72 0.15 25); }
  .bg-primary-coral { background-color: oklch(0.72 0.15 25); }
  
  /* Dashboard colors */
  .bg-dashboard-sidebar { background-color: oklch(0.208 0.042 265.755); }
  .text-dashboard-sidebar { color: oklch(0.984 0.003 247.858); }
  
  /* Hover variants */
  .hover\:bg-primary-coral:hover { background-color: oklch(0.68 0.14 25); }
  
  /* Dark mode variants */
  .dark .bg-dashboard-sidebar { background-color: oklch(0.15 0.04 265); }
}

/* CSS variables for legacy support */
:root {
  --dashboard-sidebar: oklch(0.208 0.042 265.755);
  --dashboard-accent: oklch(0.72 0.15 25);
}
```

---

## 📚 Tailwind v4 Utility Classes Reference

### Primary Color Utilities

#### Text Colors
- `.text-primary-coral` - Coral text color
- `.text-primary-navy` - Navy text color
- `.text-dashboard-accent` - Dashboard accent text (coral)
- `.text-dashboard-sidebar` - Sidebar text (white/light)

#### Background Colors
- `.bg-primary-coral` - Coral background
- `.bg-primary-navy` - Navy background  
- `.bg-dashboard-accent` - Dashboard accent background (coral)
- `.bg-dashboard-sidebar` - Sidebar background (navy)
- `.bg-dashboard-chart` - Chart background (blue)
- `.bg-dashboard-bg` - Light dashboard background

#### Border Colors
- `.border-primary-coral` - Coral border
- `.border-primary-navy` - Navy border
- `.border-dashboard-accent` - Dashboard accent border

### Interactive State Utilities

#### Hover Effects
- `.hover:bg-primary-coral` - Coral background on hover
- `.hover:bg-primary-navy` - Navy background on hover
- `.hover:bg-dashboard-accent` - Dashboard accent hover
- `.hover:bg-dashboard-sidebar` - Sidebar hover effect

#### Focus States
- `.focus:ring-primary-coral` - Coral focus ring
- `.focus:ring-primary-navy` - Navy focus ring
- `.focus:ring-dashboard-accent` - Dashboard accent focus ring

### Status Indicator Utilities

#### Status Backgrounds
- `.bg-status-shipped` - Green background for shipped status
- `.bg-status-pending` - Yellow background for pending status
- `.bg-status-delivered` - Blue background for delivered status
- `.bg-status-cancelled` - Red background for cancelled status

### Legacy CSS Classes (Still Available)

#### `.dashboard-card`
- **Purpose**: Content cards with consistent styling
- **Styling**: White background, border, rounded corners, shadow
- **Usage**: `<div className="dashboard-card">...</div>`

## 🎯 Understanding Tailwind v4 Utility Generation

### How Utilities Are Created

In Tailwind v4, custom utilities are defined using the `@layer utilities` directive:

```css
@layer utilities {
  /* This creates .bg-primary-coral utility */
  .bg-primary-coral { 
    background-color: oklch(0.72 0.15 25); 
  }
  
  /* This creates .text-primary-coral utility */
  .text-primary-coral { 
    color: oklch(0.72 0.15 25); 
  }
  
  /* This creates hover variant */
  .hover\:bg-primary-coral:hover { 
    background-color: oklch(0.68 0.14 25); 
  }
}
```

### Utility Naming Convention

Our utilities follow this pattern:
- **Property prefix**: `bg-`, `text-`, `border-`
- **Color system**: `primary-`, `dashboard-`, `status-`
- **Color name**: `coral`, `navy`, `accent`, `shipped`, etc.

Examples:
- `bg-primary-coral` = Background + Primary system + Coral color
- `text-dashboard-accent` = Text + Dashboard system + Accent color
- `border-status-shipped` = Border + Status system + Shipped color

### State Variants

#### Hover States
```css
.hover\:bg-primary-coral:hover { /* styles */ }
```
Usage: `<button className="bg-primary-navy hover:bg-primary-coral">`

#### Focus States  
```css
.focus\:ring-primary-coral:focus { /* styles */ }
```
Usage: `<input className="focus:ring-primary-coral">`

#### Dark Mode
```css
.dark .bg-dashboard-sidebar { /* dark mode styles */ }
```
Usage: Automatically applied when `.dark` class is on root element

### Message Utility Classes

#### `.dashboard-success`
- **Purpose**: Success messages and positive indicators
- **Color**: Green background with white text
- **Usage**: `<div className="dashboard-success p-4 rounded">Success message</div>`

#### `.dashboard-warning`
- **Purpose**: Warning messages and alerts
- **Color**: Yellow background with white text
- **Usage**: `<div className="dashboard-warning p-4 rounded">Warning message</div>`

#### `.dashboard-info`
- **Purpose**: Informational messages
- **Color**: Blue background with white text
- **Usage**: `<div className="dashboard-info p-4 rounded">Info message</div>`

---

## 🌙 Dark Mode

### Automatic Detection
Dark mode is triggered by adding the `.dark` class to your root element:

```jsx
// Enable dark mode
<html className="dark">
  <body>
    {/* Your app content */}
  </body>
</html>
```

### Dark Mode Color Adjustments
All custom colors have been optimized for dark mode:
- Backgrounds become darker
- Text becomes lighter
- Accent colors are slightly dimmed for better readability
- Borders and shadows are adjusted for dark themes

---

## 💡 Usage Examples

### Complete Dashboard Layout (Updated for Tailwind v4)

```jsx
function Dashboard() {
  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Sidebar */}
      <nav className="bg-dashboard-sidebar text-dashboard-sidebar w-64 min-h-screen p-6">
        <h1 className="text-xl font-bold mb-8 text-dashboard-accent">KandyPack</h1>
        <ul className="space-y-4">
          <li>
            <a href="/dashboard" className="block p-2 rounded hover:bg-primary-navy">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/orders" className="block p-2 rounded hover:bg-primary-navy">
              Orders
            </a>
          </li>
          <li>
            <a href="/tracking" className="block p-2 rounded hover:bg-primary-navy">
              Tracking
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-2 text-primary-navy">Total Orders</h3>
            <p className="text-3xl font-bold text-dashboard-accent">1,234</p>
          </div>
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-2 text-primary-navy">Active Shipments</h3>
            <p className="text-3xl font-bold text-dashboard-accent">89</p>
          </div>
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-2 text-primary-navy">Delivered Today</h3>
            <p className="text-3xl font-bold text-dashboard-accent">156</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4 text-primary-navy">Recent Orders</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
              <span className="font-medium">#12345</span>
              <span className="bg-status-shipped text-white px-3 py-1 rounded-full text-sm font-medium">
                Shipped
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
              <span className="font-medium">#12346</span>
              <span className="bg-status-pending text-white px-3 py-1 rounded-full text-sm font-medium">
                Pending
              </span>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded">
              <span className="font-medium">#12347</span>
              <span className="bg-status-delivered text-white px-3 py-1 rounded-full text-sm font-medium">
                Delivered
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="bg-dashboard-accent hover:bg-dashboard-accent text-white px-6 py-3 rounded-lg mt-6 font-medium transition-colors">
          Create New Order
        </button>
      </main>
    </div>
  );
}
```

### Order Status Component (Updated for Tailwind v4)

```jsx
function OrderStatus({ status }) {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'shipped': return 'bg-status-shipped';
      case 'pending': return 'bg-status-pending';
      case 'delivered': return 'bg-status-delivered';
      case 'cancelled': return 'bg-status-cancelled';
      default: return 'bg-dashboard-info';
    }
  };

  return (
    <span className={`${getStatusClass(status)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
      {status}
    </span>
  );
}

// Alternative with more interactive features
function InteractiveOrderStatus({ status, onClick }) {
  const statusConfig = {
    shipped: { 
      bgClass: 'bg-status-shipped', 
      hoverClass: 'hover:bg-green-600',
      icon: '✓'
    },
    pending: { 
      bgClass: 'bg-status-pending', 
      hoverClass: 'hover:bg-yellow-600',
      icon: '⏳'
    },
    delivered: { 
      bgClass: 'bg-status-delivered', 
      hoverClass: 'hover:bg-blue-600',
      icon: '📦'
    },
    cancelled: { 
      bgClass: 'bg-status-cancelled', 
      hoverClass: 'hover:bg-red-600',
      icon: '✗'
    }
  };

  const config = statusConfig[status.toLowerCase()] || {
    bgClass: 'bg-dashboard-info',
    hoverClass: 'hover:bg-blue-600',
    icon: 'ℹ'
  };

  return (
    <button 
      onClick={onClick}
      className={`${config.bgClass} ${config.hoverClass} text-white px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer flex items-center space-x-1`}
    >
      <span>{config.icon}</span>
      <span>{status}</span>
    </button>
  );
}
```

---

## 🔄 Migration from Tailwind CSS v3 to v4

### Major Changes Overview

#### 1. Configuration Method
**v3 (Old)**: `tailwind.config.js` file
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-coral': '#ff6b47'
      }
    }
  }
}
```

**v4 (New)**: CSS-only configuration
```css
/* app.css */
@import "tailwindcss";

@layer utilities {
  .bg-primary-coral { background-color: oklch(0.72 0.15 25); }
}
```

#### 2. Import Statements
**v3 (Old)**:
```css
@tailwind base;
@tailwind components; 
@tailwind utilities;
```

**v4 (New)**:
```css
@import "tailwindcss";
```

#### 3. Custom Utilities
**v3 (Old)**: Defined in config file or with `@apply`
```css
.btn-coral {
  @apply bg-coral text-white px-4 py-2 rounded;
}
```

**v4 (New)**: Defined in `@layer utilities`
```css
@layer utilities {
  .btn-coral {
    background-color: oklch(0.72 0.15 25);
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
  }
}
```

#### 4. Vite Integration
**v3 (Old)**: Required PostCSS configuration
```js
// vite.config.js
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
})
```

**v4 (New)**: Direct Vite plugin
```js
// vite.config.js
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()], // No PostCSS needed
});
```

### Breaking Changes

#### Color Space Migration
- **Old**: HSL/RGB colors `hsl(15, 75%, 65%)`
- **New**: OKLCH colors `oklch(0.72 0.15 25)` (better color accuracy)

#### Plugin System Changes
- **Old**: Plugins defined in `tailwind.config.js`
- **New**: All customization in CSS files

#### Build Process
- **Old**: Required PostCSS processing chain
- **New**: Direct Vite integration with no additional setup

---

## 🎨 Customization in Tailwind v4

### Adding New Colors

#### Method 1: Direct Utility Classes (Recommended)
```css
@layer utilities {
  /* Background utilities */
  .bg-custom-purple { background-color: oklch(0.7 0.15 280); }
  .bg-custom-teal { background-color: oklch(0.6 0.12 180); }
  
  /* Text utilities */
  .text-custom-purple { color: oklch(0.7 0.15 280); }
  .text-custom-teal { color: oklch(0.6 0.12 180); }
  
  /* Border utilities */
  .border-custom-purple { border-color: oklch(0.7 0.15 280); }
  
  /* Hover variants */
  .hover\:bg-custom-purple:hover { background-color: oklch(0.65 0.14 280); }
  
  /* Dark mode variants */
  .dark .bg-custom-purple { background-color: oklch(0.4 0.1 280); }
}
```

#### Method 2: CSS Variables (For Complex Systems)
```css
:root {
  --color-brand-primary: oklch(0.7 0.15 280);
  --color-brand-secondary: oklch(0.6 0.12 180);
}

.dark {
  --color-brand-primary: oklch(0.4 0.1 280);
  --color-brand-secondary: oklch(0.35 0.08 180);
}

@layer utilities {
  .bg-brand-primary { background-color: oklch(var(--color-brand-primary)); }
  .bg-brand-secondary { background-color: oklch(var(--color-brand-secondary)); }
  .text-brand-primary { color: oklch(var(--color-brand-primary)); }
}
```

### Creating Color Systems

#### Complete Color System Example
```css
@layer utilities {
  /* Success color system */
  .bg-success-50 { background-color: oklch(0.95 0.02 140); }
  .bg-success-100 { background-color: oklch(0.9 0.04 140); }
  .bg-success-500 { background-color: oklch(0.65 0.15 140); }
  .bg-success-600 { background-color: oklch(0.6 0.14 140); }
  .bg-success-900 { background-color: oklch(0.3 0.08 140); }
  
  .text-success-500 { color: oklch(0.65 0.15 140); }
  .text-success-600 { color: oklch(0.6 0.14 140); }
  
  .border-success-500 { border-color: oklch(0.65 0.15 140); }
  
  /* Hover states */
  .hover\:bg-success-600:hover { background-color: oklch(0.6 0.14 140); }
  
  /* Dark mode adjustments */
  .dark .bg-success-500 { background-color: oklch(0.55 0.12 140); }
  .dark .text-success-500 { color: oklch(0.7 0.16 140); }
}
```

### Extending the Color System

For logistics-specific needs, consider adding:
- **Priority colors**: High, medium, low priority indicators
- **Route colors**: Different colors for different shipping routes
- **Carrier colors**: Specific colors for different shipping carriers
- **Temperature colors**: For temperature-sensitive shipments

---

## 🐛 Troubleshooting Tailwind v4

### Common Issues & Solutions

#### Colors Not Applying
**Issue**: Custom color utilities not working
```jsx
// ❌ Not working
<div className="bg-primary-coral">
```

**Solutions**:
1. **Check CSS Import Order**:
```css
/* ✅ Correct order */
@import "tailwindcss";

@layer utilities {
  .bg-primary-coral { background-color: oklch(0.72 0.15 25); }
}
```

2. **Verify Vite Plugin**:
```js
// vite.config.ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()], // Must be included
});
```

3. **Check Class Names**: Ensure exact spelling (case-sensitive)
4. **Restart Dev Server**: Required after CSS layer changes

#### CSS Not Updating
**Issue**: Changes to `@layer utilities` not reflected

**Solutions**:
1. **Hard Refresh**: Ctrl+F5 or Cmd+Shift+R
2. **Clear Vite Cache**: Delete `node_modules/.vite` folder
3. **Restart Dev Server**: `npm run dev`

#### Dark Mode Not Working
**Issue**: Dark mode variants not applying

**Check HTML Structure**:
```jsx
// ✅ Correct setup
<html className="dark"> {/* or no class for light mode */}
  <body>
    <div className="bg-dashboard-sidebar"> {/* Will use dark variant */}
```

**Verify CSS**:
```css
@layer utilities {
  .bg-dashboard-sidebar { background-color: oklch(0.208 0.042 265.755); }
  .dark .bg-dashboard-sidebar { background-color: oklch(0.15 0.04 265); }
}
```

#### Build Errors
**Issue**: Build failing with Tailwind errors

**Common Fixes**:
1. **Check Syntax**:
```css
/* ❌ Wrong */
@layer utilities
  .bg-color { background: red; }

/* ✅ Correct */
@layer utilities {
  .bg-color { background: red; }
}
```

2. **OKLCH Format**:
```css
/* ❌ Wrong */
.bg-color { background-color: oklch(0.7, 0.15, 25); }

/* ✅ Correct */
.bg-color { background-color: oklch(0.7 0.15 25); }
```

#### Intellisense Not Working
**Issue**: VS Code not suggesting custom classes

**Solutions**:
1. **Install Extension**: "Tailwind CSS IntelliSense"
2. **Restart VS Code**: After installing extension
3. **Check File Association**: Ensure CSS file is recognized

#### Performance Issues
**Issue**: Slow build times or large bundle size

**Optimizations**:
1. **Use Purging**: Tailwind v4 automatically purges unused styles
2. **Minimize Custom Utilities**: Only create what you need
3. **Use Standard Tailwind**: When possible, prefer built-in utilities

### Debugging Tools

#### Browser DevTools
1. **Inspect Element**: Check if classes are applied
2. **Computed Styles**: Verify final CSS values
3. **Console**: Look for CSS errors

#### VS Code Extensions
- **Tailwind CSS IntelliSense**: Autocomplete and linting
- **CSS Peek**: Navigate to CSS definitions
- **Error Lens**: Inline error display

### Performance Tips

1. **Use CSS Variables**: Instead of inline styles for better performance
2. **Minimize Custom Classes**: Leverage Tailwind utilities when possible
3. **Optimize Images**: Use appropriate formats for dashboard icons
4. **Bundle Analysis**: Regularly check bundle size impact

---

## 📖 Resources

### Official Documentation
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [OKLCH Color Picker](https://oklch.com/)
- [React Router v7 Documentation](https://reactrouter.com/)

### Design Inspiration
- [Logistics Dashboard Examples](https://dribbble.com/shots/popular/web-design?q=logistics+dashboard)
- [Material Design Color System](https://material.io/design/color/)
- [Accessibility Color Tools](https://webaim.org/resources/contrastchecker/)

### Development Tools
- [VS Code Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Headless UI Components](https://headlessui.dev/)
- [Lucide React Icons](https://lucide.dev/)

---

## 🤝 Contributing

### Adding New Styles
1. Follow the established naming convention (`dashboard-*`)
2. Ensure dark mode compatibility
3. Test across different screen sizes
4. Update this documentation

### Code Style
- Use OKLCH color format for consistency
- Include descriptive comments for complex styles
- Follow mobile-first responsive design principles
- Maintain accessibility standards

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Initial implementation with Tailwind CSS v4
- ✅ Custom color palette for logistics theme
- ✅ Dark mode support
- ✅ Status indicator system
- ✅ Dashboard-specific utility classes
- ✅ Comprehensive documentation

### Planned Features
- 🔄 Animation utilities for loading states
- 🔄 Chart-specific styling utilities
- 🔄 Mobile-optimized components
- 🔄 Accessibility enhancements
- 🔄 Theme customization tools

---

*This styling system is designed to grow with your logistics platform. For questions or suggestions, please refer to the project documentation or reach out to the development team.*