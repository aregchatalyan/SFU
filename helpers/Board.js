module.exports = class Board {
  constructor(teacher_id) {
    this.points = [];
    this.paths = [];
    this.elements = [];
    this.teacher_id = teacher_id;
    this.permissonList = [teacher_id];
    this.action = false;
  }

  userHasPermission({ userId }) {
    if (userId === this.teacher_id) {
      return this.permissonList.filter((id) => id !== this.teacher_id);
    }
    return this.permissonList.includes(userId);
  }

  givePermission({ userId, studentId, allowed }) {
    if (userId === this.teacher_id && allowed) {
      this.permissonList.push(studentId);
      return studentId;
    } else {
      this.permissonList = [...this.permissonList].filter(
        (id) => id !== studentId
      );
      return studentId;
    }
    return;
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
    if (this.permissonList.includes(producerId)) {
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
      return true;
    }
    return false;
  }

  drawing({
    type,
    clientX,
    clientY,
    incomingElementColor,
    incomingElementWidth,
    incomingCanvasWidth,
    incomingCanvasHeight,
    incomingToolType,
    producerId,
  }) {
    if (this.permissonList.includes(producerId)) {
      if (type === "start") {
        const newElement = {
          startingX: clientX,
          startingY: clientY,
          endingX: clientX,
          endingY: clientY,
          color: incomingElementColor,
          width: incomingElementWidth,
          type: incomingToolType,
          canvasWidth: incomingCanvasWidth,
          canvasHeight: incomingCanvasHeight,
          producerId: producerId,
        };
        this.elements.push(newElement);
      } else if (type === "on_process") {
        const lastElementCopy = { ...this.elements[this.elements.length - 1] };
        this.elements[this.elements.length - 1] = {
          ...lastElementCopy,
          endingX: clientX,
          endingY: clientY,
        };
      } else if (type === "finished" || type === "mouse_out") {
      }
      return true;
    }
    return false;
  }
  reset({ producerId }) {
    if (this.permissonList.includes(producerId)) {
      this.paths = [];
      this.elements = [];
    }
  }
  undoActionByUserId({ undoActionType, userId }) {
    if (undoActionType === "sketch") {
      const prevCopy = [...this.paths];

      for (let index = this.paths.length - 1; index >= 0; index--) {
        const element = this.paths[index];
        if (element.producerId === userId) {
          prevCopy.splice(index, 1);
          break;
        }
      }

      this.paths = prevCopy;
    } else if (undoActionType === "draw") {
      const prevCopy = [...this.elements];

      for (let index = this.elements.length - 1; index >= 0; index--) {
        const element = this.elements[index];
        if (element.producerId === userId) {
          prevCopy.splice(index, 1);
          break;
        }
      }
      this.elements = prevCopy;
    }
  }
  redoBoardAction({ undoActionType, ...otherProps }) {
    if (undoActionType === "sketch") {
      this.paths.push(otherProps);
    } else if (undoActionType === "draw") {
      this.elements.push(otherProps);
    }
  }
  getBoardData() {
    return { paths: this.paths, elements: this.elements };
  }
};
