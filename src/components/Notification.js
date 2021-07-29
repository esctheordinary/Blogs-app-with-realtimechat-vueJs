import { Notify } from 'quasar'

export const dispatchNotification = (message,color) => {
    Notify.create({
        message: message,
        color: color
      })
}

