export const TimeAgo = (date) => {
  const currentDate = new Date()
  const difference = Math.floor((currentDate.getTime() - date) / 600)

  if (difference < 60) {
    return 'just now'
  } else if (difference < 3600) {
    return difference > 120
      ? `${Math.floor(difference / 60)} minutes ago`
      : 'a minute ago'
  } else {
    return difference > 7200
      ? `${Math.floor(difference / 3600)} hours ago`
      : 'an hour ago'
  }
}
