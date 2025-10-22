"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { VRMLoaderPlugin, VRMUtils, VRM } from "@pixiv/three-vrm";
import {
  VRMAnimationLoaderPlugin,
  createVRMAnimationClip,
} from "@pixiv/three-vrm-animation";

interface VRMModelProps {
  url: string;
  animationUrl?: string;
}

function VRMModel({ url, animationUrl }: VRMModelProps) {
  const { scene } = useThree();
  const [vrm, setVrm] = useState<VRM | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef(new THREE.Clock());

  // Load VRM
  useEffect(() => {
    import("three/addons/loaders/GLTFLoader.js").then(({ GLTFLoader }) => {
      const loader = new GLTFLoader();
      loader.register((parser: any) => new VRMLoaderPlugin(parser));

      loader.load(url, (gltf: any) => {
        const loadedVrm = gltf.userData.vrm as VRM;

        if (loadedVrm) {
          loadedVrm.scene.rotation.y = 0;
          loadedVrm.scene.scale.setScalar(1.3);
          loadedVrm.scene.position.set(0, -1, 0);

          scene.add(loadedVrm.scene);

          mixerRef.current = new THREE.AnimationMixer(loadedVrm.scene);

          setVrm(loadedVrm);

          console.log("✅ VRM loaded successfully");
        }
      });
    });

    return () => {
      if (vrm) {
        scene.remove(vrm.scene);
        VRMUtils.deepDispose(vrm.scene);
      }
    };
  }, [url, scene]);

  // Load VRMA Animation
  useEffect(() => {
    if (!vrm || !animationUrl || !mixerRef.current) return;

    console.log("🎬 Loading VRMA animation from:", animationUrl);

    import("three/addons/loaders/GLTFLoader.js").then(({ GLTFLoader }) => {
      const loader = new GLTFLoader();
      loader.register((parser: any) => new VRMAnimationLoaderPlugin(parser));

      loader.load(
        animationUrl,
        (gltf: any) => {
          const vrmAnimations = gltf.userData.vrmAnimations;

          if (vrmAnimations && vrmAnimations.length > 0 && mixerRef.current) {
            console.log("✅ VRMA animations found:", vrmAnimations.length);

            // Create animation clip
            const clip = createVRMAnimationClip(vrmAnimations[0], vrm);

            // Play animation
            const action = mixerRef.current.clipAction(clip);
            action.play();

            console.log("✅ VRMA Animation playing!");
          } else {
            console.warn("⚠️ No animations found in VRMA file");
          }
        },
        (progress) => {
          const percent = ((progress.loaded / progress.total) * 100).toFixed(0);
          console.log(`⏳ Loading animation: ${percent}%`);
        },
        (error) => {
          console.error("❌ VRMA load error:", error);
        }
      );
    });
  }, [vrm, animationUrl]);

  // Animation loop
  useFrame(() => {
    if (!vrm) return;

    const delta = clockRef.current.getDelta();
    vrm.update(delta);

    // Update animation mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return null;
}

export default function VRMDancer({
  vrmUrl,
  animationUrl,
}: {
  vrmUrl: string;
  animationUrl?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [animLoaded, setAnimLoaded] = useState(false);

  useEffect(() => {
    if (animationUrl) {
      // Kiểm tra file có tồn tại không
      fetch(animationUrl, { method: "HEAD" })
        .then(() => {
          console.log("✅ VRMA file exists");
          setAnimLoaded(true);
        })
        .catch(() => {
          console.error("❌ VRMA file not found at:", animationUrl);
        });
    }
  }, [animationUrl]);

  return (
    <div className="relative w-screen h-screen">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur z-20">
          <div className="text-white text-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
            <p className="font-bold">Loading Character...</p>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0.8, 3.5], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping, // Màu sắc đậm hơn
          toneMappingExposure: 1.2, // Tăng độ sáng
        }}
        onCreated={() => setLoading(false)}
      >
        {/* <color attach="background" args={["#f7f7f7"]} /> */}

        {/* Giảm ambient light */}
        <ambientLight intensity={0.6} />

        {/* Tăng directional light với màu ấm */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={2.8}
          color="#ffffff"
          castShadow
        />
        <directionalLight
          position={[-5, 3, -3]}
          intensity={1.2}
          color="#ffeeee" // Ánh sáng hơi ấm
        />

        {/* Rim light - tạo viền sáng */}
        <directionalLight position={[0, 2, -5]} intensity={1.5} />

        <VRMModel url={vrmUrl} animationUrl={animationUrl} />
      </Canvas>

      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-black/70 backdrop-blur px-6 py-3 rounded-full text-white text-center">
          <p className="text-sm mb-1">🎵 VRM Animation</p>
          {animationUrl ? (
            animLoaded ? (
              <p className="text-xs text-green-400">✅ VRMA Loaded</p>
            ) : (
              <p className="text-xs text-yellow-400">⏳ Loading VRMA...</p>
            )
          ) : (
            <p className="text-xs text-gray-400">No Animation</p>
          )}
        </div>
      </div> */}

      {/* Debug info */}
      {/* <div className="absolute top-4 left-4 bg-black/70 text-white text-xs p-3 rounded">
        <p className="font-bold mb-2">Debug Info:</p>
        <p>VRM: {vrmUrl.split('/').pop()}</p>
        {animationUrl && (
          <p>VRMA: {animationUrl.split('/').pop()}</p>
        )}
        <p className="mt-2 text-gray-400">Check console for details</p>
      </div> */}
    </div>
  );
}
