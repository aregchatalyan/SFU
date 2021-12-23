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

export const useOutsideClick = (ref, nextRef) => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref && nextRef) {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          active &&
          nextRef.current.contains(event.target)
        ) {
          setActive(false);
        }
      } else {
        if (ref.current && !ref.current.contains(event.target) && active) {
          setActive(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, active, nextRef]);
  return { active, setActive };
};

export default useMouseMoveTimeOut;
