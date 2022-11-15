export interface ValueData {
  timestamp: Date
  value: number
}

export enum GroupBy {
  Hour = 'hour',
  Day = 'day',
  Minute = 'minute',
  Second = 'second'
}
const groupData = (data: ValueData[], groupBy: GroupBy) => {
  // Group the data by the date value
  const map = new Map<number, { timestamp: Date; value: number }[]>()
  data.forEach((item) => {
    const key = getDateValue(item.timestamp, groupBy)

    if (map.get(key)) {
      map.get(key)?.push(item)
    } else {
      map.set(key, [item])
    }
  })
  return map
}

const getDateValue = (date: Date, groupBy: GroupBy) => {
  // The date value will be used as the key for the map
  switch (groupBy) {
    case 'hour':
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours()
      ).valueOf()
    case 'day':
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).valueOf()
    case 'minute':
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes()
      ).valueOf()
    default:
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ).valueOf()
  }
}

const calculateAverage = (data: ValueData[], groupBy: GroupBy) => {
  // Group the data by the date value
  const groupedData = groupData(data, groupBy)

  // Calculate the average for each group
  const avg = [...groupedData].map((x) => {
    const dateValue = x[0] // valueOf() of the date
    const items = x[1] // {timestamp, value}

    return {
      timestamp: new Date(Number(dateValue)),
      value:
        items.map((item) => item.value).reduce((acc, val) => acc + val) *
        (1.0 / items.length)
    }
  })
  return avg
}

export default calculateAverage
