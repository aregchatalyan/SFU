export const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};

export const drawpath = (path) => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  path.forEach((stroke, index) => {
    context.beginPath();

    stroke.forEach((point, i) => {
      context.strokeStyle = point.newColour;
      context.lineWidth = point.newLinewidth;

      var midPoint = midPointBtw(point.clientX, point.clientY);

      context.quadraticCurveTo(
        point.clientX,
        point.clientY,
        midPoint.x,
        midPoint.y
      );
      context.lineTo(point.clientX, point.clientY);
      context.stroke();
    });
    context.closePath();
    context.save();
  });
};
