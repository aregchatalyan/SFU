import React from 'react'
import Icon from '../Icon'
import style from './style.module.scss'

const LoadingButton = ({
                         iconName,
                         text,
                         loadingText,
                         onClick,
                         loading,
                         width,
                         height,
                       }) => {
  return (
    <button
      className={loading ? style.loading_button_loads : style.loading_button}
      onClick={() => {
        !loading && onClick()
      }}
    >
      {!loading ? (
        <Icon name={iconName} width={width || 20} height={height || 20}/>
      ) : (
        <div className={style.loaderWrapper}>
          <div className={style.wave}/>
          <div className={style.wave}/>
          <div className={style.wave}/>
        </div>
      )}
      <span className={style.button_text}>{loading ? loadingText : text}</span>
    </button>
  )
}

export default LoadingButton
