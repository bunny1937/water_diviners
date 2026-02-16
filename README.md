# M.M.S Water Diviners - Professional Website

A stunning, animated website for M.M.S Water Diviners, showcasing their groundwater survey expertise through engaging storytelling and modern web technologies.

## 🌊 Features

### Advanced Animations & Interactions

- **Parallax scrolling effects** on hero section
- **Animated soil layer visualization** with real-time water detection simulation
- **Scroll-triggered card animations** in journey section
- **Interactive process diagram** with SVG animations
- **Hover effects** on service cards with smooth transitions
- **Smooth scrolling** and scroll indicators

### Storytelling Sections

1. **Hero Section**: Eye-catching introduction with animated background, stats counter, and soil visualization
2. **Journey Section**: Scroll-based stacked cards showing the 5-step process
3. **Process Section**: Interactive circular diagram with detailed step information
4. **Services Section**: 6 beautifully animated service cards with hover effects
5. **Footer**: Comprehensive contact information and links

### Technical Features

- ✅ Next.js 15 (App Router)
- ✅ Plain CSS with CSS Modules (no Tailwind)
- ✅ Fully responsive design
- ✅ SEO optimized
- ✅ Accessibility compliant
- ✅ Performance optimized
  ✅ MongoDB integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone or download the project**

```bash
cd mms-water-diviners
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
|-- app
   |-- about
      |-- page.js
   |-- admin
      |-- dashboard
         |-- page.js
      |-- login
         |-- page.js
   |-- api
      |-- admin
         |-- login
            |-- route.js
      |-- placeholder
         |-- route.js
   |-- contact
      |-- page.js
   |-- services
      |-- page.js
   |-- favicon.ico
   |-- globals.css
   |-- layout.js
   |-- page.js
   |-- page.module.css
|-- components
   |-- common
      |-- Button.jsx
      |-- Button.module.css
   |-- hero
      |-- Hero.jsx
      |-- SoilVisualization.jsx
      |-- StatsBlock.jsx
   |-- layout
      |-- Footer.jsx
      |-- Navbar.jsx
      |-- ScrollStack.jsx
      |-- ScrollStack.module.css
   |-- sections
      |-- AboutSection.jsx
      |-- JourneySection.jsx
      |-- ProcessSection.jsx
      |-- ScrollSection.jsx
      |-- ServicesSection.jsx
   |-- svg
      |-- Borewell.jsx
      |-- Geophysical.jsx
      |-- WaterDrop.jsx
|-- lib
   |-- db.js
|-- models
   |-- Admin.js
|-- public
   |-- file.svg
   |-- globe.svg
   |-- next.svg
   |-- vercel.svg
   |-- window.svg
|-- styles
   |-- about.module.css
   |-- footer.module.css
   |-- hero.module.css
   |-- journey.module.css
   |-- navbar.module.css
   |-- process.module.css
   |-- services.module.css
   |-- soil-visualization.module.css
   |-- stats-block.module.css
   |-- variables.css
|-- .env.local
|-- .gitignore
|-- DEPLOYMENT.md
|-- eslint.config.mjs
|-- IMPLEMENTATION_GUIDE.md
|-- jsconfig.json
|-- middleware.js
|-- next.config.mjs
|-- package-lock.json
|-- package.json
|-- QUICKSTART.md
|-- README.md

```

## 🎨 Design Highlights

### Color Palette

- Primary Blue: `#0077be`
- Secondary Blue: `#00b4d8`
- Accent Cyan: `#48cae4`
- Water Blue: `#90e0ef`
- Earth Brown: `#8b6f47`

### Animation Techniques Used

1. **CSS Keyframe Animations**: For continuous animations
2. **Intersection Observer**: For scroll-triggered effects
3. **Transform & Translate**: For smooth movements
4. **Canvas API**: For dynamic soil visualization
5. **SVG Animations**: For process diagrams

### Unique Features

#### 1. Soil Visualization Canvas

Real-time animated visualization showing:

- Multiple soil layers (top soil, sand, clay, rock, aquifer)
- Animated water particles
- Detection waves emanating from water source
- Depth markers and labels

#### 2. Journey Cards

Scroll-activated stacked cards that:

- Activate based on scroll position
- Display step-by-step process
- Include animated timeline
- Show detailed information

#### 3. Interactive Process Diagram

Circular SVG diagram featuring:

- Rotating center icon
- Animated connection lines
- Clickable process nodes
- Auto-rotating showcase
- Progress indicator

## 🔧 Customization

### Update Contact Information

Replace placeholder phone numbers and email in:

- `components/hero/Hero.jsx`
- `components/layout/Navbar.jsx`
- `components/layout/Footer.jsx`

### Modify Colors

Edit `styles/variables.css` to change the color scheme.

### Add More Services

Update the `services` array in `components/sections/ServicesSection.jsx`.

### Customize Journey Steps

Modify the `journeySteps` array in `components/sections/JourneySection.jsx`.

## 📱 Responsive Breakpoints

- Desktop: 968px+
- Tablet: 768px - 967px
- Mobile: < 768px

## 🎯 Future Enhancements (Phase 2)

- [ ] Admin dashboard with MongoDB integration
- [ ] Project showcase gallery
- [ ] Testimonials section
- [ ] Blog/Articles section
- [ ] Online booking system
- [ ] Before/After project images
- [ ] Interactive map of service areas

## 🌟 10 Key Engagement Features

1. **Parallax Scrolling**: Creates depth and immersion
2. **Animated Stats Counter**: Numbers count up on scroll
3. **Canvas Soil Visualization**: Real-time water detection simulation
4. **Scroll-Triggered Cards**: Journey cards activate as you scroll
5. **Interactive SVG Diagram**: Process visualization with animations
6. **Hover Transformations**: Service cards come alive on hover
7. **Smooth Page Transitions**: Seamless navigation experience
8. **Floating Elements**: Subtle animations for visual interest
9. **Progressive Reveal**: Content fades in as you scroll
10. **Call-to-Action Animations**: Buttons pulse and transform

## 📄 License

All rights reserved - M.M.S Water Diviners
Owner: Dhananjay Manohar Sawant

## 🤝 Support

For any questions or support, contact:

- Email: dhananjay@gmail.com
- Phone: [Update with actual number]
- Location: Kankavli, Maharashtra

---

**Built with ❤️ using Next.js, React, and CSS Modules**
