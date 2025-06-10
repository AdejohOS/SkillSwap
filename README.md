# 🔁 SkillSwap

SkillSwap is a peer-to-peer learning marketplace where users can teach and learn
real-world skills through flexible and personalized exchange sessions. Whether
you're a designer offering UI/UX lessons or a developer looking to learn
Spanish, SkillSwap connects you to the right people, no money, just skills.

---

## 🚀 Features

- 🔍 **Skill Discovery:** Full-text search with filters by category, experience
  level, teaching method, location, and availability.
- 💡 **Skill Offering & Requests:** Users can create detailed offerings or post
  skill requests for others to discover.
- 🤝 **Swaps System:** One-to-one learning exchanges connecting a learner with a
  teacher.
- 💬 **Messaging:** Chat with potential swap partners to coordinate sessions.
- ⭐ **Reviews & Ratings:** Rate and review your learning experiences to build
  trust.
- 📍 **Location-aware Matching:** See skills available nearby.
- 🔐 **Authentication:** Magic link + OAuth (Google, Facebook), with role-based
  access.
- 📈 **Credit System:** Manage and track learning credits.
- 📦 **Scalable Backend:** Powered by Supabase with fine-grained RLS and
  efficient PostgreSQL functions.
- 💻 **Modern Frontend:** Built with Next.js 15 and Tailwind CSS.

---

## 📸 Screenshots

> [Live Site](https://skill-swap-rho-beige.vercel.app/)

---

## 🛠️ Tech Stack

| Frontend   | Backend                     | Database | Auth                   | Realtime          | Styling      |
| ---------- | --------------------------- | -------- | ---------------------- | ----------------- | ------------ |
| Next.js 15 | Server Actions & API Routes | Supabase | Supabase Auth ( OAuth) | Supabase Realtime | Tailwind CSS |

---

## 🧩 Future Plans (SaaS Vision)

- Team plans for organizations and schools
- Stripe integration for paid lessons and pro accounts
- Skill certificates for verified sessions
- Marketplace moderation dashboard
- Mobile app (React Native or Flutter)

---

## 🧪 Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/AdejohOS/SkillSwap.git
   cd skillswap
   ```

2. **Install dependencies**

   ```bash
   pnpm i
   ```

3. **Add supabase credentials at .env.local**

   NEXT_PUBLIC_SUPABASE_URL=your-url NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

4. **Run development server**
   ```bash
   pnpm dev
   ```

Built with ❤️ by Sunday Adejoh Email: elusivebrown@gmail.com Portfolio:
https://portfolio-gamma-sand-73.vercel.app/projects
