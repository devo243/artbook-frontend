import moment from "moment";
/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
export const formatDate = (date: Date): string => moment(date).format("MMMM Do YYYY, h:mm:ss a");
export const timeFromToday = (date: Date) => {
  const currentTime = new Date();
  const oldTime = new Date(date);

  const minsDiff = Math.floor((currentTime.getTime() - oldTime.getTime()) / (1000 * 60));

  if (minsDiff < 60) {
    return `${minsDiff} minutes ago`;
  }

  const hoursDiff = Math.floor(minsDiff / 60);

  if (hoursDiff >= 24) {
    const dayDiff = Math.floor(hoursDiff / 24);

    return `${dayDiff} days ago`;
  } else {
    return `${hoursDiff} hours ago`;
  }
};
