const dateRange = (startDate: string | number | Date, endDate: string | number | Date, steps = 1) => {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateArray.push({ date: new Date(currentDate), value: 0 });
    currentDate.setUTCDate(currentDate.getUTCDate() + steps);
  }

  return dateArray;
};

export default dateRange;
