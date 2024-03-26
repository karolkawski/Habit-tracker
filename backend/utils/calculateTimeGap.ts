const calculateTimeGap = (currentTime: Date, time: string | undefined) => {
  const startDate = new Date(currentTime);

  switch (time) {
    case "1y":
      startDate.setFullYear(currentTime.getFullYear() - 1);
      break;
    case "3m":
      startDate.setMonth(currentTime.getMonth() - 3);
      break;
    case "1m":
      startDate.setMonth(currentTime.getMonth() - 1);
      break;
    case "14d":
      startDate.setDate(currentTime.getDate() - 14);
      break;
    case "7d":
      startDate.setDate(currentTime.getDate() - 7);
      break;
    default:
      break;
  }
  return startDate;
};

export default calculateTimeGap;
