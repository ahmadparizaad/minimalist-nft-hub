import React, { useEffect, useRef } from "react";
import jazzicon from "@metamask/jazzicon";

interface JazziconProps {
  diameter: number;
  seed: number;
}

const Jazzicon: React.FC<JazziconProps> = ({ diameter, seed }) => {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      const el = jazzicon(diameter, seed);
      iconRef.current.innerHTML = ""; // Clear any existing content
      iconRef.current.appendChild(el);
    }
  }, [diameter, seed]);

  return <div ref={iconRef} />;
};

export default Jazzicon;