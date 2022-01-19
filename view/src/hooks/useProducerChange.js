import { useState, useEffect } from "react";
import { consume } from "../services";

export const useProducerChange = (socket, setUsers) => {
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
