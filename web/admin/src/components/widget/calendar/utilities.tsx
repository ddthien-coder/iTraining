import { Label, MonthLabel } from './ICalendar'

export function createWeekDayLabels() {
  const dayLabels: Array<Label> = [
    { name: 'sun', label: 'Sun' },
    { name: 'mon', label: 'Mon' },
    { name: 'tue', label: 'Tue' },
    { name: 'wed', label: 'Wed' },
    { name: 'thu', label: 'Thu' },
    { name: 'fri', label: 'Fri' },
    { name: 'sat', label: 'Sat' }
  ];
  return dayLabels;
}

export function createMonthLabels() {
  const monthLabels: Array<MonthLabel> = [
    { name: 'january', label: "January", month: 0 },
    { name: 'february', label: "February", month: 1 },
    { name: 'march', label: "March", month: 2 },
    { name: 'april', label: "April", month: 3 },
    { name: 'may', label: "May", month: 4 },
    { name: 'june', label: 'June', month: 5 },
    { name: 'july', label: "July", month: 6 },
    { name: 'august', label: "August", month: 7 },
    { name: 'september', label: "September", month: 8 },
    { name: 'october', label: "October", month: 9 },
    { name: 'novermber', label: "November", month: 10 },
    { name: 'december', label: "December", month: 11 }
  ];
  return monthLabels;
}

