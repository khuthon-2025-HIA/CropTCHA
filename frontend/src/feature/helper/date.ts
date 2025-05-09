export const diffDate = (start: Date, end: Date): 1 | 0 | -1 => {
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const startDate = start.getDate();

  const endYear = end.getFullYear();
  const endMonth = end.getMonth();
  const endDate = end.getDate();

  const yearDiff = endYear - startYear;
  const monthDiff = endMonth - startMonth;
  const dateDiff = endDate - startDate;

  if (yearDiff !== 0) return yearDiff > 0 ? 1 : -1;
  if (monthDiff !== 0) return monthDiff > 0 ? 1 : -1;
  if (dateDiff !== 0) return dateDiff > 0 ? 1 : -1;

  return 0;
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};
