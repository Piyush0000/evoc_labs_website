# EvocLabs — Official Landing Page

> **Start at Zero Cost, Scale Fast.**  
> We build brands that sell themselves. You focus on growing your business — we handle strategy, design, and marketing. Pay only when you start making sales.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Backend / DB | Firebase (Firestore + Anonymous Auth) |
| Deployment | Vercel + GitHub Pages (static export) |

---

## 📁 Project Structure

```
app/               # Next.js App Router pages
  ├── page.tsx         # Home / Hero
  ├── blogs/           # Blog listing page
  ├── book-demo/       # Book a free demo
  ├── careers/         # Careers & internship listings
  └── layout.tsx       # Root layout

components/        # Reusable UI components
  └── CareersApplicationForm.tsx

lib/
  └── firebase/        # Firebase client, auth, Firestore helpers

data/              # Static data (blog posts, job listings, etc.)
public/            # Static assets
firestore.rules    # Firestore security rules
```

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Shreya-singh22/Evoc_labs.git
cd Evoc_labs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in your Firebase project credentials in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔥 Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** (in production mode).
3. Enable **Anonymous Authentication** under *Authentication → Sign-in method*.
4. Deploy Firestore security rules:

```bash
firebase deploy --only firestore:rules
```

---

## 🏗️ Building for Production

```bash
npm run build
```

---

## 📄 License

© 2026 EvocLabs. All rights reserved.
"# evoc_labs_website" 
