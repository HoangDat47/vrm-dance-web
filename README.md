# 🎭 VRM Dance Studio

A stunning live streaming platform featuring virtual VRM characters with real-time animations, live chat, and music integration.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-Latest-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎪 **VRM Character Animation** - Real-time 3D character rendering with VRMA animation support
- 💬 **Live Chat System** - Interactive chat with user avatars and color-coded messages
- 🎵 **Spotify Integration** - Embedded music player with playlist support
- 🌊 **Danmaku Comments** - Floating comments across the screen (Bilibili/Niconico style)
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ✨ **Glassmorphism UI** - Modern, translucent interface design
- 🎨 **Smooth Animations** - Powered by Framer Motion and CSS animations

## 🚀 Demo

[Live Demo](#) (Add your deployment URL here)

## 📸 Screenshots

Add screenshots of your application here

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library

### 3D & VRM
- **Three.js** - WebGL 3D library
- **@pixiv/three-vrm** - VRM model loader and runtime
- **@pixiv/three-vrm-animation** - VRMA animation support
- **@react-three/fiber** - React renderer for Three.js

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Setup

1. **Clone the repository**

```
git clone https://github.com/yourusername/vrm-dance-studio.git
cd vrm-dance-studio
```
2. **Install dependencies**
```
npm install
# or
yarn install
# or
pnpm install
```
3. **Add your VRM model and VRMA animation**

Place your files in the `public` folder:
```
public/
    ├── model.vrm
    └── animation.vrma
    ```
4. **Update the file paths in `src/app/page.tsx`**
```
<VRMDancer vrmUrl="/models/your-model.vrm" animationUrl="/animations/your-animation.vrma" />
```

5. **Run the development server**
```
npm run dev
# or
yarn dev
# or
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
vrm-dance-studio/
├── src/
│ ├── app/
│ │ ├── page.tsx # Main page with live stream UI
│ │ ├── layout.tsx # Root layout
│ │ └── globals.css # Global styles & animations
│ └── components/
│ └── VRMDancer.tsx # VRM character renderer
├── public/
│ ├── models/ # VRM model files
│ └── animations/ # VRMA animation files
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

## 🎨 Customization

### Change Character
Replace the VRM model in `public/models/` and update the path in `page.tsx`

### Change Animation
Replace the VRMA file in `public/animations/` and update the path in `page.tsx`

### Modify Chat Messages
Edit the `DEMO_COMMENTS` array in `src/app/page.tsx`:
```
const DEMO_COMMENTS = [
{ user: 'YourName', text: 'Hello!', color: '#FF69B4' },
// Add more...
];
```

### Change Spotify Playlist
Update the Spotify embed URL in the iframe:
```
src="https://open.spotify.com/embed/playlist/YOUR_PLAYLIST_ID"
```

## 🎯 Features Breakdown

### VRM Character
- Loads VRM 1.0 models
- Supports VRMA animations
- Real-time rendering with Three.js
- Customizable scale and position

### Live Chat
- Real-time message display
- User avatars with color coding
- Auto-scroll functionality
- Message input with validation

### Danmaku System
- Floating comments across screen
- Random positioning
- Custom colors and animations
- Desktop-only feature

### Responsive Design
- Mobile: Collapsible panels with floating buttons
- Tablet: Optimized layout
- Desktop: Full feature set with sidebars

## 🐛 Troubleshooting

**VRM model not loading?**
- Check file path is correct
- Ensure VRM file is version 1.0
- Check browser console for errors

**Animation not playing?**
- Verify VRMA file format
- Check file path in code
- Ensure model supports the animation

**Performance issues?**
- Reduce VRM model polygon count
- Disable danmaku on mobile
- Optimize textures

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

Made with ❤️ using Next.js and Three.js


