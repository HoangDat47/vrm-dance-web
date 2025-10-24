export interface VRMModel {
  id: string;
  name: string;
  path: string;
  thumbnail?: string;
  rotation?: number;
  scale?: number;
}

export const VRM_MODELS: VRMModel[] = [
  {
    id: 'model-1',
    name: 'Emi oxxo',
    path: '/models/3193725086051913960.vrm',
    thumbnail: '/thumbnails/637392033797240969.webp',
    rotation: 0,
    scale: 1.25
  },
  {
    id: 'model-2',
    name: 'Emi oxxo 2',
    path: '/models/6495297707688600205.vrm',
    thumbnail: '/thumbnails/427480741494172625.webp',
    rotation: 180,
    scale: 1.25
  },
  // Add more models here
];

export const DEFAULT_MODEL_ID = 'model-1';
