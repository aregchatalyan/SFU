import { generateId } from './idGenerator.helpers'

export const createElement = ({
  id,
  startingX,
  startingY,
  endingX,
  endingY,
  toolType,
  newColor,
  newFont,
  elements,
}) => {
  if (id === 0) {
    id = generateId(elements)
  }
  if (toolType === 'rectangle') {
    const width = Math.floor(endingX - startingX)
    const height = Math.floor(endingY - startingY)
    return {
      id,
      type: toolType,
      startingX,
      startingY,
      width,
      height,
      color: newColor,
      font: newFont,
    }
  } else if (toolType === 'circle') {
    let radius = endingX - startingX
    radius = radius > 0 ? radius : -radius
    return {
      id,
      type: toolType,
      startingX,
      startingY,
      radius,
      color: newColor,
      font: newFont,
      full: 0,
      default: 2 * Math.PI,
    }
  } else if (toolType === 'line') {
    return {
      id,
      type: toolType,
      startingX,
      startingY,
      endingX,
      endingY,
      color: newColor,
      font: newFont,
    }
  } else if (toolType === 'triangle') {
    let height = startingY - endingY
    height = height > 0 ? height : -height
    const angleA = startingX - height / 2
    const angleB = startingX + height / 2
    return {
      id,
      type: toolType,
      startingX,
      startingY,
      endingY,
      angleA,
      angleB,
      color: newColor,
      font: newFont,
    }
  } else if (toolType === 'pointer') {
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
    return {
      id,
      type: toolType,
      startingX,
      startingY,
      endingX,
      endingY,
      angleA,
      angleB,
      color: newColor,
      font: newFont,
    }
  }
}

export const showElements = (elements) => {
  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')
  elements.forEach((elm) => {
    const {
      type,
      startingX,
      startingY,
      endingX,
      endingY,
      angleA,
      angleB,
      width,
      height,
      radius,
      full,
      color,
      font,
    } = elm
    context.beginPath()
    context.strokeStyle = color
    context.lineWidth = font
    if (type === 'rectangle') {
      context.rect(startingX, startingY, width, height)
    } else if (type === 'circle') {
      context.arc(startingX, startingY, radius, full, elm.default)
    } else if (type === 'line') {
      context.moveTo(startingX, startingY)
      context.lineTo(endingX, endingY)
    } else if (type === 'triangle') {
      context.moveTo(startingX, startingY)
      context.lineTo(angleA, endingY)
      context.lineTo(angleB, endingY)
      context.closePath()
    } else if (type === 'pointer') {
      context.moveTo(startingX, startingY)
      context.lineTo(endingX, endingY)
      context.lineTo(angleA.x, angleA.y)
      context.lineTo(endingX, endingY)
      context.lineTo(angleB.x, angleB.y)
    }
    context.stroke()
  })
}
export const updateElement = (endingX, endingY, elements, setElements) => {
  const elementsCopy = [...elements]
  const index = elementsCopy.length - 1
  const lastElement = elementsCopy[index]
  const { id, startingX, startingY, type, color, font } = lastElement
  const updatedElement = createElement({
    id,
    startingX,
    startingY,
    endingX,
    endingY,
    toolType: type,
    newColor: color,
    newFont: font,
    elements: [],
  })
  elementsCopy[index] = updatedElement
  setElements([...elementsCopy])
}
