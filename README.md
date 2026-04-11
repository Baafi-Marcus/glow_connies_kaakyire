# ✨ Glow By Connie — Premium Boutique Platform

Glow By Connie is a high-end, AI-driven e-commerce platform designed for Ghana's luxury beauty and accessories market. The platform combines cinematic aesthetics with powerful administrative automation.

## 🚀 Key Features

### 💎 Cinematic Storefront
- **Dark Luxury Aesthetic**: A curated HSL color palette and glassmorphic UI elements for a premium feel.
- **Slow & Elegant Animations**: Custom CSS animations (`slow-zoom`, `fade-in-up`) for a professional boutique experience.
- **Responsive Design**: Seamless shopping across mobile, tablet, and desktop.

### 🪄 "Bulk Magic" AI Automation (Admin)
- **Batch Processing**: Upload dozens of product photos simultaneously.
- **Gemini Vision Integration**: AI automatically scans images to suggest product titles, detailed descriptions, and market-appropriate pricing.
- **Draft Workflow**: All bulk uploads are saved as drafts, allowing admin review before going live.

### 🏷️ Marketing & Sales Tools
- **Dynamic Badges**: Highlight items as `NEW`, `BEST SELLER`, or `EXCLUSIVE`.
- **Discount Pricing**: Integrated "Old Price" strikethrough logic (~~GHC 500~~ **GHC 350**) to drive conversions.
- **Stock Alerts**: Real-time visual indicators for low inventory levels.

### 📱 WhatsApp-Integrated Checkout
- **Instant Connectivity**: Orders are logged to the database and then redirected to WhatsApp for finalization.
- **Order References**: Unique reference IDs (e.g., `#B2C9A`) generated for Every order.
- **Status Tracking**: Internal order management with `PENDING`, `COMPLETED`, and `CANCELLED` states.

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS + Vanilla CSS Keyframes
- **Database**: Neon PostgreSQL via Prisma ORM
- **Intelligence**: Google Gemini AI (Vision & Flash)
- **Media**: Cloudinary (Image Hosting)
- **Icons**: Heroicons

## 📦 Setup & Deployment

### 1. Environment Configuration
Ensure your `.env` contains:
```env
DATABASE_URL="postgresql://..."
GEMINI_API_KEY="..."
CLOUDINARY_URL="cloudinary://..."
```

### 2. Development
```bash
npm install
npx prisma db push
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---
*Created with focus on luxury, speed, and automation for Glow By Connie.*
