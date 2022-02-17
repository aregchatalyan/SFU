module.exports = class Board {
  constructor(teacher_id) {
    this.points = [];
    this.paths = [];
    this.elements = [];
    this.teacher_id = teacher_id;
    this.permissonList = [teacher_id];
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
  drawing() {}

  getBoardData() {
    return { paths: this.paths };
  }
  givePermission({ userId, studentId }) {
    if (userId === this.teacher_id) {
      this.permissonList.push(studentId);
      return studentId;
    }
    return;
  }
};
