export const generateId = (arr) => {
  if (arr.length >= 1) {
    return arr[arr.length - 1].id + 1
  } else {
    return 1
  }
}

// socket.on("getWhiteBoard", function (data) {
//   data = JSON.parse(data);
//   var image = new Image();
//   var canvas = document.querySelector("#canvas");
//   var ctx = canvas.getContext("2d");
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   image.onload = function () {
//     ctx.drawImage(image, 0, 0);
//   };
//   image.src = data.imgSrc;
//   if (data.element) {
//     setPath((prevState) => [...prevState, data.element]);
//   } else if (data.updatedElement) {
//     const { id, x1, y1, x2, y2, type, strokeWidth, colorWidth } =
//       data.updatedElement;
//     updateElement(id, x1, y1, x2, y2, type, strokeWidth, colorWidth.hex);
//   }
// });
