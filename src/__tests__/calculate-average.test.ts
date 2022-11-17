import calculateAverage, { GroupBy } from '../utils/calculate-average'
import { expect, test } from '@jest/globals'
// ***********************
// Test average by days
// ***********************

const dataDay = [
  { timestamp: new Date(2019, 1, 11, 12, 31, 1, 10), value: 1 },
  { timestamp: new Date(2019, 1, 11, 12, 32, 2, 12), value: 2 },
  { timestamp: new Date(2019, 1, 11, 13, 35, 3, 16), value: 3 },
  { timestamp: new Date(2019, 1, 11, 13, 37, 4, 18), value: 4 },
  { timestamp: new Date(2019, 1, 12, 13, 35, 1, 20), value: 5 },
  { timestamp: new Date(2019, 1, 12, 13, 40, 2, 25), value: 6 },
  { timestamp: new Date(2019, 1, 12, 13, 45, 1, 30), value: 7 },
  { timestamp: new Date(2019, 1, 12, 13, 40, 3, 50), value: 8 },
  { timestamp: new Date(2019, 1, 13, 14, 50, 1, 30), value: 9 }
]

const resultDay = [
  {
    timestamp: new Date('2019-02-10T23:00:00.000Z'),
    value: 2.5
  },
  {
    timestamp: new Date('2019-02-11T23:00:00.000Z'),
    value: 6.5
  },
  { timestamp: new Date('2019-02-12T23:00:00.000Z'), value: 9 }
]

test('day average', () => {
  expect(calculateAverage(dataDay, GroupBy.Day)).toEqual(resultDay)
})

// ***********************
// Test average by hours
// ***********************

const hourData = [
  { timestamp: new Date(2019, 1, 11, 12, 30), value: 1 },
  { timestamp: new Date(2019, 1, 11, 12, 45), value: 2 },
  { timestamp: new Date(2019, 1, 11, 13, 0), value: 3 },
  { timestamp: new Date(2019, 1, 11, 13, 15), value: 4 },
  { timestamp: new Date(2019, 1, 11, 13, 30), value: 5 },
  { timestamp: new Date(2019, 1, 11, 13, 45), value: 6 },
  { timestamp: new Date(2019, 1, 11, 14, 0), value: 7 },
  { timestamp: new Date(2019, 1, 11, 14, 15), value: 8 },
  { timestamp: new Date(2019, 1, 11, 14, 30), value: 9 },
  { timestamp: new Date(2019, 1, 11, 14, 45), value: 10 },
  { timestamp: new Date(2019, 1, 11, 15, 0), value: 11 },
  { timestamp: new Date(2019, 1, 11, 15, 15), value: 12 },
  { timestamp: new Date(2019, 1, 11, 15, 30), value: 13 },
  { timestamp: new Date(2019, 1, 11, 15, 45), value: 14 },
  { timestamp: new Date(2019, 1, 11, 16, 0), value: 15 },
  { timestamp: new Date(2019, 1, 11, 16, 15), value: 16 }
]

const resultHours = [
  {
    timestamp: new Date('2019-02-11T11:00:00.000Z'),
    value: 1.5
  },
  {
    timestamp: new Date('2019-02-11T12:00:00.000Z'),
    value: 4.5
  },
  {
    timestamp: new Date('2019-02-11T13:00:00.000Z'),
    value: 8.5
  },
  {
    timestamp: new Date('2019-02-11T14:00:00.000Z'),
    value: 12.5
  },
  {
    timestamp: new Date('2019-02-11T15:00:00.000Z'),
    value: 15.5
  }
]

test('hour average', () => {
  expect(calculateAverage(hourData, GroupBy.Hour)).toEqual(resultHours)
})

// ***********************
// Test average by minutes
// ***********************

const minutesData = [
  { timestamp: new Date(2019, 1, 11, 12, 31, 1, 10), value: 1 },
  { timestamp: new Date(2019, 1, 11, 12, 31, 2, 12), value: 2 },
  { timestamp: new Date(2019, 1, 11, 12, 31, 3, 16), value: 3 },
  { timestamp: new Date(2019, 1, 11, 13, 37, 4, 18), value: 4 },
  { timestamp: new Date(2019, 1, 11, 13, 37, 1, 20), value: 5 },
  { timestamp: new Date(2019, 1, 11, 13, 40, 2, 25), value: 6 },
  { timestamp: new Date(2019, 1, 11, 13, 40, 1, 30), value: 7 },
  { timestamp: new Date(2019, 1, 11, 14, 40, 3, 50), value: 8 },
  { timestamp: new Date(2019, 1, 12, 14, 50, 1, 30), value: 9 }
]

const resultMinutes = [
  { timestamp: new Date('2019-02-11T11:31:00.000Z'), value: 2 },
  {
    timestamp: new Date('2019-02-11T12:37:00.000Z'),
    value: 4.5
  },
  {
    timestamp: new Date('2019-02-11T12:40:00.000Z'),
    value: 6.5
  },
  { timestamp: new Date('2019-02-11T13:40:00.000Z'), value: 8 },
  { timestamp: new Date('2019-02-12T13:50:00.000Z'), value: 9 }
]

test('minutes average', () => {
  expect(calculateAverage(minutesData, GroupBy.Minute)).toEqual(resultMinutes)
})

// ***********************
// Test average by seconds
// ***********************

const secondsData = [
  { timestamp: new Date(2019, 1, 11, 12, 30, 1, 10), value: 1 },
  { timestamp: new Date(2019, 1, 11, 12, 30, 1, 12), value: 2 },
  { timestamp: new Date(2019, 1, 11, 13, 35, 1, 16), value: 3 },
  { timestamp: new Date(2019, 1, 11, 13, 35, 1, 18), value: 4 },
  { timestamp: new Date(2019, 1, 11, 13, 35, 1, 20), value: 5 },
  { timestamp: new Date(2019, 1, 11, 13, 40, 1, 25), value: 6 },
  { timestamp: new Date(2019, 1, 11, 13, 40, 1, 30), value: 7 },
  { timestamp: new Date(2019, 1, 11, 13, 40, 1, 50), value: 8 },
  { timestamp: new Date(2019, 1, 11, 14, 50, 1, 30), value: 9 }
]

const resultSeconds = [
  {
    timestamp: new Date('2019-02-11T11:30:01.000Z'),
    value: 1.5
  },
  { timestamp: new Date('2019-02-11T12:35:01.000Z'), value: 4 },
  { timestamp: new Date('2019-02-11T12:40:01.000Z'), value: 7 },
  { timestamp: new Date('2019-02-11T13:50:01.000Z'), value: 9 }
]

test('seconds average', () => {
  expect(calculateAverage(secondsData, GroupBy.Second)).toEqual(resultSeconds)
})
