# Huntly AI

**All Your Applications. One Smart Dashboard.**

Huntly AI is a modern, AI-powered job tracking application that helps job seekers stay organized, track their applications, and discover personalized job opportunities. Built with Next.js and powered by Google Gemini AI, Huntly AI automatically imports, summarizes, and organizes job postings into a clear pipeline, so you can focus on getting hired.

---

## 🚀 Key Features

- **📋 AI-Powered Job Summarization** - Automatically extract and summarize job descriptions, skills, responsibilities, and qualifications using Google Gemini AI
- **🎯 Smart Job Recommendations** - Get personalized job recommendations based on your resume, skills, and job preferences
- **📊 Application Tracker** - Visualize your job search progress with a drag-and-drop Kanban board (Wishlist → Applied → Interview → Offer → Rejected)
- **📄 Resume Management** - Upload and manage multiple resumes with AI-powered analysis that extracts skills, education, and experience
- **🎨 Match Score Calculation** - See how well you match each job posting with AI-calculated compatibility scores (0-100)
- **🔍 Advanced Filtering** - Filter jobs by location, employment type, remote options, salary range, and search queries
- **👤 Comprehensive Profile** - Manage your profile with skills, education, job preferences, and contact information
- **📧 Email Notifications** - Receive email alerts for new job recommendations (configurable)
- **🌙 Dark Mode Support** - Beautiful UI with light/dark theme support
- **📱 Responsive Design** - Fully responsive interface that works seamlessly on desktop and mobile devices

---

## 🛠️ Tech Stack

### **Frontend**

- **Framework**: Next.js 15.5.6 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: TanStack React Query 5.90.5
- **Forms**: React Hook Form 7.62.0 + Zod 4.1.3
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Charts**: Recharts 2.15.4
- **Notifications**: Sonner 2.0.7

### **Backend**

- **Runtime**: Node.js
- **Database**: PostgreSQL (via Prisma ORM 6.16.2)
- **Authentication**: Clerk 6.34.1
- **File Storage**: Supabase Storage
- **Background Jobs**: Inngest 3.44.4
- **Email Service**: Resend 6.4.2

### **AI & External Services**

- **AI Provider**: Google Gemini AI (@google/genai 1.28.0)
- **Job Search API**: Serper API
- **File Upload**: UploadThing 7.5.2

### **Development Tools**

- **Package Manager**: npm
- **Linting**: ESLint 9
- **Type Checking**: TypeScript
- **Email Preview**: React Email 4.3.2

---

## 📦 Getting Started

### **Prerequisites**

