import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

export const timeAgo = new TimeAgo('en-US')

export const formatDate = (date) => {
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
  return `${da} ${mo}, ${ye}`
}

export const formatTime = (date) => {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  })
    .format(date)
    .toLowerCase()
}

export const filterTime = (date, timeFilter) => {
  return new Date().getTime() - date <= (timeFilter.timePeriod + 86400) * 1000
}

export const formatCoordinates = (coordinates) =>
  `${coordinates[1].toFixed(2)}°N, ${coordinates[0].toFixed(2)}°E`

export const keyboardOnlySubmit = (e, callback) => {
  switch (e.keyCode) {
    case 32: // space
    case 13: // enter
      callback()
      break
    default:
      break
  }
}
