import { generateId } from './idGenerator.helpers'
export const createText = (x, y, text, font, color, texts) => {
  console.log(texts)
  const id = generateId(texts)
  return { id, x, y, text, font, color }
}

export const writeText = (texts, isTexting) => {
  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')
  texts.forEach((text, index) => {
    context.font = text.font
    context.fillStyle = text.color
    if (isTexting && index === texts.length - 1) {
      context.fillText(text.text + '|', text.x, text.y)
    } else {
      context.fillText(text.text, text.x, text.y)
    }
  })
}

export const keyDown = (texts, isTexting, setText, setIsTexting, e) => {
  const { key, keyCode } = e
  if (isTexting) {
    setText((prevState) => {
      let res = [...prevState]
      const index = res.length - 1
      let lastText = res[index]
      if (keyCode === 8) {
        lastText.text = lastText.text.slice(0, -1)
        res[index] = lastText
      } else if (keyCode === 13 || keyCode === 9) {
        setIsTexting(!isTexting)
      } else if (keyCode <= 20) {
      } else {
        lastText.text += key
        res[index] = lastText
      }
      return res
    })
    writeText(texts, isTexting)
  }
}
