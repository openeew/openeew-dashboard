import React, { useContext } from 'react'
import { ToastNotification } from 'carbon-components-react'
import AppContext from '../../context/app'

const Toasts = () => {
  const { toasts, removeToast } = useContext(AppContext)

  return (
    <div className="toasts__toastsContainer">
      {toasts.map((toast, i) => (
        <ToastNotification
          key={`toast-${i}`}
          kind={toast.kind}
          caption={toast.caption}
          subtitle={toast.subtitle}
          timeout={0}
          hideCloseButton={false}
          title={toast.title}
          onClose={() => removeToast(i)}
        />
      ))}
    </div>
  )
}

export default Toasts
