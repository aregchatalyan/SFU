import React, { memo } from 'react'
import Icon from '../../Icon'

const CircleButtonCustom = ({
                              onClick,
                              iconName,
                              className,
                              width,
                              height,
                            }) => {
  return (
    <button
      onClick={onClick}
      className={className}
      style={{ cursor: 'pointer' }}
    >
      <Icon name={iconName} width={width} height={height}/>
    </button>
  )
}

export default memo(CircleButtonCustom)
