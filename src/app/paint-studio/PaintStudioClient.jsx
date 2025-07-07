"use client";

import { useSearchParams } from "next/navigation";
import { FiSun, FiMoon, FiLayers, FiDroplet, FiHome, FiRotateCw, FiRefreshCw } from 'react-icons/fi';
import { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced paint colors for the studio
const paintColors = [
  { name: "Morning Glory", hex: "#D4E4F7", category: "Blues", rgb: [0.83, 0.89, 0.97] },
  { name: "Sunset Orange", hex: "#FF8C42", category: "Oranges", rgb: [1.0, 0.55, 0.26] },
  { name: "Forest Green", hex: "#228B22", category: "Greens", rgb: [0.13, 0.54, 0.13] },
  { name: "Ivory White", hex: "#FFFFF0", category: "Whites", rgb: [1.0, 1.0, 0.94] },
  { name: "Charcoal Grey", hex: "#36454F", category: "Greys", rgb: [0.21, 0.27, 0.31] },
  { name: "Coral Blush", hex: "#FF7F7F", category: "Pinks", rgb: [1.0, 0.5, 0.5] },
  { name: "Deep Navy", hex: "#1B263B", category: "Blues", rgb: [0.11, 0.15, 0.23] },
  { name: "Sage Green", hex: "#87A96B", category: "Greens", rgb: [0.53, 0.66, 0.42] },
  { name: "Warm Beige", hex: "#F5E6D3", category: "Beiges", rgb: [0.96, 0.9, 0.83] },
  { name: "Terracotta", hex: "#CC8B65", category: "Oranges", rgb: [0.8, 0.55, 0.4] }
];

// Color combination suggestions
const colorCombinations = {
  interior: [
    {
      name: "Modern Minimalist",
      primary: "Ivory White",
      accent: "Charcoal Grey",
      description: "Clean and sophisticated",
      mood: "Professional"
    },
    {
      name: "Warm Cozy",
      primary: "Warm Beige",
      accent: "Terracotta",
      description: "Inviting and comfortable",
      mood: "Relaxing"
    },
    {
      name: "Nature Inspired",
      primary: "Sage Green",
      accent: "Ivory White",
      description: "Fresh and calming",
      mood: "Peaceful"
    },
    {
      name: "Bold Contemporary",
      primary: "Deep Navy",
      accent: "Morning Glory",
      description: "Dramatic and stylish",
      mood: "Sophisticated"
    }
  ],
  exterior: [
    {
      name: "Classic Elegance",
      primary: "Ivory White",
      accent: "Charcoal Grey",
      description: "Timeless curb appeal",
      mood: "Traditional"
    },
    {
      name: "Modern Farmhouse",
      primary: "Warm Beige",
      accent: "Forest Green",
      description: "Rustic charm meets modern",
      mood: "Welcoming"
    },
    {
      name: "Bold Statement",
      primary: "Deep Navy",
      accent: "Ivory White",
      description: "Striking and memorable",
      mood: "Confident"
    },
    {
      name: "Earth Tones",
      primary: "Terracotta",
      accent: "Sage Green",
      description: "Natural and grounded",
      mood: "Harmonious"
    }
  ]
};

// 3D Interior Room Component
function EnhancedInteriorRoom({ wallColor, isDay }) {
  const meshRefs = {
    front: useRef(),
    back: useRef(),
    left: useRef(),
    right: useRef(),
    ceiling: useRef(),
    floor: useRef()
  };

  const lightIntensity = isDay ? 1.2 : 0.6;
  const ambientIntensity = isDay ? 0.8 : 0.3;
  
  const handleWallClick = (wallName) => {
    setSelectedWall(wallName);
  };

  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={ambientIntensity} color={isDay ? "#ffffff" : "#4169E1"} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={lightIntensity} 
        color={isDay ? "#ffffff" : "#87CEEB"}
        castShadow
      />
      <pointLight 
        position={[0, 4, 0]} 
        intensity={isDay ? 0.5 : 1} 
        color={isDay ? "#ffffff" : "#FFD700"}
      />

      {/* Room Walls */}
      {/* Front Wall */}
      <Plane 
        ref={meshRefs.front}
        args={[8, 6]} 
        position={[0, 0, -4]}
        onClick={() => handleWallClick('front')}
      >
        <meshLambertMaterial 
          color={selectedWall === 'front' ? wallColor : '#f0f0f0'} 
          transparent
          opacity={0.9}
        />
      </Plane>
      
      {/* Back Wall */}
      <Plane 
        ref={meshRefs.back}
        args={[8, 6]} 
        position={[0, 0, 4]} 
        rotation={[0, Math.PI, 0]}
        onClick={() => handleWallClick('back')}
      >
        <meshLambertMaterial 
          color={selectedWall === 'back' ? wallColor : '#f0f0f0'} 
          transparent
          opacity={0.9}
        />
      </Plane>
      
      {/* Left Wall */}
      <Plane 
        ref={meshRefs.left}
        args={[8, 6]} 
        position={[-4, 0, 0]} 
        rotation={[0, Math.PI/2, 0]}
        onClick={() => handleWallClick('left')}
      >
        <meshLambertMaterial 
          color={selectedWall === 'left' ? wallColor : '#f0f0f0'} 
          transparent
          opacity={0.9}
        />
      </Plane>
      
      {/* Right Wall */}
      <Plane 
        ref={meshRefs.right}
        args={[8, 6]} 
        position={[4, 0, 0]} 
        rotation={[0, -Math.PI/2, 0]}
        onClick={() => handleWallClick('right')}
      >
        <meshLambertMaterial 
          color={selectedWall === 'right' ? wallColor : '#f0f0f0'} 
          transparent
          opacity={0.9}
        />
      </Plane>
      
      {/* Floor */}
      <Plane 
        ref={meshRefs.floor}
        args={[8, 8]} 
        position={[0, -3, 0]} 
        rotation={[-Math.PI/2, 0, 0]}
      >
        <meshLambertMaterial color="#8B7355" />
      </Plane>
      
      {/* Ceiling */}
      <Plane 
        ref={meshRefs.ceiling}
        args={[8, 8]} 
        position={[0, 3, 0]} 
        rotation={[Math.PI/2, 0, 0]}
      >
        <meshLambertMaterial color="#ffffff" />
      </Plane>

      {/* Furniture for context */}
      <Box position={[-2, -2, 2]} args={[1.5, 1, 0.5]}>
        <meshLambertMaterial color="#8B4513" />
      </Box>
      <Box position={[2, -2.5, -2]} args={[1, 0.5, 1]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      
      {/* Wall selection indicator */}
      {selectedWall && (
        <Text
          position={[0, 4, 0]}
          fontSize={0.5}
          color="#333333"
          anchorX="center"
          anchorY="middle"
        >
          {selectedWall.charAt(0).toUpperCase() + selectedWall.slice(1)} Wall Selected
        </Text>
      )}
    </group>
  );
}

// 3D Exterior House Component
function EnhancedExteriorHouse({ wallColor, roofColor, isDay }) {
  const lightIntensity = isDay ? 1.5 : 0.4;
  const ambientIntensity = isDay ? 1.0 : 0.2;
  
  return (
    <group>
      {/* Lighting */}
      <ambientLight intensity={ambientIntensity} color={isDay ? "#ffffff" : "#191970"} />
      <directionalLight 
        position={[10, 15, 10]} 
        intensity={lightIntensity} 
        color={isDay ? "#ffffff" : "#4169E1"}
        castShadow
      />
      <directionalLight 
        position={[-5, 10, 5]} 
        intensity={isDay ? 0.3 : 0.8} 
        color={isDay ? "#ffffff" : "#FFD700"}
      />

      {/* House Base */}
      <Box position={[0, 0, 0]} args={[6, 4, 5]}>
        <meshLambertMaterial color={wallColor} />
      </Box>
      
      {/* Roof */}
      <Box position={[0, 3, 0]} args={[7, 1, 6]} rotation={[0, 0, 0]}>
        <meshLambertMaterial color={roofColor || '#8B4513'} />
      </Box>
      
      {/* Door */}
      <Box position={[0, -1, 2.6]} args={[1, 2, 0.2]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      
      {/* Windows */}
      <Box position={[-1.5, 0.5, 2.6]} args={[1, 1, 0.1]}>
        <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
      </Box>
      <Box position={[1.5, 0.5, 2.6]} args={[1, 1, 0.1]}>
        <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
      </Box>
      
      {/* Side Windows */}
      <Box position={[3.1, 0.5, 0]} args={[0.1, 1, 1]}>
        <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
      </Box>
      <Box position={[-3.1, 0.5, 0]} args={[0.1, 1, 1]}>
        <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
      </Box>
      
      {/* Chimney */}
      <Box position={[2, 4.5, -1]} args={[0.8, 2, 0.8]}>
        <meshLambertMaterial color="#8B4513" />
      </Box>
      
      {/* Ground */}
      <Plane 
        args={[20, 20]} 
        position={[0, -2.5, 0]} 
        rotation={[-Math.PI/2, 0, 0]}
      >
        <meshLambertMaterial color="#228B22" />
      </Plane>
      
      {/* Trees for context */}
      <Box position={[-8, 0, -3]} args={[0.5, 4, 0.5]}>
        <meshLambertMaterial color="#8B4513" />
      </Box>
      <Box position={[-8, 2.5, -3]} args={[2, 2, 2]}>
        <meshLambertMaterial color="#228B22" />
      </Box>
      
      <Box position={[8, 0, 2]} args={[0.5, 3, 0.5]}>
        <meshLambertMaterial color="#8B4513" />
      </Box>
      <Box position={[8, 2, 2]} args={[1.5, 1.5, 1.5]}>
        <meshLambertMaterial color="#228B22" />
      </Box>
      
      {/* Street light for night mode */}
      {!isDay && (
        <group position={[6, 0, 6]}>
          <Box args={[0.1, 5, 0.1]}>
            <meshLambertMaterial color="#333333" />
          </Box>
          <pointLight position={[0, 4, 0]} intensity={2} color="#FFD700" distance={15} />
        </group>
      )}
    </group>
  );
}

export default function PaintStudioClient() {
  const params = useSearchParams();
  const initialMode = params.get("mode") || "interior";
  
  const [isDay, setIsDay] = useState(true);
  const [finish, setFinish] = useState('Matte');
  const [selectedColor, setSelectedColor] = useState(paintColors[0]);
  const [roomType, setRoomType] = useState('living-room');
  const [viewMode, setViewMode] = useState(initialMode); // 'interior' or 'exterior'
  const [selectedWall, setSelectedWall] = useState('front');
  const [autoRotate, setAutoRotate] = useState(false);
  const [selectedCombination, setSelectedCombination] = useState(null);

  // Get RGB color for Three.js
  const getRGBColor = (colorName) => {
    const color = paintColors.find(c => c.name === colorName);
    return color ? color.rgb : [0.8, 0.8, 0.8];
  };

  // Apply color combination
  const applyCombination = (combination) => {
    const primaryColor = paintColors.find(c => c.name === combination.primary);
    if (primaryColor) {
      setSelectedColor(primaryColor);
      setSelectedCombination(combination);
    }
  };

  // Get current color combinations
  const currentCombinations = colorCombinations[viewMode];

  // Get lighting-adjusted color
  const getLightingAdjustedColor = (hex) => {
    if (!isDay) {
      // Darken color for night mode
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      
      const darkR = Math.floor(r * 0.6);
      const darkG = Math.floor(g * 0.6);
      const darkB = Math.floor(b * 0.6);
      
      return `rgb(${darkR}, ${darkG}, ${darkB})`;
    }
    return hex;
  };

  // Get finish effect (opacity/shine simulation)
  const getFinishStyle = () => {
    switch (finish) {
      case 'Glossy':
        return {
          background: `linear-gradient(135deg, ${getLightingAdjustedColor(selectedColor.hex)} 0%, rgba(255,255,255,0.3) 50%, ${getLightingAdjustedColor(selectedColor.hex)} 100%)`,
          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3)'
        };
      case 'Silk':
        return {
          background: `linear-gradient(135deg, ${getLightingAdjustedColor(selectedColor.hex)} 0%, rgba(255,255,255,0.1) 50%, ${getLightingAdjustedColor(selectedColor.hex)} 100%)`,
          boxShadow: 'inset 0 0 10px rgba(255,255,255,0.1)'
        };
      case 'Satin':
        return {
          backgroundColor: getLightingAdjustedColor(selectedColor.hex),
          boxShadow: 'inset 0 0 15px rgba(255,255,255,0.15)'
        };
      default: // Matte
        return {
          backgroundColor: getLightingAdjustedColor(selectedColor.hex)
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🖼️ {viewMode === "exterior" ? "Exterior Paint Studio" : "Interior Paint Studio"}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {viewMode === "exterior" 
              ? "Visualize exterior house colors with realistic environmental lighting"
              : "Experience interior shades and textures in a realistic 3D room"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* View Mode Toggle */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">View Mode</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('interior')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    viewMode === 'interior'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🏠 Interior
                </button>
                <button
                  onClick={() => setViewMode('exterior')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                    viewMode === 'exterior'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🏡 Exterior
                </button>
              </div>
            </div>

            {/* Color Selection */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiDroplet className="text-blue-600" />
                Choose Color
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {paintColors.map((color) => (
                  <motion.button
                    key={color.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(color)}
                    className={`aspect-square rounded-lg border-2 transition-all ${
                      selectedColor.name === color.name
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{selectedColor.name}</p>
                <p className="text-xs text-gray-500">{selectedColor.hex}</p>
                <p className="text-xs text-gray-500">{selectedColor.category}</p>
              </div>
            </div>

            {/* Color Combination Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Color Combinations</h3>
              <div className="space-y-3">
                {currentCombinations.map((combination, index) => (
                  <motion.div 
                    key={combination.name}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedCombination?.name === combination.name
                        ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => applyCombination(combination)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{combination.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Primary: {combination.primary} • Accent: {combination.accent}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                          {combination.description}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {combination.mood}
                        </span>
                      </div>
                      <FiRefreshCw className="text-blue-500 ml-2" size={16} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Finish Selection */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiLayers className="text-green-600" />
                Paint Finish
              </h3>
              <div className="space-y-2">
                {['Matte', 'Silk', 'Satin', 'Glossy'].map((finishOption) => (
                  <button
                    key={finishOption}
                    onClick={() => setFinish(finishOption)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      finish === finishOption
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{finishOption}</div>
                    <div className="text-xs text-gray-500">
                      {finishOption === 'Matte' && 'Non-reflective, elegant finish'}
                      {finishOption === 'Silk' && 'Subtle sheen, easy to clean'}
                      {finishOption === 'Satin' && 'Smooth finish with slight gloss'}
                      {finishOption === 'Glossy' && 'High shine, durable finish'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting Control */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lighting</h3>
              <button
                onClick={() => setIsDay(!isDay)}
                className={`w-full flex items-center justify-center gap-3 p-4 rounded-lg transition-all ${
                  isDay 
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                }`}
              >
                {isDay ? <FiSun size={20} /> : <FiMoon size={20} />}
                <span className="font-medium">
                  {isDay ? 'Daylight' : 'Evening'} Mode
                </span>
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                See how colors change with different lighting
              </p>
            </div>

            {/* Additional Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">3D Controls</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                    autoRotate
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FiRotateCw size={16} />
                  {autoRotate ? 'Stop Auto Rotate' : 'Auto Rotate'}
                </button>
                {viewMode === 'interior' && (
                  <div className="text-sm text-gray-600">
                    💡 Tip: Click on walls to select and paint them individually
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Preview: {selectedColor.name} - {finish} Finish
                </h3>
                <p className="text-sm text-gray-600">
                  {isDay ? 'Daylight' : 'Evening'} lighting • {viewMode === 'interior' ? 'Indoor Environment' : 'Outdoor Environment'}
                </p>
              </div>
              
              {/* 3D Model Preview */}
              <div className="relative h-96">
                <Canvas 
                  camera={{ position: viewMode === 'interior' ? [0, 2, 8] : [8, 6, 12], fov: 60 }}
                  className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-50"
                >
                  <Suspense fallback={null}>
                    <OrbitControls 
                      enablePan={true} 
                      enableZoom={true} 
                      enableRotate={true} 
                      autoRotate={autoRotate} 
                      autoRotateSpeed={2}
                      maxPolarAngle={Math.PI / 1.8}
                      minDistance={viewMode === 'interior' ? 5 : 8}
                      maxDistance={viewMode === 'interior' ? 15 : 25}
                    />
                    {viewMode === "interior" ? (
                      <InteriorRoom 
                        wallColor={selectedColor.rgb}  
                        isDay={isDay} 
                        selectedWall={selectedWall} 
                        setSelectedWall={setSelectedWall}
                      />
                    ) : (
                      <ExteriorHouse 
                        wallColor={selectedColor.rgb} 
                        roofColor={getRGBColor('Terracotta')} 
                        isDay={isDay} 
                      />
                    )}
                  </Suspense>
                </Canvas>
                
                {/* Controls overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`p-2 rounded-lg transition-all ${
                      autoRotate 
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                    title="Toggle auto rotate"
                  >
                    <FiRotateCw size={16} />
                  </button>
                </div>
                
                {/* Info overlay */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border border-white/30"
                      style={{ backgroundColor: selectedColor.hex }}
                    ></div>
                    <span>{selectedColor.name} • {finish} • {isDay ? 'Day' : 'Night'}</span>
                  </div>
                </div>
                
                {/* Wall selection indicator for interior */}
                {viewMode === 'interior' && selectedWall && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm">
                    {selectedWall.charAt(0).toUpperCase() + selectedWall.slice(1)} Wall Selected
                  </div>
                )}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 AI Color Suggestions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Complementary Colors</h4>
                  <p className="text-sm text-blue-700">
                    Based on color theory, consider pairing with warm oranges or soft yellows for accent walls.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Room Harmony</h4>
                  <p className="text-sm text-green-700">
                    This color works beautifully in {roomType.replace('-', ' ')}s and pairs well with natural wood furniture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📷</div>
              <h4 className="font-semibold text-gray-900 mb-1">Upload Your Room</h4>
              <p className="text-sm text-gray-600">Take a photo and see how colors look in your actual space</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-1">AR Visualization</h4>
              <p className="text-sm text-gray-600">Use augmented reality to preview colors on your walls</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💡</div>
              <h4 className="font-semibold text-gray-900 mb-1">Smart Recommendations</h4>
              <p className="text-sm text-gray-600">AI-powered color matching based on your style preferences</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
