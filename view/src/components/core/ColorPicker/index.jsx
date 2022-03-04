import React, { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ColorPicker as Picker } from 'react-color-palette'
import 'react-color-palette/lib/css/styles.css'
import './style.scss'

const cutomColors = [
  {
    hex: '#1c1d1f',
    hsv: { a: undefined, h: 220, s: 9.67741935483871, v: 12.156862745098039 },
    rgb: { a: undefined, b: 31, g: 29, r: 28 },
  },
  {
    hex: '#2a61ee',
    hsv: {
      a: undefined,
      h: 223.16326530612244,
      s: 82.3529411764706,
      v: 93.33333333333333,
    },
    rgb: { a: undefined, b: 238, g: 97, r: 42 },
  },
  {
    hex: '#28ec31',
    hsv: {
      a: undefined,
      h: 122.75510204081634,
      s: 83.05084745762711,
      v: 92.54901960784314,
    },
    rgb: { a: undefined, b: 49, g: 236, r: 40 },
  },
  {
    hex: '#eb362a',
    hsv: {
      a: undefined,
      h: 3.7305699481865284,
      s: 82.1276595744681,
      v: 92.15686274509804,
    },
    rgb: { a: undefined, b: 42, g: 54, r: 235 },
  },
  {
    hex: '#f2a612',
    hsv: {
      a: undefined,
      h: 39.642857142857146,
      s: 92.56198347107438,
      v: 94.90196078431372,
    },
    rgb: { a: undefined, b: 18, g: 166, r: 242 },
  },
]

const ColorPicker = ({ className, color, setColor }) => {
  const variants = useMemo(
    () => ({
      initial: {
        x: 300,
      },
      animate: {
        x: 0,
        transition: {
          duration: 0.3,
        },
      },
      exit: {
        x: 300,
      },
    }),
    []
  )
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="initial"
    >
      <Picker
        width={240}
        height={240}
        color={color}
        onChange={setColor}
        hideHSV
        hideRGB
        hideHEX
      />
      <div className="or_divider">
        <div className="divider" />
        <span className="text_or">Or</span>
        <div className="divider" />
      </div>
      <div className="custom_colors">
        {cutomColors.map((elm, index) => (
          <button
            className={`color_wrapper ${elm.hex === color.hex && 'selected'}`}
            onClick={() => setColor(elm)}
            key={index}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default memo(ColorPicker)
