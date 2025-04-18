import React, { useEffect, useRef } from "react";
import jazzicon from "@metamask/jazzicon";

interface JazziconProps {
  diameter?: number;
  seed?: number;
  address?: string;
  className?: string;
}

const Jazzicon: React.FC<JazziconProps> = ({ diameter = 32, seed, address, className }) => {
  const iconRef = useRef<HTMLDivElement>(null);
  
  // Generate seed from address if provided
  const finalSeed = seed || (address ? parseInt(address.slice(2, 10), 16) : Math.floor(Math.random() * 10000000));

  useEffect(() => {
    if (iconRef.current) {
      const el = jazzicon(diameter, finalSeed);
      iconRef.current.innerHTML = ""; // Clear any existing content
      iconRef.current.appendChild(el);
    }
  }, [diameter, finalSeed]);

  return <div ref={iconRef} className={className} />;
};

export default Jazzicon;