import { useState, useEffect } from "react";

const useMouseMoveTimeOut = () => {
  const [isAcrive, setIsActive] = useState(false);

  useEffect(() => {
    let timeout;

    const handlMoseMove = () => {
      setIsActive(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsActive(false), 5000);
    };

    window.addEventListener("mousemove", handlMoseMove, false);

    return () => window.removeEventListener("mousemove", handlMoseMove, false);
  }, []);

  return isAcrive;
};

export default useMouseMoveTimeOut;
