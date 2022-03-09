import { useState, useEffect, useCallback, useRef, useContext } from 'react'
import { SocketContext } from '../../Context'
import { drawPath, drawElement } from './helpers'

const drawingActions = ['triangle', 'rectangle', 'circle', 'line', 'pointer']

const useBoardAction = ({
  boardRef,
  savedBoardRef,
  toolType,
  color,
  width,
  selfId,
  permissionToEdit,
  identyfierRef,
  setEditorName,
  setEditorToolType,
  getUserById,
  textAreaRef,
  spanRef,
  setTexts,
}) => {
  const socket = useContext(SocketContext)
  const [action, setAction] = useState(undefined)
  const [path, setPath] = useState([])
  const [elements, setElements] = useState([])
  const [imitationElement, setImitationElement] = useState([])
  const [history, setHistory] = useState([])
  const [hash, setHash] = useState([])
  const textProps = useRef({})
  const isDrawing = useRef(false)
  const isWriting = useRef(false)
  const points = useRef([])

  const reset = ({ producerId }) => {
    if (!producerId) {
      socket.emit('resetBoard', { producerId: producerId || selfId })
    }
    setPath([])
    setElements([])
    setHistory([])
    setTexts([])
  }
  const undo = useCallback(
    ({ userId, undoActionType }) => {
      if (userId && undoActionType) {
        if (undoActionType === 'sketch') {
          setPath((prev) => {
            const prevCopy = [...prev]
            for (let index = prev.length - 1; index >= 0; index--) {
              const element = prev[index]
              if (element.producerId === userId) {
                prevCopy.splice(index, 1)
                break
              }
            }
            return prevCopy
          })
        } else if (undoActionType === 'draw') {
          setElements((prev) => {
            const prevCopy = [...prev]
            for (let index = prev.length - 1; index >= 0; index--) {
              const element = prev[index]
              if (element.producerId === userId) {
                prevCopy.splice(index, 1)
                break
              }
            }
            return prevCopy
          })
        } else if (undoActionType === 'text') {
          setTexts((prev) => {
            const prevCopy = [...prev]
            for (let index = prev.length - 1; index >= 0; index--) {
              const element = prev[index]
              if (element.producerId === userId) {
                prevCopy.splice(index, 1)
                break
              }
            }
            return prevCopy
          })
        }
      } else if (history.length > 0) {
        const lastAction = history[history.length - 1]

        socket.emit('undoAction', {
          userId: selfId,
          undoActionType: lastAction,
        })

        let hashedElement
        if (lastAction === 'sketch') {
          setPath((prev) => {
            const prevCopy = [...prev]
            for (let index = prev.length - 1; index >= 0; index--) {
              const element = prev[index]
              if (element.producerId === selfId) {
                hashedElement = { undoActionType: lastAction, ...element }
                prevCopy.splice(index, 1)
                break
              }
            }
            return prevCopy
          })
        } else if (lastAction === 'draw') {
          setElements((prev) => {
            const prevCopy = [...prev]
            for (let index = prev.length - 1; index >= 0; index--) {
              const element = prev[index]
              if (element.producerId === selfId) {
                hashedElement = { undoActionType: lastAction, ...element }
                prevCopy.splice(index, 1)
                break
              }
            }
            return prevCopy
          })
        } else if (lastAction === 'text') {
          setTexts((prev) => {
            const prevCopy = [...prev]
            for (let index = prev.length - 1; index >= 0; index--) {
              const element = prev[index]
              if (element.producerId === selfId) {
                hashedElement = { undoActionType: lastAction, ...element }
                prevCopy.splice(index, 1)
                break
              }
            }
            return prevCopy
          })
        }
        setHash((prev) => [...prev, hashedElement])
        setHistory((prev) => {
          const prevCopy = [...prev]
          prevCopy.pop()
          return prevCopy
        })
      }
    },
    [history, selfId, socket, setTexts]
  )
  const redo = useCallback(
    ({ undoActionType, ...otherProps }) => {
      if (undoActionType) {
        if (undoActionType === 'sketch') {
          setPath((prev) => [...prev, otherProps])
        } else if (undoActionType === 'draw') {
          setElements((prev) => [...prev, otherProps])
        } else if (undoActionType === 'text') {
          setTexts((prev) => [...prev, otherProps])
        }
      } else if (hash.length > 0) {
        const { undoActionType, ...otherProps } = hash[hash.length - 1]

        socket.emit('redoAction', { undoActionType, ...otherProps })

        setHistory((prev) => [...prev, undoActionType])
        if (undoActionType === 'sketch') {
          setPath((prev) => [...prev, otherProps])
        } else if (undoActionType === 'draw') {
          setElements((prev) => [...prev, otherProps])
        } else if (undoActionType === 'text') {
          setTexts((prev) => [...prev, otherProps])
        }
        setHash((prev) => {
          const prevCopy = [...prev]
          prevCopy.pop()
          return prevCopy
        })
      }
    },
    [hash, socket, setTexts]
  )
  const keyPress = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        setAction(undefined)
        isWriting.current = false
        textAreaRef.current.style.display = 'none'
        if (spanRef && spanRef.current.childNodes[0]) {
          let text = ''
          spanRef.current.childNodes.forEach((elm) => {
            if (elm.localName !== 'br') {
              text += elm.data
            } else {
              text += '\n'
            }
          })
          if (text.length === 0) return
          const canvas = boardRef.current
          const { width: canvasWidth, height: canvasHeight } =
            canvas.getBoundingClientRect()
          setHistory((prev) => [...prev, 'text'])
          setHash([])
          setTexts((props) => [
            ...props,
            {
              ...textProps.current,
              text,
              producerId: selfId,
              canvasWidth,
              canvasHeight,
            },
          ])

          socket.emit('wroteText', {
            ...textProps.current,
            text,
            producerId: selfId,
            canvasWidth,
            canvasHeight,
          })
        }
        spanRef.current.innerText = ''
      }
    },
    [socket, setTexts, spanRef, textAreaRef, selfId, boardRef]
  )

  useEffect(() => {
    socket &&
      socket.on('savedBoardData', ({ paths, elements, texts }) => {
        paths.length > 0 && setPath([...paths])
        elements.length > 0 && setElements([...elements])
        texts.length > 0 && setTexts([...texts])
      })
  }, [socket, setTexts])

  useEffect(() => {
    const { height: canvasHeight, width: canvasWidth } =
      savedBoardRef.current.getBoundingClientRect()
    const context = savedBoardRef.current.getContext('2d')

    context.lineJoin = 'round'
    if (path.length > 0) drawPath({ context, path, canvasHeight, canvasWidth })

    if (elements.length > 0) console.log('elements_updated::', elements)
    drawElement(context, elements, canvasHeight, canvasWidth)
    return () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight)
    }
  }, [path, width, savedBoardRef, elements])

  useEffect(() => {
    const { height: canvasHeight, width: canvasWidth } =
      boardRef.current.getBoundingClientRect()
    const context = boardRef.current.getContext('2d')

    context.lineJoin = 'round'
    if (imitationElement.length > 0) {
      drawElement(context, imitationElement, canvasHeight, canvasWidth)
    }
    return () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight)
    }
  }, [imitationElement, boardRef, width])

  const sketching = useCallback(
    ({
      type,
      clientX: incomingX,
      clientY: incomingY,
      incomingElementColor,
      incomingElementWidth,
      incomingCanvasWidth,
      incomingCanvasHeight,
      producerId,
    }) => {
      const canvas = boardRef.current
      const context = canvas.getContext('2d')
      const { width: canvasWidth, height: canvasHeight } =
        canvas.getBoundingClientRect()
      if (
        !incomingElementColor &&
        !incomingElementWidth &&
        !incomingCanvasWidth &&
        !incomingCanvasHeight &&
        !producerId
      ) {
        socket.emit('sketching', {
          type,
          clientX: incomingX,
          clientY: incomingY,
          incomingElementColor: color.hex,
          incomingElementWidth: width.path,
          incomingCanvasWidth: canvasWidth,
          incomingCanvasHeight: canvasHeight,
          producerId: selfId,
        })
        setHash([])
      }

      const scaleWidth = incomingCanvasWidth
        ? canvasWidth / incomingCanvasWidth
        : 1

      const scaleHeight = incomingCanvasHeight
        ? canvasHeight / incomingCanvasHeight
        : 1

      const clientX = incomingX * scaleWidth
      const clientY = incomingY * scaleHeight

      if (type === 'start') {
        context.strokeStyle = incomingElementColor || color.hex
        context.lineWidth = incomingElementWidth || width.path
        context.lineCap = 5
        context.moveTo(clientX, clientY)
        context.beginPath()
        if (identyfierRef && producerId) {
          const { name, surname } = getUserById(producerId)
          identyfierRef.current.style.display = 'flex'
          setEditorName(`${name} ${surname}`)
          setEditorToolType('pencil')
        }
      } else if (type === 'on_process') {
        const newEle = {
          clientX: incomingX,
          clientY: incomingY,
          color: incomingElementColor || color.hex,
          width: incomingElementWidth || width.path,
        }
        if (identyfierRef && producerId) {
          identyfierRef.current.style.top = `${incomingY * scaleHeight - 21}px`
          identyfierRef.current.style.left = `${incomingX * scaleWidth}px`
        }
        points.current.push(newEle)
        context.quadraticCurveTo(clientX, clientY, NaN, NaN)
        context.lineTo(clientX, clientY)
        context.stroke()
      } else if (type === 'finished') {
        context.closePath()
        const element = {
          producerId: producerId || selfId,
          canvasWidth: incomingCanvasWidth || canvasWidth,
          canvasHeight: incomingCanvasHeight || canvasHeight,
          points: points.current,
        }
        context.clearRect(0, 0, canvasWidth, canvasHeight)
        setPath((state) => [...state, element])
        points.current = []
        if (!producerId) {
          setHistory((prev) => [...prev, 'sketch'])
        }

        if (identyfierRef && producerId) {
          identyfierRef.current.style.display = 'none'
          setEditorName(``)
        }
      } else if (type === 'mouse_out') {
        context.closePath()
        context.clearRect(0, 0, canvasWidth, canvasHeight)
        const element = {
          producerId: producerId || selfId,
          canvasWidth: incomingCanvasWidth || canvasWidth,
          canvasHeight: incomingCanvasHeight || canvasHeight,
          points: points.current,
        }
        setPath((state) => [...state, element])
        if (!producerId) {
          setHistory((prev) => [...prev, 'sketch'])
        }
        points.current = []
        if (identyfierRef && producerId) {
          identyfierRef.current.style.display = 'none'
          setEditorName(``)
        }
      }
    },
    [
      color,
      width,
      boardRef,
      socket,
      selfId,
      getUserById,
      identyfierRef,
      setEditorName,
      setEditorToolType,
    ]
  )
  const drawing = useCallback(
    ({
      type,
      clientX,
      clientY,
      incomingElementColor,
      incomingElementWidth,
      incomingCanvasWidth,
      incomingCanvasHeight,
      incomingToolType,
      producerId,
    }) => {
      const canvas = boardRef.current
      const context = canvas.getContext('2d')
      const { width: canvasWidth, height: canvasHeight } =
        canvas.getBoundingClientRect()
      const scaleWidth = incomingCanvasWidth
        ? canvasWidth / incomingCanvasWidth
        : 1

      const scaleHeight = incomingCanvasHeight
        ? canvasHeight / incomingCanvasHeight
        : 1

      if (
        !incomingElementColor &&
        !incomingElementWidth &&
        !incomingCanvasWidth &&
        !incomingCanvasHeight &&
        !incomingToolType &&
        !producerId
      ) {
        socket.emit('drawing', {
          type,
          clientX,
          clientY,
          incomingElementColor: color.hex,
          incomingElementWidth: width.element,
          incomingCanvasWidth: canvasWidth,
          incomingCanvasHeight: canvasHeight,
          incomingToolType: toolType,
          producerId: selfId,
        })
        setHash([])
      }

      if (type === 'start') {
        const newElement = {
          startingX: clientX,
          startingY: clientY,
          endingX: clientX,
          endingY: clientY,
          color: incomingElementColor || color.hex,
          width: incomingElementWidth || width.element,
          type: incomingToolType || toolType,
          canvasWidth: incomingCanvasWidth || canvasWidth,
          canvasHeight: incomingCanvasHeight || canvasHeight,
          producerId: producerId || selfId,
        }
        if (identyfierRef && producerId) {
          const { name, surname } = getUserById(producerId)
          identyfierRef.current.style.display = 'flex'
          setEditorName(`${name} ${surname}`)
          setEditorToolType(incomingToolType)
        }
        setImitationElement((prevState) => [...prevState, newElement])
      } else if (type === 'on_process') {
        setImitationElement((prevState) => {
          const elements = [...prevState]
          const lastIndex = elements.length - 1
          const lastElement = elements[lastIndex]
          elements[lastIndex] = {
            ...lastElement,
            endingX: clientX,
            endingY: clientY,
          }
          if (identyfierRef && producerId) {
            identyfierRef.current.style.top = `${clientY * scaleHeight}px`
            identyfierRef.current.style.left = `${clientX * scaleWidth}px`
          }
          return [...elements]
        })
      } else if (type === 'finished') {
        setImitationElement((state) => {
          setElements((prev) => [...prev, ...state])
          return []
        })
        if (identyfierRef && producerId) {
          identyfierRef.current.style.display = 'none'
          setEditorName(``)
        }
        if (!producerId) {
          setHistory((prev) => [...prev, 'draw'])
        }
        context.clearRect(0, 0, canvasWidth, canvasHeight)
        isDrawing.current = false
      } else if (type === 'mouse_out') {
        context.clearRect(0, 0, canvasWidth, canvasHeight)
        setImitationElement([])
        if (!producerId) {
          setHistory((prev) => [...prev, 'draw'])
        }
        if (identyfierRef && producerId) {
          identyfierRef.current.style.display = 'none'
          setEditorName(``)
        }
      }
    },
    [
      selfId,
      boardRef,
      toolType,
      width.element,
      color,
      socket,
      identyfierRef,
      getUserById,
      setEditorName,
      setEditorToolType,
    ]
  )

  const writing = useCallback(
    ({ type, clientX, clientY }, event) => {
      if (type === 'start') {
        event.preventDefault()
        if (textAreaRef && textAreaRef.current && spanRef && spanRef.current) {
          textAreaRef.current.style.left = `${clientX}px`
          textAreaRef.current.style.top = `${clientY}px`
          textAreaRef.current.style.display = 'block'
          textAreaRef.current.style.minHeight = width.lineHeight + 8 + 'px'
          spanRef.current.focus()
          spanRef.current.style.fontSize = `${width.fontSize}px`
          spanRef.current.style.lineHeight = `${width.lineHeight}px`
          spanRef.current.style.color = color.hex
          textProps.current = {
            text: '',
            left: clientX,
            top: clientY,
            maxWidth: 200,
            fontSize: width.fontSize,
            lineHeight: width.lineHeight,
            color: color.hex,
          }
          spanRef.current.addEventListener('keypress', keyPress)
        }
      } else if (type === 'end') {
        if (textAreaRef && textAreaRef.current && spanRef && spanRef.current) {
          const canvas = boardRef.current
          const { width: canvasWidth, height: canvasHeight } =
            canvas.getBoundingClientRect()
          textAreaRef.current.style.display = 'none'
          spanRef.current.removeEventListener('keypress', keyPress)
          if (spanRef && spanRef.current.childNodes[0]) {
            let text = ''
            spanRef.current.childNodes.forEach((elm) => {
              if (elm.localName !== 'br') {
                text += elm.data
              } else {
                text += '\n'
              }
            })
            if (text.length === 0) return
            setTexts((props) => [
              ...props,
              {
                ...textProps.current,
                text,
                producerId: selfId,
                canvasWidth,
                canvasHeight,
              },
            ])
            setHash([])
            setHistory((prev) => [...prev, 'text'])
            socket.emit('wroteText', {
              ...textProps.current,
              text,
              producerId: selfId,
              canvasWidth,
              canvasHeight,
            })
          }
          spanRef.current.innerText = ''
        }
      }
    },
    [
      textAreaRef,
      spanRef,
      setTexts,
      width,
      color,
      keyPress,
      socket,
      selfId,
      boardRef,
    ]
  )

  useEffect(() => {
    socket.on('newSketching', (data) => {
      sketching(data)
    })

    socket.on('newDrawing', (data) => {
      drawing(data)
    })
    socket.on('newText', (data) => {
      setTexts((prev) => [...prev, data])
    })

    socket.on('boardReset', (data) => {
      reset(data)
    })

    socket.on('undoUserAction', (data) => {
      undo(data)
    })

    socket.on('redoUserAction', (data) => {
      redo(data)
    })
  }, [socket]) // eslint-disable-line

  const defineAction = useCallback(
    (props, event) => {
      if (toolType === 'pencil') {
        isDrawing.current = true
        setAction('sketching')
        sketching({ type: 'start', ...props })
      } else if (drawingActions.includes(toolType)) {
        isDrawing.current = true
        setAction('drawing')
        drawing({ type: 'start', ...props })
      } else if (toolType === 'text') {
        if (!isWriting.current) {
          isWriting.current = true
          writing({ type: 'start', ...props }, event)
          setAction('writing')
        } else {
          writing({ type: 'end', ...props })
          setAction(undefined)
          isWriting.current = false
        }
      } else {
        isDrawing.current = false
        setAction(undefined)
      }
    },
    [sketching, drawing, toolType, writing]
  )
  const mouseDown = useCallback(
    (event) => {
      if (!permissionToEdit) return
      const { clientX, clientY, target } = event
      if (boardRef.current && boardRef.current.contains(target)) {
        defineAction({ clientX, clientY: clientY - 48 }, event)
      }
    },
    [boardRef, defineAction, permissionToEdit]
  )

  const mouseMove = useCallback(
    (event) => {
      if (!permissionToEdit) return
      const { clientX, clientY, target } = event
      if (
        boardRef.current &&
        boardRef.current.contains(target) &&
        isDrawing.current
      ) {
        if (action === 'sketching') {
          sketching({ type: 'on_process', clientX, clientY: clientY - 48 })
        } else if (action === 'drawing') {
          drawing({ type: 'on_process', clientX, clientY: clientY - 48 })
        }
      } else if (isDrawing.current) {
        isDrawing.current = false
        sketching({ type: 'mouse_out' })
        drawing({ type: 'mouse_out' })
      }
    },
    [boardRef, sketching, drawing, action, permissionToEdit]
  )

  const mouseUp = useCallback(
    ({ target, clientX, clientY }) => {
      if (!permissionToEdit) return
      if (
        boardRef.current &&
        boardRef.current.contains(target) &&
        isDrawing.current
      ) {
        isDrawing.current = false
        if (action === 'sketching') {
          sketching({ type: 'finished' })
        } else if (action === 'drawing') {
          drawing({ type: 'finished' })
        }
      }
    },
    [action, boardRef, sketching, drawing, permissionToEdit]
  )

  useEffect(() => {
    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('touchstart', mouseDown)
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('touchmove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
    document.addEventListener('touchend', mouseUp)
    document.addEventListener('contextmenu', (event) => event.preventDefault())
    return () => {
      document.removeEventListener('mousedown', mouseDown)
      document.removeEventListener('touchstart', mouseDown)
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('touchmove', mouseMove)
      document.removeEventListener('mouseup', mouseUp)
      document.removeEventListener('touchend', mouseUp)
    }
  }, [
    boardRef,
    toolType,
    color,
    width,
    defineAction,
    sketching,
    action,
    mouseDown,
    mouseMove,
    mouseUp,
  ])
  return {
    reset,
    undo,
    undoDisabled: history.length === 0,
    redo,
    redoDisabled: hash.length === 0,
  }
}

export default useBoardAction
