import { useState, useEffect } from "react";
export const useComponentHover = (ref) => {
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    let timeout;
    const handlMoseMove = (e) => {
      if (ref && ref.current.contains(e.target)) {
        setIsHovered(true);
        clearTimeout(timeout);
      } else {
        clearTimeout(timeout);
        if (isHovered) {
          timeout = setTimeout(() => setIsHovered(false), 50);
        }
      }
    };
    window.addEventListener("mousemove", handlMoseMove, false);
    return () => window.removeEventListener("mousemove", handlMoseMove, false);
  });

  return isHovered;
};
