export const Undo = (
  order,
  setElement,
  setPath,
  setOrder,
  setHash,
  setText
) => {
  if (order.length > 0) {
    const { type } = order[order.length - 1];
    const callBack = (method) => (prevState) => {
      if (method === "hash") {
        const elements = [...prevState];
        setHash((state) => [
          ...state,
          { type: type, element: elements[elements.length - 1] },
        ]);
      }
      prevState.pop();
      return [...prevState];
    };
    if (type === "path") {
      setPath(callBack("hash"));
    } else if (type === "element") {
      setElement(callBack("hash"));
    } else if (type === "text") {
      setText(callBack("hash"));
    }
    setOrder(callBack());
  }
};
export const Redo = (hash, setElement, setPath, setOrder, setHash, setText) => {
  const elements = [...hash];
  if (elements.length > 0) {
    const { type, element } = elements[elements.length - 1];
    const callback = (type, element, method) => {
      method((prevState) => [...prevState, element]);
      setOrder((prevState) => [...prevState, { type }]);
      setHash((prevState) => {
        prevState.pop();
        return prevState;
      });
    };
    if (type === "path") {
      callback(type, element, setPath);
    } else if (type === "element") {
      callback(type, element, setElement);
    } else if (type === "text") {
      callback(type, element, setText);
    }
  }
};
