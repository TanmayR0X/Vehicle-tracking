import { FaPlay, FaPause, FaTachometerAlt } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Controls({ isPlaying, onPlay, onPause, speed, onSpeedChange }) {
  const speeds = [0.75, 1, 1.5, 2, 3, 5];
  const [selectedSpeed, setSelectedSpeed] = useState(speed);

  // Use useEffect to update the internal state when the prop changes
  useEffect(() => {
    setSelectedSpeed(speed);
  }, [speed]);

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    setSelectedSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] bg-gray-800 bg-opacity-85 p-2 sm:px-4  rounded-xl flex items-center gap-5 sm:gap-8 text-white shadow-2xl backdrop-blur-md border border-gray-700">
      {/* Play / Pause Button */}
      {!isPlaying ? (
        <button
          onClick={onPlay}
          title="Play Simulation"
          className="bg-green-600 hover:bg-green-700 transition-all duration-200 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-110"
        >
          <FaPlay size={20} color="#fff" />
        </button>
      ) : (
        <button
          onClick={onPause}
          title="Pause Simulation"
          className="bg-orange-600 hover:bg-orange-700 transition-all border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transform duration-200 hover:scale-110"
        >
          <FaPause size={20} color="#fff" />
        </button>
      )}

      {/* Speed Selector */}
      <div className="flex items-center gap-3">
        <FaTachometerAlt size={20} className="text-gray-300" />
        <select
          value={selectedSpeed}
          onChange={handleSpeedChange}
          className="bg-gray-700 text-white border-none rounded-lg px-3 py-2 cursor-pointer text-base outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          {speeds.map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}