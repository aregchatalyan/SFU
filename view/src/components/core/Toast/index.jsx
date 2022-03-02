import { toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import style from './style.module.scss'

export { default as ErrorToast } from './ErrorToast'
export { ConnectedToast } from './ConnectedToast'

export const toastify = (coponent) => {
  toast(coponent, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    closeButton: false,
    transition: Slide,
    style: {
      borderRadius: '8px',
      background: '#fcf6f6',
      minHeight: 48,
    },
    className: style.toastWrapper,
  })
}
