export interface VRMModel {
  id: string;
  name: string;
  path: string;
  avatar?: string;
  rotation?: number;
  scale?: number;
}

export const VRM_MODELS: VRMModel[] = [
  {
    id: 'model-1',
    name: 'Emi oxxo',
    path: '/models/3193725086051913960.vrm',
    avatar: '/avatar/637392033797240969.webp',
    rotation: 0,
    scale: 1.25
  },
  {
    id: 'model-2',
    name: 'Emi oxxo 2',
    path: '/models/6495297707688600205.vrm',
    avatar: '/avatar/427480741494172625.webp',
    rotation: 180,
    scale: 1.25
  },
  {
    id: 'model-3',
    name: 'Iva Hellock',
    path: '/models/Iva_Hellock_v10.vrm',
    avatar: '/avatar/Iva.jpg',
    rotation: 180,
    scale: 1.25
  },
  {
    id: 'model-4',
    name: 'Iva Hellock B',
    path: '/models/Iva_Hellock_B._ver.vrm',
    avatar: '/avatar/IvaB.jpg',
    rotation: 180,
    scale: 1.25
  },
  {
    id: 'model-5',
    name: 'Tlipoca',
    path: '/models/Tlipoca_maid_.vrm',
    avatar: '/avatar/Tlipoca.jpg',
    rotation: 180,
    scale: 1.25
  },
  // Add more models here
];

export const DEFAULT_MODEL_ID = 'model-1';
