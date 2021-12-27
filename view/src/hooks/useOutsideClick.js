import { useState, useEffect } from "react";

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
