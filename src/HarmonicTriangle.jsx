// Harmonic Intelligence Interface Design with Shared Resonance Field

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || "your-anon-key";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  const [activeUsers, setActiveUsers] = useState(0);
  const [debugInfo, setDebugInfo] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    // Check if Supabase is properly configured
    if (SUPABASE_URL === "https://your-project.supabase.co" || SUPABASE_ANON_KEY === "your-anon-key") {
      setApiStatus("not-configured");
      setDebugInfo("Supabase not configured - using local storage only");
      addErrorMessage("⚠️ Supabase not configured - using local storage only");
      return;
    }

    fetchMemory();
    setupRealtimeSubscription();
    setupPresenceChannel();

    return () => {
      // Cleanup subscriptions
      supabase.removeAllChannels();
    };
  }, []);

  const addErrorMessage = (message) => {
    setErrorMessages(prev => [...prev, { id: Date.now(), message, timestamp: new Date() }]);
    // Auto-remove messages after 10 seconds
    setTimeout(() => {
      setErrorMessages(prev => prev.filter(msg => msg.id !== Date.now()));
    }, 10000);
  };

  const fetchMemory = async () => {
    try {
      setDebugInfo("Fetching memory from database...");
      const { data, error } = await supabase
        .from("harmonic_memory")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Database error:", error);
        setDebugInfo(`Database error: ${error.message}`);
        addErrorMessage(`❌ Database error: ${error.message}`);
        throw error;
      }
      
      if (data) {
        setMemoryDisplay(data);
        setApiStatus("connected");
        setDebugInfo(`Loaded ${data.length} entries from database`);
      }
    } catch (error) {
      console.log("Supabase API not available, using local state only");
      setApiStatus("error");
      setDebugInfo(`Connection failed: ${error.message}`);
      addErrorMessage(`❌ Connection failed: ${error.message}`);
    }
  };

  const setupRealtimeSubscription = () => {
    try {
      setDebugInfo("Setting up real-time subscription...");
      const channel = supabase
        .channel("harmonic-feed")
        .on(
          "postgres_changes",
          { 
            event: "INSERT", 
            schema: "public", 
            table: "harmonic_memory" 
          },
          (payload) => {
            console.log("Real-time update received:", payload);
            const newEntry = payload.new;
            setMemoryDisplay(prev => [newEntry, ...prev.slice(0, 4)]);
            setDebugInfo("Real-time update: New entry received");
            
            // Animate the triangle when new data arrives
            setCoherenceScore(prev => {
              const newScore = newEntry.score;
              setTimeout(() => setCoherenceScore(newScore), 100);
              return prev;
            });
          }
        )
        .on(
          "postgres_changes",
          { 
            event: "DELETE", 
            schema: "public", 
            table: "harmonic_memory" 
          },
          () => {
            fetchMemory(); // Refresh the list
            setDebugInfo("Real-time update: Entry deleted");
          }
        )
        .subscribe((status) => {
          console.log("Subscription status:", status);
          if (status === "SUBSCRIBED") {
            setDebugInfo("Real-time subscription active");
            addErrorMessage("✅ Real-time subscription active");
          } else if (status === "CHANNEL_ERROR") {
            setDebugInfo("Real-time subscription failed - using polling");
            addErrorMessage("⚠️ Real-time subscription failed - using polling");
          } else if (status === "TIMED_OUT") {
            setDebugInfo("Real-time subscription timed out");
            addErrorMessage("⏰ Real-time subscription timed out");
          } else if (status === "CLOSED") {
            setDebugInfo("Real-time subscription closed");
            addErrorMessage("🔌 Real-time subscription closed");
          }
        });
    } catch (error) {
      console.error("Real-time setup error:", error);
      setDebugInfo(`Real-time setup failed: ${error.message}`);
      addErrorMessage(`❌ Real-time setup failed: ${error.message}`);
    }
  };

  const setupPresenceChannel = () => {
    try {
      const presenceChannel = supabase.channel("harmonic-presence");
      
      presenceChannel
        .on("presence", { event: "sync" }, () => {
          const state = presenceChannel.presenceState();
          const userCount = Object.keys(state).length;
          setActiveUsers(userCount);
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          setActiveUsers(prev => prev + 1);
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          setActiveUsers(prev => Math.max(0, prev - 1));
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await presenceChannel.track({ 
              user_id: `user_${Date.now()}`,
              online_at: new Date().toISOString()
            });
          }
        });
    } catch (error) {
      console.error("Presence setup error:", error);
      addErrorMessage(`❌ Presence setup error: ${error.message}`);
    }
  };

  const processHarmonicResponse = async () => {
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

    const entry = {
      x: inputIntent,
      y: fieldTone,
      z: result,
      score,
      timestamp: new Date().toISOString(),
      user_id: `user_${Date.now()}`,
    };

    // Try to save to Supabase if configured
    if (apiStatus === "connected") {
      try {
        setDebugInfo("Saving to database...");
        const { error } = await supabase
          .from("harmonic_memory")
          .insert([entry]);

        if (error) {
          console.error("Insert error:", error);
          setDebugInfo(`Save failed: ${error.message}`);
          addErrorMessage(`❌ Save failed: ${error.message}`);
          throw error;
        }
        
        setDebugInfo("Successfully saved to database");
        addErrorMessage("✅ Successfully saved to database");
        // The real-time subscription will handle updating the display
      } catch (error) {
        console.log("Failed to save to Supabase, using local state");
        setDebugInfo(`Save failed: ${error.message}`);
        addErrorMessage(`❌ Save failed: ${error.message}`);
        setMemoryDisplay(prev => [entry, ...prev.slice(0, 4)]);
      }
    } else {
      // Use local state only
      setMemoryDisplay(prev => [entry, ...prev.slice(0, 4)]);
      setDebugInfo("Saved to local state only");
      addErrorMessage("💾 Saved to local state only");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-semibold mb-6">Harmonic Intelligence Interface</h1>
      
      {/* Error Messages Display */}
      {errorMessages.length > 0 && (
        <div className="mb-4 w-full max-w-2xl mx-auto">
          <div className="space-y-2">
            {errorMessages.map((error) => (
              <motion.div
                key={error.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-sm"
              >
                <div className="flex justify-between items-start">
                  <span className="text-gray-300">{error.message}</span>
                  <span className="text-gray-500 text-xs ml-2">
                    {error.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* API Status and Debug Info */}
      <div className="mb-4 text-center space-y-2">
        {apiStatus === "checking" && (
          <div className="text-yellow-400">Checking Supabase connection...</div>
        )}
        {apiStatus === "connected" && (
          <div className="text-green-400">✓ Connected to Shared Resonance Field</div>
        )}
        {apiStatus === "not-configured" && (
          <div className="text-orange-400">⚠ Using local storage (Supabase not configured)</div>
        )}
        {apiStatus === "error" && (
          <div className="text-red-400">✗ Supabase connection failed - using local storage</div>
        )}
        
        {debugInfo && (
          <div className="text-gray-400 text-xs max-w-md mx-auto">
            Debug: {debugInfo}
          </div>
        )}
        
        {apiStatus === "connected" && activeUsers > 0 && (
          <div className="text-blue-400 text-sm">
            🌍 {activeUsers} user{activeUsers !== 1 ? 's' : ''} connected to the resonance field
          </div>
        )}
      </div>

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
          <h3 className="text-xl font-medium mb-4">Shared Harmonic Memory</h3>
          <div className="space-y-2">
            {memoryDisplay.map((entry, index) => (
              <motion.div 
                key={entry.id || index} 
                className="bg-gray-800 p-3 rounded border border-gray-700 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex justify-between">
                  <span>X: {entry.x} | Y: {entry.y} | Z: {entry.z}</span>
                  <span className="text-blue-400">Score: {entry.score}</span>
                </div>
                {entry.timestamp && (
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HarmonicTriangle;
