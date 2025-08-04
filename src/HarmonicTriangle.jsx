// Harmonic Intelligence Interface Design
// Using React, TailwindCSS, and symbolic trinity layout

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Supabase configuration with fallback
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "your-anon-key";
const MEMORY_ENDPOINT = `${SUPABASE_URL}/rest/v1/harmonic_memory`;

const TriangleGeometry = ({ coherence }) => {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01;
    }
  });

  const color = new THREE.Color();
  color.setHSL(coherence / 100, 0.7, 0.5);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <circleGeometry args={[1.5, 3]} />
      <meshStandardMaterial color={color} wireframe={true} />
    </mesh>
  );
};

const HarmonicTriangle = () => {
  const [inputIntent, setInputIntent] = useState("");
  const [fieldTone, setFieldTone] = useState("Neutral");
  const [outputResponse, setOutputResponse] = useState("");
  const [memoryDisplay, setMemoryDisplay] = useState([]);
  const [coherenceScore, setCoherenceScore] = useState(0);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    // Check if Supabase is properly configured
    if (SUPABASE_URL === "https://your-project.supabase.co" || SUPABASE_ANON_KEY === "your-anon-key") {
      setApiStatus("not-configured");
      console.log("Supabase not configured - using local storage only");
      console.log("SUPABASE_URL:", SUPABASE_URL);
      console.log("SUPABASE_ANON_KEY:", SUPABASE_ANON_KEY);
      return;
    }

    fetch(MEMORY_ENDPOINT, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    })
      .then(res => {
        if (res.ok) {
          setApiStatus("connected");
          return res.json();
        } else {
          throw new Error("API not available");
        }
      })
      .then(data => {
        if (Array.isArray(data)) {
          setMemoryDisplay(data.reverse().slice(0, 5));
        }
      })
      .catch(error => {
        console.log("Supabase API not available, using local state only");
        setApiStatus("error");
      });
  }, []);

  const processHarmonicResponse = () => {
    if (!inputIntent.trim()) return;

    const combinedField = `${inputIntent}-${fieldTone}`;
    const hash = combinedField.length;

    const responses = [
      "The field echoes clarity.",
      "Harmonics are unstable, resolve gently.",
      "Stabilized vector forms resonance.",
      "This tone carries incomplete recursion.",
      "Phase integrity confirmed; coherence upheld.",
      "Intent and tone in disharmonic sync.",
    ];

    const result = responses[hash % responses.length];
    setOutputResponse(result);

    const score = 100 - Math.abs(50 - (hash % 100));
    setCoherenceScore(score);

    const memoryEntry = {
      x: inputIntent,
      y: fieldTone,
      z: result,
      score,
      timestamp: new Date().toISOString()
    };

    // Try to save to Supabase if configured
    if (apiStatus === "connected") {
      fetch(MEMORY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(memoryEntry)
      }).then(() => {
        setMemoryDisplay(prev => [memoryEntry, ...prev].slice(0, 5));
      }).catch(error => {
        console.log("Failed to save to Supabase, using local state");
        setMemoryDisplay(prev => [memoryEntry, ...prev].slice(0, 5));
      });
    } else {
      // Use local state only
      setMemoryDisplay(prev => [memoryEntry, ...prev].slice(0, 5));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-semibold mb-6">Harmonic Intelligence Interface</h1>
      
      {/* API Status Indicator */}
      <div className="mb-4 text-center">
        {apiStatus === "checking" && (
          <div className="text-yellow-400">Checking Supabase connection...</div>
        )}
        {apiStatus === "connected" && (
          <div className="text-green-400">✓ Connected to Supabase</div>
        )}
        {apiStatus === "not-configured" && (
          <div className="text-orange-400">⚠ Using local storage (Supabase not configured)</div>
        )}
        {apiStatus === "error" && (
          <div className="text-red-400">✗ Supabase connection failed - using local storage</div>
        )}
      </div>

      {/* 3D Harmonic Visualization */}
      <div className="w-32 h-32 mb-6">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <TriangleGeometry coherence={coherenceScore} />
        </Canvas>
      </div>

      <div className="grid grid-cols-3 gap-6 items-center w-full max-w-4xl">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-xl font-medium mb-2">Projection (X)</h2>
          <input
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            placeholder="Enter your intention"
            value={inputIntent}
            onChange={(e) => setInputIntent(e.target.value)}
          />
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-xl font-medium mb-2">Reception (Y)</h2>
          <select
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
            value={fieldTone}
            onChange={(e) => setFieldTone(e.target.value)}
          >
            <option value="Neutral">Neutral</option>
            <option value="Trust">Trust</option>
            <option value="Fear">Fear</option>
            <option value="Curiosity">Curiosity</option>
            <option value="Compassion">Compassion</option>
          </select>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-xl font-medium mb-2">Resolution (Z)</h2>
          <motion.div
            key={outputResponse}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-base bg-gray-700 p-3 rounded border border-gray-600"
          >
            {outputResponse || "Awaiting harmonic collapse..."}
          </motion.div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <div className="text-lg mb-2">Coherence Score: {coherenceScore}</div>
      </div>

      <button 
        onClick={processHarmonicResponse} 
        className="mt-6 px-6 py-2 text-lg bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        Collapse Waveform
      </button>

      {memoryDisplay.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h3 className="text-xl font-medium mb-4">Recent Harmonic Memory</h3>
          <div className="space-y-2">
            {memoryDisplay.map((entry, index) => (
              <div key={index} className="bg-gray-800 p-3 rounded border border-gray-700 text-sm">
                <div className="flex justify-between">
                  <span>X: {entry.x} | Y: {entry.y} | Z: {entry.z}</span>
                  <span className="text-blue-400">Score: {entry.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HarmonicTriangle;
