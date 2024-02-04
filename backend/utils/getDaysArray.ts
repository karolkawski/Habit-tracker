const getDaysArray = (start: Date, end: Date) => {
  for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push({ date: new Date(dt), value: 0 });
  }
  return arr;
};

export default getDaysArray;