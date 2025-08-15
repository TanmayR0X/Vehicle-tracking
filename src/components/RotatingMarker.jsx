import { useEffect } from "react";
import { Marker, useMap } from "react-leaflet";
import "leaflet-rotatedmarker";

export default function RotatingMarker({ position, icon, rotationAngle, onClick }) {
  const map = useMap();
  let markerRef;

  useEffect(() => {
    if (markerRef) {
      markerRef.setRotationAngle(rotationAngle);
    }
  }, [rotationAngle]);

  return (
    <Marker
      position={position}
      icon={icon}
      ref={(ref) => {
        markerRef = ref;
      }}
      eventHandlers={{ click: onClick }}
    />
  );
}
