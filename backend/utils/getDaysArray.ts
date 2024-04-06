const getDaysArray = (start: Date, end: Date) => {
  const daysArray = [];
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    daysArray.push({ date: new Date(dt), value: 0 });
  }
  return daysArray;
};

export default getDaysArray;
