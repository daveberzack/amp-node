const addZero = (str) => {
  return str <= 9 ? "0" + str : str;
};

const getCurrentDatetime = () => {
  const now = new Date();
  const day = addZero(now.getDate());
  const month = addZero(now.getMonth() + 1);
  const year = now.getFullYear();
  const hour = addZero(now.getHours());
  const minute = addZero(now.getMinutes());
  return "" + year + "-" + month + "-" + day + "-" + hour + "-" + minute;
};

const getCurrentDate = () => {
  const now = new Date();
  const day = addZero(now.getDate());
  const month = addZero(now.getMonth() + 1);
  const year = now.getFullYear();
  return "" + year + "-" + month + "-" + day;
};

exports.getCurrentDate = getCurrentDate;
