"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

function House() {
  const { scene } = useGLTF("/models/house.glb");
  return <primitive object={scene} scale={0.4} position={[0, -2, 0]} />;
}

export default function HouseModel() {
  return (
    <div className="w-full h-96 bg-transparent rounded-lg  ">
      <Canvas camera={{ position: [-3, 2, 8], fov: 100 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <House />
          <Environment preset="sunset" />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate  />
      </Canvas>
    </div>
  );
}