- Node.js 20+ installed
- PostgreSQL database (or use a service like Neon, Supabase, or Railway)
- npm or yarn package manager
- Accounts for the following services:
  - [Clerk](https://clerk.com) (Authentication)
  - [Supabase](https://supabase.com) (File Storage)
  - [Google AI Studio](https://aistudio.google.com) (Gemini API Key)
  - [Serper](https://serper.dev) (Job Search API)
  - [Resend](https://resend.com) (Email Service)
  - [Inngest](https://inngest.com) (Background Jobs - Optional)

### **Installation Steps**

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd huntly-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

   # Clerk Authentication
   CLERK_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/"
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/jobs/dashboard"
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/jobs/dashboard"
   CLERK_WEBHOOK_SECRET="whsec_..."

   # Supabase (File Storage)
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

   # Google Gemini AI
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

   # Serper API (Job Search)
   SERPER_API_KEY="your-serper-api-key"

   # Resend (Email)
   RESEND_API_KEY="re_..."

   # Inngest (Background Jobs - Optional)
   INNGEST_EVENT_KEY="your-inngest-event-key"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Open Prisma Studio to view your database
   npx prisma studio
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

6. **Set up Inngest (Optional - for background jobs)**

   If you want to use background job processing (automatic job search, resume analysis), run Inngest dev server in a separate terminal:

   ```bash
   npm run inngest
   ```

   This will start the Inngest dev server at `http://localhost:8288`

---

## 💻 Usage

### **Development**

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Start Inngest dev server (for background jobs)
npm run inngest

# Start email preview server
npm run email
```

### **Application Workflow**

1. **Sign Up / Sign In** - Create an account using Clerk authentication
2. **Set Job Preferences** - Add your desired job titles in the Profile page
3. **Upload Resume** - Upload your resume(s) to enable AI-powered job matching
4. **View Recommendations** - Browse AI-recommended jobs in the Dashboard
5. **Track Applications** - Use the Application Tracker to organize jobs by stage
6. **Manage Profile** - Update your skills, education, and preferences

### **Key Pages**

- **`/`** - Landing page with features and testimonials
- **`/jobs/dashboard`** - Main dashboard with job recommendations and filters
- **`/jobs/app-tracker`** - Kanban-style application tracker
- **`/jobs/profile`** - User profile management
- **`/jobs/resume`** - Resume upload and management
- **`/jobs/settings`** - Application settings

---

## 📁 Project Structure

```
huntly-ai/
├── app/                          # Next.js App Router pages
│   ├── actions/                  # Server actions
│   │   ├── jobs/                 # Job-related actions
│   │   ├── profile/              # Profile management actions
│   │   ├── resume/               # Resume actions
│   │   └── user-notifications/   # Notification actions
│   ├── api/                      # API routes
│   │   └── inngest/              # Inngest webhook endpoint
│   ├── generated/                # Generated Prisma client
│   ├── jobs/                     # Protected job-related pages
│   │   ├── dashboard/            # Main dashboard
│   │   ├── app-tracker/          # Application tracker
│   │   ├── profile/              # Profile page
│   │   ├── resume/               # Resume management
│   │   └── settings/             # Settings page
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                    # React components
│   ├── app-tracker/              # Application tracker components
│   ├── dashboard/                # Dashboard components
│   ├── landing/                  # Landing page components
│   ├── navbars/                  # Navigation components
│   ├── profile/                  # Profile components
│   ├── resume/                   # Resume components
│   ├── settings/                 # Settings components
│   ├── providers/                # Context providers
│   └── ui/                       # Reusable UI components
│
├── data/
│   └── env/                      # Environment variable validation
│       ├── client.ts             # Client-side env vars
│       └── server.ts             # Server-side env vars
│
├── features/
│   └── users/
│       └── db/                   # User database operations
│
├── lib/                          # Utility libraries
│   ├── config/                   # Configuration files
│   ├── constants/                # Application constants
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # Business logic services
│   ├── supabase/                 # Supabase client setup
│   ├── utils/                    # Utility functions
│   └── validations/              # Zod validation schemas
│
├── prisma/
│   ├── migrations/               # Database migrations
│   └── schema.prisma             # Prisma schema
│
├── services/                     # External service integrations
│   ├── inngest/                  # Inngest background jobs
│   │   ├── functions/            # Inngest functions
│   │   └── client.ts             # Inngest client
│   └── resend/                   # Email service
│
├── auth.ts                       # Auth configuration
├── auth-middleware.ts            # Auth middleware
├── middleware.ts                 # Next.js middleware
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

---

## 🔐 Environment Variables

### **Required Variables**

| Variable                                          | Description                           | Where to Get It                                           |
| ------------------------------------------------- | ------------------------------------- | --------------------------------------------------------- |
| `DATABASE_URL`                                    | PostgreSQL connection string          | Your database provider (Neon, Supabase, Railway, etc.)    |
| `CLERK_SECRET_KEY`                                | Clerk secret key for server-side auth | [Clerk Dashboard](https://dashboard.clerk.com)            |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`               | Clerk publishable key                 | [Clerk Dashboard](https://dashboard.clerk.com)            |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`                   | Sign-in page URL                      | Usually `/`                                               |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Redirect after sign-in                | Usually `/jobs/dashboard`                                 |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | Redirect after sign-up                | Usually `/jobs/dashboard`                                 |
| `CLERK_WEBHOOK_SECRET`                            | Clerk webhook secret                  | [Clerk Dashboard](https://dashboard.clerk.com) → Webhooks |
| `NEXT_PUBLIC_SUPABASE_URL`                        | Supabase project URL                  | [Supabase Dashboard](https://supabase.com/dashboard)      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`                   | Supabase anonymous key                | [Supabase Dashboard](https://supabase.com/dashboard)      |
| `SUPABASE_SERVICE_ROLE_KEY`                       | Supabase service role key             | [Supabase Dashboard](https://supabase.com/dashboard)      |
| `GOOGLE_GENERATIVE_AI_API_KEY`                    | Google Gemini API key                 | [Google AI Studio](https://aistudio.google.com)           |
| `SERPER_API_KEY`                                  | Serper API key for job search         | [Serper.dev](https://serper.dev)                          |
| `RESEND_API_KEY`                                  | Resend API key for emails             | [Resend Dashboard](https://resend.com/api-keys)           |

### **Optional Variables**

| Variable            | Description                           | Where to Get It                              |
| ------------------- | ------------------------------------- | -------------------------------------------- |
| `INNGEST_EVENT_KEY` | Inngest event key for background jobs | [Inngest Dashboard](https://app.inngest.com) |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Here are some guidelines:

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the existing code style
3. **Write or update tests** if applicable
4. **Ensure all linting checks pass** (`npm run lint`)
5. **Submit a pull request** with a clear description of your changes

### **Code Style**

- Use TypeScript for all new code
- Follow the existing component structure
- Use meaningful variable and function names
- Add comments for complex logic
- Ensure responsive design for mobile devices

---

## 📝 License

This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [Radix UI](https://www.radix-ui.com)
- Icons from [Lucide](https://lucide.dev)
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)

---

## 📧 Support

For questions, issues, or feature requests, please open an issue in the repository.

---

**Happy Job Hunting! 🎯**
