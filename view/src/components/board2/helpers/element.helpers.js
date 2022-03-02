const draw = {
  triangle: (context, { startingX, startingY, endingX, endingY }) => {
    context.moveTo(Math.abs(endingX + startingX) / 2, startingY)
    context.lineTo(startingX, endingY)
    context.lineTo(endingX, endingY)
    context.closePath()
  },
  rectangle: (context, { startingX, startingY, endingX, endingY }) => {
    const width = Math.floor(endingX - startingX)
    const height = Math.floor(endingY - startingY)
    context.rect(startingX, startingY, width, height)
  },
  circle: (context, { startingX, startingY, endingX, endingY }) => {
    const radius = Math.abs(endingX - startingX) + Math.abs(endingY - startingY)
    context.arc(startingX, startingY, radius, 0, 2 * Math.PI)
  },
  line: (context, { startingX, startingY, endingX, endingY }) => {
    context.moveTo(startingX, startingY)
    context.lineTo(endingX, endingY)
  },
  pointer: (context, { startingX, startingY, endingX, endingY }) => {
    const dx = endingX - startingX
    const dy = endingY - startingY
    const angle = Math.atan2(dy, dx)
    const headlen = 20
    const angleA = {
      x: endingX - headlen * Math.cos(angle - Math.PI / 6),
      y: endingY - headlen * Math.sin(angle - Math.PI / 6),
    }
    const angleB = {
      x: endingX - headlen * Math.cos(angle + Math.PI / 6),
      y: endingY - headlen * Math.sin(angle + Math.PI / 6),
    }
    context.moveTo(startingX, startingY)
    context.lineTo(endingX, endingY)
    context.lineTo(angleA.x, angleA.y)
    context.lineTo(endingX, endingY)
    context.lineTo(angleB.x, angleB.y)
  },
}

export const drawElement = (context, elements, canvasHeight, canvasWidth) => {
  elements.forEach(
    ({
      type,
      startingX,
      startingY,
      endingX,
      endingY,
      color,
      width: font,
      canvasWidth: incomingCanvasWidth,
      canvasHeight: incomingCanvasHeight,
    }) => {
      const scaleWidth = canvasWidth / incomingCanvasWidth
      const scaleHeight = canvasHeight / incomingCanvasHeight

      const currentStartingX = startingX * scaleWidth
      const currentEndingX = endingX * scaleWidth
      const currentStartingY = startingY * scaleHeight
      const currentEndingY = endingY * scaleHeight

      context.beginPath()
      context.strokeStyle = color
      context.lineWidth = font

      draw[type](context, {
        startingX: currentStartingX,
        endingX: currentEndingX,
        startingY: currentStartingY,
        endingY: currentEndingY,
      })

      context.stroke()
    }
  )
}
