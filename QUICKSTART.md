# ⚡ QUICK START GUIDE

Get your M.M.S Water Diviners website running in 5 minutes!

## 🚀 Installation (3 Commands)

```bash
# 1. Navigate to project
cd mms-water-diviners

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:3000` in your browser!

---

## 🔧 Before You Launch

### Update Contact Information (IMPORTANT!)

Replace these placeholders in **3 files**:

1. **components/hero/Hero.jsx**
   - Line 84: `href="tel:XXXXXXXXXX"` → Add phone number
   - Line 89: `href="https://wa.me/XXXXXXXXXX"` → Add WhatsApp number

2. **components/layout/Navbar.jsx**
   - Line 50: `href="tel:XXXXXXXXXX"` → Add phone number

3. **components/layout/Footer.jsx**
   - Line 58: `href="https://wa.me/XXXXXXXXXX"` → Add WhatsApp
   - Line 129: Phone number
   - Line 138: Email address

**Find & Replace:**
```
XXXXXXXXXX → Your actual 10-digit phone number
dhananjay@gmail.com → Actual email address
```

---

## 📁 What's Included

✅ **Hero Section** - Animated background, stats, soil visualization
✅ **Journey Section** - Scroll-based story cards
✅ **Process Section** - Interactive SVG diagram
✅ **Services Section** - 6 animated service cards
✅ **Navbar** - Responsive with mobile menu
✅ **Footer** - Complete contact info

---

## 🎨 Customization Quick Tips

### Change Colors
Edit `styles/variables.css` → Change CSS variables

### Add/Remove Services
Edit `components/sections/ServicesSection.jsx` → Modify `services` array

### Update Journey Steps
Edit `components/sections/JourneySection.jsx` → Modify `journeySteps` array

### Change Stats Numbers
Edit `components/hero/StatsBlock.jsx` → Update `targets` object

---

## 📱 Testing

```bash
# Build for production
npm run build

# Test production build
npm start
```

---

## 🌐 Deploy to Vercel (Free)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Click Deploy
5. Done! ✨

---

## 📚 Full Documentation

- `README.md` - Complete project overview
- `IMPLEMENTATION_GUIDE.md` - How animations work
- `DEPLOYMENT.md` - Deployment options & checklist

---

## 🎯 Features Highlights

### 10 Engagement Techniques Used:
1. Parallax scrolling effects
2. Animated counter statistics
3. Real-time canvas visualization
4. Scroll-based card stacking
5. Interactive SVG diagram
6. 3D card hover effects
7. Floating animations
8. Progressive reveal
9. Ripple effect buttons
10. Micro-interactions throughout

---

## 🐛 Common Issues

**Build Error?**
- Ensure Node.js 18+ installed
- Run `npm install` again

**Animations Not Smooth?**
- Check browser hardware acceleration
- Test in Chrome/Firefox

**Mobile Menu Not Opening?**
- Clear browser cache
- Check JavaScript console

---

## ✅ Launch Checklist

- [ ] Updated all phone numbers
- [ ] Updated email address
- [ ] Tested on mobile
- [ ] Tested on desktop
- [ ] Verified all links work
- [ ] Checked contact forms
- [ ] Reviewed all text content
- [ ] Added favicon
- [ ] Set up analytics (optional)

---

## 🎉 You're Ready!

Your professional, animated water diviner website is ready to impress clients!

**Questions?** Check the full documentation or reach out for support.

**Built with:** Next.js 14 + React + CSS Modules (No Tailwind)
