export function timeFormat(time, detail=true) {
  const t = new Date(time)
  if (isNaN(t.getTime())) return ''
  const y = t.getFullYear()
  const m = formatting(t.getMonth() + 1)
  const day = formatting(t.getDate())
  const h = formatting(t.getHours())
  const mi = formatting(t.getMinutes())
  if (detail) {
    return `${y}-${m}-${day} ${h}:${mi}`
  } else {
    return `${y}-${m}-${day}`
  }
}

function formatting(num) {
  return num >= 10 ? num : '0' + num
}
