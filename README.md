# 🎭 VRM Dance Web

A stunning web application featuring virtual VRM characters with real-time animations, dynamic animation queue system, and interactive UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.180-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)

## ✨ Features

- 🎪 **Real-time VRM Rendering** - 3D character rendering with Three.js and @pixiv/three-vrm
- 💃 **VRMA Animation Queue** - Automatic animation playback with lazy loading and shuffling
- 🎨 **Dynamic Model/Background Switcher** - Easy switching between multiple VRM models and backgrounds
- 📊 **Advanced Status Bar** - Real-time stats with Needy Girl Overdose inspired UI (pastel retro style)
- 💾 **Cookie-based State Persistence** - Remembers user's selected model and background
- 📱 **Responsive UI** - Modern glassmorphism design with Tailwind CSS
- ⚡ **Performance Optimized** - Lazy loading, smart caching, and efficient animation management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone and install**
```bash
git clone https://github.com/yourusername/vrm-dance-web.git
cd vrm-dance-web
npm install
```

2. **Run development server**
```bash
npm run dev
```

3. **Open in browser**
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

### UI & Animation
- **Framer Motion 12** - Advanced animations
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library

### AI Integration
- **Google Generative AI** - For potential AI features

## � Project Structure

```
vrm-dance-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main application page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── VRMDancer.tsx         # VRM 3D renderer with animation queue
│   │   ├── LiveHeader.tsx        # Header with controls
│   │   ├── ModelSelector.tsx     # Model selection UI
│   │   ├── ModelCombobox.tsx     # Model dropdown
│   │   ├── BackgroundCombobox.tsx # Background dropdown
│   │   └── ui/                   # Reusable UI components
│   ├── constants/
│   │   ├── models.ts             # VRM model configurations
│   │   ├── backgrounds.ts        # Background image paths
│   │   ├── animations.ts         # Animation list
│   │   ├── demo-comments.ts      # Demo chat messages
│   │   ├── default-playlists.ts  # Playlist data
│   │   └── personalities.ts      # Character personalities
│   ├── hooks/
│   │   └── useAIResponse.ts      # AI response hook
│   ├── types/
│   │   └── chat.ts               # TypeScript types
│   ├── utils/
│   │   ├── cookies.ts            # Cookie utilities
│   │   ├── gemini.ts             # AI integration
│   │   └── shuffle.ts            # Array shuffle utility
│   └── lib/
│       └── utils.ts              # Helper utilities
├── public/
│   ├── models/                   # VRM model files (.vrm)
│   ├── animations/               # VRMA animation files (.vrma)
│   ├── background/               # Background images
│   └── avatar/                   # Character avatars
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## 🎨 Customization

### Add New VRM Models

1. Place your `.vrm` file in `public/models/`
2. Add to `src/constants/models.ts`:
```typescript
{
  id: 'model-3',
  name: 'Your Character Name',
  path: '/models/your-model.vrm',
  avatar: '/avatar/your-avatar.webp',
  rotation: 0,
  scale: 1.25
}
```

### Add New Animations

1. Place your `.vrma` file in `public/animations/`
2. Add to `src/constants/animations.ts`:
```typescript
export const ANIMATION_LIST = [
  '/animations/dance.vrma',
  '/animations/your-animation.vrma',
  // ...
];
```

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

## 🎯 How It Works

### Animation Queue System
The `VRMDancer` component implements a sophisticated animation system:
- **Auto-play**: Automatically cycles through animations from the queue
- **Lazy Loading**: Animations load on-demand to optimize performance
- **Preloading**: First 3 animations preload for smooth playback
- **Shuffling**: Animation order is randomized each cycle
- **Status Display**: Retro UI shows real-time queue, played count, and cache size

### State Persistence
User preferences are saved to cookies:
- Selected VRM model (365 days)
- Selected background (365 days)

### Performance Optimizations
- WebGL context culling disabled for smooth animation
- Efficient animation mixer updates
- Smart cleanup on tab visibility changes
- Heartbeat system monitors animation health every 3 seconds

## 🐛 Troubleshooting

### VRM Model Not Loading
- Verify file path is correct in `constants/models.ts`
- Ensure VRM file is version 1.0+
- Check browser console for loader errors
- Confirm model file is not corrupted

### Animations Not Playing
- Verify VRMA file format is correct
- Check animation paths in `constants/animations.ts`
- Ensure VRM model supports the animation
- Check browser DevTools for animation errors

### Performance Issues
- Reduce VRM model polygon count
- Limit number of preloaded animations
- Close other browser tabs
- Use hardware acceleration in browser settings

### Model/Background Not Switching
- Clear browser cookies and refresh
- Check that model/background ID exists in constants
- Verify file paths are accessible

## 📚 API Reference

### VRMDancer Component Props
```typescript
interface VRMDancerProps {
  vrmUrl: string;      // Path to .vrm model file
  rotation?: number;   // Model rotation in degrees (default: 0)
  scale?: number;      // Model scale factor (default: 1.5)
}
```

### Status Bar Display
Real-time stats shown at bottom center:
- **Current Animation**: Name of currently playing animation
- **Queue**: Number of animations waiting in queue
- **Played**: Count of animations played / total animations
- **Cache**: Number of preloaded animations in memory

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


