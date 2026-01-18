'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';

interface VRMPreviewProps {
  vrmUrl: string;
  rotation?: number;
  scale?: number;
}

export default function VRMPreview({ vrmUrl, rotation = 0, scale = 1.5 }: VRMPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    const canvas = canvasRef.current;
    const rect = canvas.parentElement?.getBoundingClientRect();
    const width = rect?.width || window.innerWidth;
    const height = rect?.height || window.innerHeight;

    renderer.setSize(width, height);
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

    // Load VRM
    loader.load(
      vrmUrl,
      (gltf) => {
        const vrm = gltf.userData.vrm as VRM;

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

        setIsLoading(false);

        // Simple animation loop
        const clock = new THREE.Clock();
        const animate = () => {
          requestAnimationFrame(animate);
          const deltaTime = clock.getDelta();
          vrm.update(deltaTime);
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => {
        console.error('VRM load error:', error);
        setIsLoading(false);
      }
    );

    return () => {
      renderer.dispose();
    };
  }, [vrmUrl, rotation, scale]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Loading Screen */}
      {isLoading && (
        <div className="z-50 absolute inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center text-white text-center">
            <div className="mb-4 border-4 border-purple-500 border-t-transparent rounded-full w-16 h-16 animate-spin" />
            <p className="font-semibold text-lg">Loading VRM Model...</p>
          </div>
        </div>
      )}
    </div>
  );
}
