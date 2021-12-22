import React, { useEffect, useState } from "react";
import ToolBoard from "./ToolBoard";
import {
  adjustElementCoordinates,
  cursorForPosition,
  resizedCoordinates,
  getElementAtPosition,
} from "./element";
import {
  Undo,
  Redo,
  createText,
  writeText,
  keyDown,
  midPointBtw,
  drawpath,
  createElement,
  updateElement,
  showElements,
} from "./helpers/helpers";

function Board({ socket, setBoard, className, goToVideoCall }) {
  const [path, setPath] = useState([]);
  const [elements, setElements] = useState([]);
  const [texts, setText] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isTexting, setIsTexting] = useState(false);
  const [points, setPoints] = useState([]);
  const [action, setAction] = useState("none");
  const [toolType, setToolType] = useState("pencil");
  const [selectedElement, setSelectedElement] = useState(null);
  const [width, setWidth] = useState(1);
  const [shapeWidth, setShapeWidth] = useState(1);
  const [popped, setPopped] = useState(false);
  const [order, setOrder] = useState([]);
  const [hash, setHash] = useState([]);
  const [colorWidth, setColorWidth] = useState({
    hex: "#000",
    hsv: {},
    rgb: {},
  });
  const handleUndo = () => {
    Undo(order, setElements, setPath, setOrder, setHash, setText);
  };
  const handleRedo = () => {
    Redo(hash, setElements, setPath, setOrder, setHash, setText);
  };
  const handleReset = () => {
    setElements([]);
    setPath([]);
    setText([]);
    setHash([]);
    setOrder([]);
  };
  const handleKeyDown = (e) => {
    keyDown(texts, isTexting, setText, setIsTexting, e);
  };

  React.useEffect(() => {
    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTexting]);

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.lineJoin = "round";
    if (toolType === "eraser" && popped === true) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      setPopped(false);
    }
    if (isTexting !== undefined) writeText(texts, isTexting);
    showElements(elements);
    if (path !== undefined) drawpath(path);
    context.lineWidth = shapeWidth;
    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [popped, elements, path, width, texts]);

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    setIsTexting(false);
    if (toolType === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resize");
        }
      }
    } else {
      const id = elements.length;
      if (toolType === "pencil" || toolType === "eraser") {
        let newColour;
        if (toolType === "eraser") {
          newColour = "#ffffff";
        } else {
          newColour = colorWidth.hex;
        }
        setAction("sketching");
        setIsDrawing(true);
        const newLinewidth = width;
        const transparency = toolType === "brush" ? "0.1" : "1.0";
        const newEle = {
          clientX,
          clientY,
          newColour,
          newLinewidth,
          transparency,
        };
        setPoints((state) => [...state, newEle]);
        context.strokeStyle = newColour;
        context.lineWidth = newLinewidth;
        context.lineCap = 5;
        context.moveTo(clientX, clientY);
        context.beginPath();
      } else if (toolType === "text") {
        if (!isTexting) {
          setOrder((prevState) => [...prevState, { type: "text" }]);
          const newColour = colorWidth.hex;
          const newFont = (width + 2) * 10 + "px Rubik";
          const newText = createText(
            clientX,
            clientY,
            "",
            newFont,
            newColour,
            texts
          );
          setText((prevState) => [...prevState, newText]);
        }
        setIsTexting(!isTexting);
      } else if (toolType === "fontWeight") {
        setToolType("pencil");
      } else {
        const newColor = colorWidth.hex;
        const newFont = width + 1;
        setAction("drawing");
        const newElement = createElement({
          id,
          startingX: clientX,
          startingY: clientY,
          endingX: clientX,
          endingY: clientY,
          toolType,
          newColor,
          newFont,
          elements,
        });
        setIsDrawing(!isDrawing);
        setElements((prevState) => [...prevState, newElement]);
      }
    }
  };

  const handleMouseMove = (e) => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const { clientX, clientY } = e;
    if (toolType === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      e.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }

    if (action === "sketching") {
      if (!isDrawing) return;
      const colour = points[points.length - 1].newColour;
      const linewidth = points[points.length - 1].newLinewidth;
      const transparency = points[points.length - 1].transparency;
      const newEle = { clientX, clientY, colour, linewidth, transparency };
      var midPoint = midPointBtw(clientX, clientY);
      setPoints((state) => [...state, newEle]);
      context.quadraticCurveTo(clientX, clientY, midPoint.x, midPoint.y);
      context.lineTo(clientX, clientY);
      context.stroke();
    } else if (action === "drawing") {
      updateElement(clientX, clientY, elements, setElements);
      setOrder((prevState) => [...prevState, { type: "element" }]);
      setHash([]);
    } else if (action === "moving") {
      const {
        id,
        x1,
        x2,
        y1,
        y2,
        type,
        offsetX,
        offsetY,
        shapeWidth,
        strokeColor,
      } = selectedElement;
      const offsetWidth = x2 - x1;
      const offsetHeight = y2 - y1;
      const newX = clientX - offsetX;
      const newY = clientY - offsetY;
      updateElement(
        id,
        newX,
        newY,
        newX + offsetWidth,
        newY + offsetHeight,
        type,
        shapeWidth,
        strokeColor
      );
    } else if (action === "resize") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type, shapeWidth, colorWidth.hex);
    }
  };
  const handleMouseUp = () => {
    if (action === "resize") {
      const index = selectedElement.id;
      const { id, type, strokeWidth, strokeColor } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement(id, x1, y1, x2, y2, type, strokeWidth, strokeColor);
    } else if (action === "drawing") {
      if (toolType === "triangle") {
        setIsDrawing(!isDrawing);
        setAction("none");
        return;
      }
    } else if (action === "sketching") {
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      context.closePath();
      const element = points;
      setPoints([]);
      setPath((prevState) => [...prevState, element]);
      setOrder((prevState) => [...prevState, { type: "path" }]);
      setHash([]);
      setIsDrawing(false);
    }
    setAction("none");
  };

  return (
    <div className={className}>
      <ToolBoard
        toolType={toolType}
        setToolType={setToolType}
        width={width}
        setWidth={setWidth}
        setColorWidth={setColorWidth}
        colorWidth={colorWidth}
        setShapeWidth={setShapeWidth}
        order={order}
        undo={handleUndo}
        hash={hash}
        redo={handleRedo}
        reset={handleReset}
        {...{ goToVideoCall }}
      />
      <canvas
        id="canvas"
        style={{ backgroundColor: "white" }}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={(e) => {
          var touch = e.touches[0];
          handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
        }}
        onTouchMove={(e) => {
          var touch = e.touches[0];
          handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }}
        onTouchEnd={handleMouseUp}
      >
        Canvas
      </canvas>
    </div>
  );
}

export default Board;
