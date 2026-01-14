'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { 
  VRMAnimation,
  VRMAnimationLoaderPlugin, 
  createVRMAnimationClip 
} from '@pixiv/three-vrm-animation';
import { shuffleArray } from '@/utils/shuffle';

interface VRMDancerProps {
  vrmUrl: string;
  rotation?: number;
  scale?: number; 
}

export default function VRMDancer({ vrmUrl, rotation = 0, scale = 1.5 }: VRMDancerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vrmRef = useRef<VRM | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const currentClipRef = useRef<THREE.AnimationAction | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const loaderRef = useRef<GLTFLoader | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadedAnimations, setLoadedAnimations] = useState<Map<string, THREE.AnimationClip>>(new Map());
  const [currentAnimation, setCurrentAnimation] = useState<string>('');
  
  const animationQueueRef = useRef<string[]>([]);
  const playedQueueRef = useRef<string[]>([]);
  const allAnimationsRef = useRef<string[]>([]);
  const isLoadingAnimationRef = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);

  // Lazy load animation
  const lazyLoadAnimation = async (animationUrl: string): Promise<THREE.AnimationClip | null> => {
    if (loadedAnimations.has(animationUrl)) {
      return loadedAnimations.get(animationUrl)!;
    }

    if (isLoadingAnimationRef.current) {
      return null;
    }

    const vrm = vrmRef.current;
    const loader = loaderRef.current;

    if (!vrm || !loader) return null;

    try {
      isLoadingAnimationRef.current = true;
      console.log(`🔄 Loading: ${animationUrl.split('/').pop()}`);

      const gltf = await loader.loadAsync(animationUrl);
      const vrmAnimations = gltf.userData.vrmAnimations as VRMAnimation[];
      
      if (vrmAnimations && vrmAnimations[0]) {
        const clip = createVRMAnimationClip(vrmAnimations[0], vrm);
        setLoadedAnimations(prev => new Map(prev).set(animationUrl, clip));
        console.log(`✅ Loaded: ${animationUrl.split('/').pop()}`);
        return clip;
      }
    } catch (error) {
      console.error(`❌ Failed: ${animationUrl.split('/').pop()}`, error);
    } finally {
      isLoadingAnimationRef.current = false;
    }

    return null;
  };

  // Play animation with loop
  const playAnimationWithLazyLoad = async (animationUrl: string, fadeTime: number = 0.5) => {
    const mixer = mixerRef.current;
    if (!mixer) return;

    // Clear previous timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    const clip = await lazyLoadAnimation(animationUrl);
    if (!clip) return;

    const newAction = mixer.clipAction(clip);
    
    // ✅ Loop animation để không bị dừng
    newAction.setLoop(THREE.LoopRepeat, Infinity);
    newAction.clampWhenFinished = false;

    if (currentClipRef.current && currentClipRef.current !== newAction) {
      currentClipRef.current.stop();
      newAction.reset();
      newAction.fadeIn(fadeTime);
      newAction.play();
    } else {
      newAction.reset();
      newAction.play();
    }

    currentClipRef.current = newAction;
    setCurrentAnimation(animationUrl);
    isPlayingRef.current = true;
    
    if (!playedQueueRef.current.includes(animationUrl)) {
      playedQueueRef.current.push(animationUrl);
    }

    // Auto switch sau khi loop 2 lần
    const duration = clip.duration * 1000;
    const repeatTimes = 2;
    
    console.log(`⏱️ Duration: ${(duration / 1000).toFixed(1)}s (will loop ${repeatTimes} times)`);
    
    animationTimeoutRef.current = setTimeout(() => {
      console.log('⏭️ Next animation...');
      queueNextAnimation();
    }, duration * repeatTimes);
  };

  // Get next animation from shuffle queue
  const getNextAnimation = (): string | null => {
    if (animationQueueRef.current.length === 0) {
      console.log('🔄 Shuffling animations...');
      animationQueueRef.current = shuffleArray(allAnimationsRef.current);
      playedQueueRef.current = [];
      console.log('✅ New queue:', animationQueueRef.current.map(url => url.split('/').pop()));
    }

    const next = animationQueueRef.current.shift();
    return next || null;
  };

  // Queue next animation
  const queueNextAnimation = async () => {
    const nextUrl = getNextAnimation();
    if (nextUrl) {
      console.log(`▶️ Playing: ${nextUrl.split('/').pop()}`);
      await playAnimationWithLazyLoad(nextUrl, 0.8);
    }
  };

  // Preload priority animations
  const preloadPriorityAnimations = async (vrm: VRM, urls: string[]): Promise<Map<string, THREE.AnimationClip>> => {
    const loader = loaderRef.current;
    const animations = new Map<string, THREE.AnimationClip>();

    if (!loader) return animations;

    const loadPromises = urls.slice(0, 3).map(async (url) => {
      try {
        const gltf = await loader.loadAsync(url);
        const vrmAnimations = gltf.userData.vrmAnimations as VRMAnimation[];
        
        if (vrmAnimations && vrmAnimations[0]) {
          const clip = createVRMAnimationClip(vrmAnimations[0], vrm);
          animations.set(url, clip);
          console.log(`✅ Preloaded: ${url.split('/').pop()}`);
        }
      } catch (error) {
        console.error(`Failed to preload: ${url.split('/').pop()}`, error);
      }
    });

    await Promise.all(loadPromises);
    return animations;
  };

  // ✅ Handle tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Tab active');
        
        const currentAction = currentClipRef.current;
        
        if (currentAction && !currentAction.isRunning()) {
          console.log('🔄 Restarting animation...');
          currentAction.reset();
          currentAction.play();
          isPlayingRef.current = true;
        } else if (!currentAction && allAnimationsRef.current.length > 0) {
          console.log('🎬 Starting new animation...');
          queueNextAnimation();
        }
      } else {
        console.log('👁️‍🗨️ Tab hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // ✅ Heartbeat: Check animation status every 3 seconds
  useEffect(() => {
    const heartbeat = setInterval(() => {
      const currentAction = currentClipRef.current;
      
      // Check if animation stopped unexpectedly
      if (currentAction && !currentAction.isRunning() && isPlayingRef.current) {
        console.warn('⚠️ Animation stopped unexpectedly! Restarting...');
        currentAction.reset();
        currentAction.play();
      }
      
      // If no animation playing, start one
      if (!currentAction && allAnimationsRef.current.length > 0 && !isLoadingAnimationRef.current) {
        console.log('🔄 No animation playing, starting one...');
        queueNextAnimation();
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(heartbeat);
  }, []);

  // Main setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 20);
    camera.position.set(0, 1.4, 3);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, Math.PI);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Setup loader
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
    loader.register((parser) => new VRMAnimationLoaderPlugin(parser));
    loaderRef.current = loader;

    // Load VRM
    loader.load(
      vrmUrl,
      async (gltf) => {
        const vrm = gltf.userData.vrm as VRM;
        vrmRef.current = vrm;

        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        vrm.scene.traverse((obj) => {
          obj.frustumCulled = false;
        });

        vrm.scene.scale.setScalar(scale);

        if (rotation !== 0) {
          vrm.scene.rotation.y = THREE.MathUtils.degToRad(rotation);
        }

        scene.add(vrm.scene);

        // Spring bones
        if (vrm.springBoneManager) {
          console.log('✅ Spring Bones enabled');
        }

        // Setup mixer
        const mixer = new THREE.AnimationMixer(vrm.scene);
        mixerRef.current = mixer;

        // Load animation list
        const { ANIMATION_LIST } = await import('@/constants/animations');
        
        allAnimationsRef.current = ANIMATION_LIST;
        animationQueueRef.current = shuffleArray([...ANIMATION_LIST]);
        
        console.log('🎲 Initial shuffle:', animationQueueRef.current.map(url => url.split('/').pop()));

        // Preload
        const priorityAnimations = await preloadPriorityAnimations(vrm, ANIMATION_LIST);
        setLoadedAnimations(priorityAnimations);
        console.log(`✅ Preloaded ${priorityAnimations.size} animations`);

        // Play first
        const firstUrl = getNextAnimation();
        if (firstUrl) {
          await playAnimationWithLazyLoad(firstUrl, 0);
        }

        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('VRM load error:', error);
        setIsLoading(false);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const deltaTime = clockRef.current.getDelta();

      if (mixerRef.current) {
        mixerRef.current.update(deltaTime);
      }

      if (vrmRef.current) {
        vrmRef.current.update(deltaTime);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      renderer.dispose();
      if (vrmRef.current) {
        scene.remove(vrmRef.current.scene);
      }
    };
  }, [vrmUrl]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
      
      {/* Loading Screen */}
      {isLoading && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center text-white text-center">
            <div className="mb-4 border-4 border-purple-500 border-t-transparent rounded-full w-16 h-16 animate-spin" />
            <p className="font-semibold text-lg">Loading VRM Model...</p>
          </div>
        </div>
      )}
      
      {/* Debug Info */}
      <div className="bottom-4 left-1/2 z-30 fixed bg-black/60 backdrop-blur-xl px-4 py-2 rounded text-white text-xs -translate-x-1/2">
        <p>Playing: {currentAnimation.split('/').pop() || 'None'}</p>
        <p>Queue: {animationQueueRef.current.length} | Played: {playedQueueRef.current.length}/{allAnimationsRef.current.length}</p>
        <p>Cached: {loadedAnimations.size} animations</p>
      </div>
    </>
  );
}
