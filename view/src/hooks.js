import { useEffect, useState } from "react";
import { consume } from "./services";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};
export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

const useProducerChange = (socket, setUsers) => {
  const [userList, setUserList] = useState([]);
  const [producers, setProducers] = useState([]);
  useEffect(() => {
    if (producers.length > 0) {
      console.log("PRODUCERS : ", producers);
      for (let { producer_id, producer_socket_id } of producers) {
        consume(producer_id, socket, producer_socket_id, [...userList]).then(
          (r) => {
            setUsers(r);
          }
        );
      }
    } else {
      setUsers(userList);
    }
  }, [userList, setUserList, producers, setProducers, setUsers, socket]);
  return { setUserList, setProducers };
};

export default useProducerChange;
