export const ANIMATION_LIST = [
  '/animations/dance.vrma',
  '/animations/ソワレ.vrma',
  '/animations/V_HIMEHINA.vrma',
  '/animations/テレパシ.vrma',
  '/animations/天天天国地獄国.vrma',
  // Add more animations here
];

export const getRandomAnimation = () => {
  return ANIMATION_LIST[Math.floor(Math.random() * ANIMATION_LIST.length)];
};
