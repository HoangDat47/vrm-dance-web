# 🎭 VRM Dance Web

A stunning web application featuring virtual VRM characters with real-time animations, dynamic model/animation management, and interactive UI with Supabase backend.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.180-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## ✨ Features

- 🎪 **Real-time VRM Rendering** - 3D character rendering with Three.js and @pixiv/three-vrm
- 💃 **VRMA Animation Queue** - Automatic animation playback with lazy loading and shuffling
- 🎨 **Dynamic Model Switcher** - Easy switching between multiple VRM models from database
- 🌄 **Background Customization** - Multiple background options with cookie persistence
- 🔐 **Admin Panel** - Upload and manage VRM models and animations (admin only)
- 💾 **Database Integration** - Supabase backend for models and animations storage
- 💾 **Cookie-based State Persistence** - Remembers user's selected model and background
- 📱 **Responsive UI** - Modern glassmorphism design with Tailwind CSS
- ⚡ **Performance Optimized** - Lazy loading, smart caching, and efficient animation management
- 🔄 **Auto-retry System** - Automatically retries incompatible animations until finding compatible ones

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account and project

### Installation

1. **Clone and install**
```bash
git clone https://github.com/yourusername/vrm-dance-web.git
cd vrm-dance-web
npm install
```

2. **Setup Supabase**
- Create a Supabase project at https://supabase.com
- Copy `.env.example` to `.env.local`
- Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

## 🛠️ Tech Stack

### Core
- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

### 3D & VRM
- **Three.js 0.180** - WebGL 3D library
- **@pixiv/three-vrm 3.4.3** - VRM model loading and runtime
- **@pixiv/three-vrm-animation 3.4.3** - VRMA animation support

### Backend & Database
- **Supabase** - Backend as a Service (Database, Storage, Auth)
- **PostgreSQL** - Database for models and animations metadata
- **Supabase Storage** - File storage for VRM models, animations, and avatars

### UI & Animation
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **Tailwind CSS** - Utility-first styling

## 📁 Project Structure

