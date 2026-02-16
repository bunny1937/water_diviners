# 🚀 DEPLOYMENT GUIDE

This guide covers deploying your M.M.S Water Diviners website to production.

## 📋 Pre-Deployment Checklist

### 1. Update Contact Information
- [ ] Replace all `XXXXXXXXXX` with actual phone numbers
- [ ] Update email from `dhananjay@gmail.com` to actual email
- [ ] Verify location information is correct

**Files to update:**
- `components/hero/Hero.jsx`
- `components/layout/Navbar.jsx`
- `components/layout/Footer.jsx`

### 2. SEO Optimization
- [ ] Update metadata in `app/layout.js`
- [ ] Add Google Analytics (if needed)
- [ ] Create `sitemap.xml`
- [ ] Create `robots.txt`
- [ ] Add Open Graph images

### 3. Performance Check
- [ ] Run `npm run build` locally
- [ ] Check for build errors
- [ ] Test all pages
- [ ] Verify mobile responsiveness
- [ ] Test on different browsers

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

**Why Vercel?**
- Built by Next.js creators
- Automatic deployments
- Global CDN
- Free SSL certificate
- Serverless functions ready

**Steps:**

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Click "Deploy"

3. **Configure Domain** (Optional)
   - Buy domain from Namecheap, GoDaddy, etc.
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

**Environment Variables** (if using MongoDB later):
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://yourdomain.com
```

---

### Option 2: Netlify

**Steps:**

1. **Build Command:** `npm run build`
2. **Publish Directory:** `.next`
3. **Framework:** Next.js

**netlify.toml** (create this file):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

### Option 3: Self-Hosted (VPS)

**Requirements:**
- Ubuntu 20.04+ server
- Node.js 18+
- Nginx
- PM2

**Steps:**

1. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2**
```bash
sudo npm install -g pm2
```

3. **Clone & Build**
```bash
git clone YOUR_REPO
cd mms-water-diviners
npm install
npm run build
```

4. **Start with PM2**
```bash
pm2 start npm --name "mms-website" -- start
pm2 save
pm2 startup
```

5. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **SSL Certificate**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## 📱 Post-Deployment Tasks

### 1. Test Everything
- [ ] All pages load correctly
- [ ] Animations work smoothly
- [ ] Forms submit properly
- [ ] Links open correctly
- [ ] Mobile responsive
- [ ] Different browsers (Chrome, Safari, Firefox)

### 2. Set Up Monitoring
- Google Analytics
- Google Search Console
- Uptime monitoring (UptimeRobot)

### 3. Performance Optimization
- Enable compression (Gzip/Brotli)
- Cache static assets
- Optimize images (use WebP)
- Minify CSS/JS (Next.js does this automatically)

### 4. SEO Tasks
- Submit sitemap to Google
- Create Google My Business listing
- Add structured data (Schema.org)
- Set up social media links

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use Vercel/Netlify environment variables
   - Rotate secrets regularly

2. **HTTPS**
   - Always use SSL certificate
   - Force HTTPS redirects

3. **Headers**
```javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ],
      },
    ];
  },
};
```

---

## 📊 Analytics Setup

### Google Analytics 4

1. Create GA4 property
2. Add tracking code to `app/layout.js`:

```javascript
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
```

---

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (must be 18+)
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`

### Images Not Loading
- Check file paths (case-sensitive)
- Verify images are in `/public` folder
- Use Next.js `<Image>` component

### Animations Not Working
- Check JavaScript is enabled
- Verify CSS modules are loading
- Check browser console for errors

### Mobile Issues
- Test viewport meta tag
- Check media queries
- Verify touch events work

---

## 📈 Performance Optimization Tips

1. **Image Optimization**
```javascript
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  loading="lazy"
/>
```

2. **Font Optimization**
```javascript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

3. **Code Splitting**
```javascript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

---

## 🎯 Success Metrics

After deployment, monitor:
- Page load speed (< 3 seconds)
- Lighthouse score (> 90)
- Mobile usability score
- Bounce rate (< 50%)
- Average session duration (> 2 minutes)

---

## 📞 Support & Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor error logs
- Backup database (when implemented)
- Review analytics
- Update content

### Emergency Contacts
- Hosting provider support
- Domain registrar
- Developer contact

---

## ✅ Final Checklist

Before going live:
- [ ] All contact info updated
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics installed
- [ ] All pages tested
- [ ] Mobile responsive verified
- [ ] SEO optimized
- [ ] Social media links added
- [ ] Favicon updated
- [ ] 404 page created
- [ ] Privacy policy added (if needed)
- [ ] Terms of service added (if needed)

---

**Your website is now ready to impress clients! 🎉**
