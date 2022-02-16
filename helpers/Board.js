const { randomUUID } = require("crypto");

module.exports = class Board {
  constructor(roomId) {
    this.points = [];
    this.paths = [];
    this.elements = [];
  }
  sketching({
    type,
    clientX,
    clientY,
    incomingElementColor,
    incomingElementWidth,
    incomingCanvasWidth,
    incomingCanvasHeight,
    producerId,
  }) {
    if (type === "on_process") {
      const newEle = {
        clientX,
        clientY,
        color: incomingElementColor,
        width: incomingElementWidth,
      };
      this.points.push(newEle);
    } else if (type === "finished" || type === "mouse_out") {
      const element = {
        producerId,
        canvasWidth: incomingCanvasWidth,
        canvasHeight: incomingCanvasHeight,
        points: this.points,
      };

      this.paths.push(element);
      this.points = [];
    }
  }
  drawing() {}

  getBoardData() {
    return { paths: this.paths };
  }
};