```
vrm-dance-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main application page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── (auth)/               # Auth pages (login, etc.)
│   │   └── api/                  # API routes
│   │       ├── models/           # Models CRUD endpoints
│   │       ├── animations/       # Animations CRUD endpoints
│   │       └── auth/             # Authentication endpoints
│   ├── components/
│   │   ├── VRMDancer.tsx         # VRM 3D renderer with animation queue
│   │   ├── LiveHeader.tsx        # Header with model/background controls
│   │   ├── AdminPanel.tsx        # Admin panel for uploads
│   │   ├── ModelCombobox.tsx     # Model dropdown selector
│   │   ├── ModelManagement.tsx   # Model upload & management
│   │   ├── AnimationManagement.tsx # Animation upload & management
│   │   ├── BackgroundCombobox.tsx # Background selector
│   │   ├── VRMPreview.tsx        # VRM model preview component
│   │   └── ui/                   # Reusable UI components (shadcn/ui)
│   ├── constants/
│   │   └── backgrounds.ts        # Background image configurations
│   ├── lib/
│   │   ├── auth-context.tsx      # Auth context provider
│   │   ├── supabase.ts           # Supabase client
│   │   └── utils.ts              # Helper utilities
│   ├── utils/
│   │   ├── cookies.ts            # Cookie utilities
│   │   └── shuffle.ts            # Array shuffle utility
│   └── middleware.ts             # Next.js middleware for auth
├── public/
│   ├── background/               # Background images
│   └── avatar/                   # Default avatars (optional)
├── supabase/
│   └── migrations/               # Database migration files
├── .env.example                  # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## 🎨 Customization

### Add New VRM Models

1. Login to the app with admin credentials
2. Click "Admin Panel" button in the header
3. In the "Model Management" tab, click "Choose File"
4. Select your `.vrm` file and optionally provide:
   - Custom name (or it will auto-detect from filename)
   - Avatar image URL
   - Rotation (degrees)
   - Scale factor
5. Click "Upload Model" and wait for completion
6. Model is now available in the Model Combobox for all users

### Add New Animations

1. Login to the app with admin credentials
2. Click "Admin Panel" button in the header
3. Go to "Animation Management" tab
4. Click "Choose File" and select your `.vrma` file
5. Optionally provide a custom name
6. Click "Upload Animation" and wait for completion
7. Animation is now in the shuffle queue for all models

### Change Background Images

1. Place image in `public/background/`
2. Add to `src/constants/backgrounds.ts`:
```typescript
{
  id: 'custom-bg',
  name: 'Custom Background',
  path: '/background/your-bg.png',
  description: 'Your description'
}
```

> **Note:** Models and animations are stored in Supabase Storage buckets and metadata in PostgreSQL database. No code changes required for adding new models/animations!

## 🎯 How It Works

### Animation Queue System
The `VRMDancer` component implements a sophisticated animation system:
- **Database-driven**: Animations loaded from Supabase via `/api/animations`
- **Auto-play**: Automatically cycles through animations from the queue
- **Lazy Loading**: Animations load on-demand to optimize performance
- **Preloading**: First 3 animations preload for smooth playback
- **Shuffling**: Animation order is randomized each cycle
- **Compatibility Validation**: Validates animation tracks - skips incompatible animations (0 tracks)
- **Auto-retry**: If animation fails to load, automatically queues next animation after 500ms
- **Error Feedback**: Displays error message with retry indication during loading failures

### State Persistence
User preferences are saved to cookies:
- Selected VRM model (365 days)
- Selected background (365 days)
- Restored automatically on page refresh

### Performance Optimizations
- Proper mixer cleanup on model change (stop actions, uncache root, clear cache)
- Failsafe timeout (10s) prevents stuck loading states
- Animation cache cleared per-VRM to prevent cross-model contamination
- Efficient Supabase SDK upload (10MB in ~2s)
- Smart cleanup on component unmount

## 🐛 Troubleshooting

### VRM Model Not Loading
- Check Supabase connection (verify env variables in `.env.local`)
- Ensure VRM file uploaded successfully via Admin Panel
- Check browser console for loader errors
- Verify VRM file is version 1.0+
- Check database has model entry: `/api/models` should return the model

### Animations Not Playing or Stuck in T-Pose
- **Normal behavior**: Some animations are incompatible with certain VRM models (different bone structure)
- **Auto-retry**: System will automatically skip incompatible animations and try next one
- Check browser DevTools for "Failed to load animation clip" or "Animation has 0 tracks"
- Wait for auto-retry (500ms delay) - compatible animation will load eventually
- If stuck for >10s, refresh page (failsafe timeout resets loading state)

### Upload Failures
- Check Supabase Storage bucket permissions (RLS policies)
- Verify file size limits (default: 50MB for Supabase free tier)
- Check network connection during upload
- Ensure admin authentication is valid

### Performance Issues
- Reduce VRM model polygon count before uploading
- Use browser hardware acceleration
- Close other browser tabs
- Check Supabase region latency

### Model/Background Not Persisting After Refresh
- Clear browser cookies and refresh
- Check cookie utility functions in `src/utils/cookies.ts`
- Verify cookies are enabled in browser settings

## 📚 API Reference

### VRMDancer Component Props
```typescript
interface VRMDancerProps {
  vrmUrl: string;      // Path to .vrm model file
  rotation?: number;   // Model rotation in degrees (default: 0)
  scale?: number;      // Model scale factor (default: 1.5)
}
```

### API Endpoints

#### GET /api/models
Returns list of all VRM models from database.
```json
[
  {
    "id": "uuid",
    "name": "Model Name",
    "file_url": "https://supabase-storage-url/model.vrm",
    "avatar_url": "https://...",
    "rotation": 0,
    "scale": 1.25,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /api/models
Upload new VRM model (requires admin auth).
- **Body**: FormData with `file`, optional `name`, `avatar_url`, `rotation`, `scale`
- **Response**: Created model object

#### DELETE /api/models?id=uuid
Delete VRM model (requires admin auth).

#### GET /api/animations
Returns list of all animations from database.

#### POST /api/animations
Upload new animation (requires admin auth).

#### DELETE /api/animations?id=uuid
Delete animation (requires admin auth).

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add amazing feature'`)
5. Push (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run ESLint
```

## 📄 License

This project is open source and available under the MIT License.


