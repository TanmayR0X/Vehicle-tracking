import { FaCar, FaFlagCheckered, FaMapMarkerAlt } from "react-icons/fa";

import { MdSpeed , MdClose } from "react-icons/md";
import { useState, useEffect } from "react";

export default function InfoPanel({
  visible,
  onClose,
  speed,
  start,
  end,
  startName,
  endName,
  distanceLeft,
  totalDistance,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Determine status and background color based on speed
  const status = speed > 0 ? "RUNNING" : "STOPPED";
  const statusColor = speed > 0 ? "#4caf50" : "#1f71c4";

  return (
    <div
      className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white bg-opacity-90 text-black p-3 rounded-xl shadow-lg w-80 z-[2000] font-sans"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-3 top-1 bg-transparent border-none text-2xl text-[#868686] cursor-pointer"
      >
        <MdClose/>
      </button>

      {/* Header and Date/Time */}
      <div
        className="flex items-center justify-between mb-2 mt-5"
      >
        <div className="flex items-center gap-2.5">
          <FaCar className="text-[#1f71c4]" size={24} />
          <strong className="text-lg">WIRELESS</strong>
        </div>
        <div
          className="bg-[#4caf50] text-white px-2 py-1 rounded-md text-xs"
        >
          {`${formattedDate}, ${formattedTime}`}
        </div>
      </div>

      <div
        className="flex items-center gap-2 text-sm text-[#777] mb-4"
      >
        <FaMapMarkerAlt />
        <span>A/23/28, Vijay Nagar Rd, Vijay Naga</span>
      </div>

      {/* Main Stats Grid */}
      <div
        className="grid grid-cols-3 gap-2.5 text-center mb-2.5"
      >
        {/* Speed */}
        <div className="p-2 border border-[#eee] rounded-lg">
          <div className="text-xl font-bold">
            {speed.toFixed(1)} km/h
          </div>
          <div className="text-xs text-[#777]">Speed</div>
        </div>

        {/* Distance from last stop */}
        <div className="p-2 border border-[#eee] rounded-lg">
          <div className="text-xl font-bold">
            {distanceLeft.toFixed(2)} km
          </div>
          <div className="text-xs text-[#777]">Distance</div>
        </div>
        
        {/* Battery */}
        <div className="p-2 border border-[#eee] rounded-lg">
          <div className="text-xl font-bold">15%</div>
          <div className="text-xs text-[#777]">Battery</div>
        </div>
      </div>

      <div
        className="grid grid-cols-3 gap-2.5 text-center mb-4"
      >
        {/* Total Distance */}
        <div className="p-2 border border-[#eee] rounded-lg">
          <div className="text-base font-bold">
            {totalDistance.toFixed(2)} km
          </div>
          <div className="text-xs text-[#777]">Total Distance</div>
        </div>

        {/* Distance from last stop */}
        <div className="p-2 border border-[#eee] rounded-lg">
          <div className="text-base font-bold">
            0.00 km
          </div>
          <div className="text-xs text-[#777]">Distance from Last Stop</div>
        </div>

        {/* Placeholder - you can replace with real data if you have it */}
        <div className="p-2 border border-[#eee] rounded-lg">
          <div className="text-base font-bold">
            00h:00m
          </div>
          <div className="text-xs text-[#777]">Today Idle</div>
        </div>
      </div>

      <hr className="border-none border-t border-[#eee] my-2.5" />
      
      {/* Status section (using a grid) */}
      <div className="flex items-center justify-between mb-4">
        <div className="bg-[${statusColor}] text-white px-3 py-1 rounded-lg text-sm font-bold" style={{ backgroundColor: statusColor }}>
            {status}
        </div>
        <div className="text-sm text-[#555] text-right">
            0.00 km/h<br />
            <span className="text-xs">Today Max Speed</span>
        </div>
        <div className="text-sm text-[#555] text-right">
            00h:00m<br />
            <span className="text-xs">Today Running</span>
        </div>
      </div>
      
      {/* Ignition and AC info section (you may not have this data) */}
      <div className="flex justify-around items-center mb-4 flex-wrap text-center">
        <div className="text-center">
            <div className="text-sm font-bold">00h:00m</div>
            <div className="text-xs text-[#777]">Today Ignition On</div>
        </div>
        <div className="text-center">
            <div className="text-sm font-bold">00h:00m</div>
            <div className="text-xs text-[#777]">Today AC On</div>
        </div>
        <div className="text-center">
            <div className="text-sm font-bold">00h:00m</div>
            <div className="text-xs text-[#777]">Ignition On since</div>
        </div>
      </div>

      <hr className="border-none border-t border-[#eee] my-2.5" />

      {/* Placeholder for control buttons */}
      <div className="flex justify-around mt-4">
        <button className="bg-[#ddd] border-none rounded-full w-10 h-10 flex items-center justify-center"><FaCar size={22} color="#555" /></button>
        <button className="bg-[#ddd] border-none rounded-full w-10 h-10 flex items-center justify-center"><FaMapMarkerAlt size={22} color="#555" /></button>
        <button className="bg-[#ddd] border-none rounded-full w-10 h-10 flex items-center justify-center"><MdSpeed size={22} color="#555" /></button>
        <button className="bg-[#ddd] border-none rounded-full w-10 h-10 flex items-center justify-center"><FaFlagCheckered size={22} color="#555" /></button>
      </div>
    </div>
  );
}