export interface Background {
  id: string;
  name: string;
  path: string;
  description: string;
  thumbnail?: string;
}

export const BACKGROUNDS: Background[] = [
  {
    id: 'room-bg',
    name: 'Room',
    path: '/background/room-background.png',
    description: 'Cozy room setting',
    thumbnail: '/background/room-background.png'
  },
  {
    id: 'studio-bg',
    name: 'Studio',
    path: '/background/studio-background.png',
    description: 'Professional studio',
    thumbnail: '/background/studio-background.png'
  },
  {
    id: 'outdoor-bg',
    name: 'Outdoor',
    path: '/background/outdoor-background.png',
    description: 'Outdoor scenery',
    thumbnail: '/background/outdoor-background.png'
  },
  {
    id: 'night-bg',
    name: 'Night',
    path: '/background/night-background.png',
    description: 'Night atmosphere',
    thumbnail: '/background/night-background.png'
  },
];

export const DEFAULT_BACKGROUND_ID = 'room-bg';
