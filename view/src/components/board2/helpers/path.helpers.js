export const drawPath = ({ context, path, canvasHeight, canvasWidth }) => {
  path.forEach(
    ({
      points: stroke,
      canvasWidth: incomingCanvasWidth,
      canvasHeight: incomingCanvasHeight,
    }) => {
      context.beginPath()
      const scaleWidth = canvasWidth / incomingCanvasWidth
      const scaleHeight = canvasHeight / incomingCanvasHeight

      stroke.forEach(({ clientX, clientY, width, color }) => {
        context.strokeStyle = color
        context.lineWidth = width
        context.quadraticCurveTo(
          clientX * scaleWidth,
          clientY * scaleHeight,
          NaN,
          NaN
        )
        context.lineTo(clientX * scaleWidth, clientY * scaleHeight)
        context.stroke()
      })

      context.closePath()
      context.save()
    }
  )
}
