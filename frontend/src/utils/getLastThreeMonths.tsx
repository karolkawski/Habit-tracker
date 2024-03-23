const getLastThreeMonths = (currentTime: Date) => {
  const lastThreeMonths = [];

  for (let i = 2; i >= 0; i--) {
    let month = currentTime.getMonth() - i;
    let year = currentTime.getFullYear();

    if (month < 0) {
      month += 12;
      year--;
    }

    const date = new Date(year, month, 1);
    lastThreeMonths.push({
      month: month,
      year: date.getFullYear(),
    });
  }

  return lastThreeMonths;
};

export default getLastThreeMonths;
