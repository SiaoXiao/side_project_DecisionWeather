import dayjs from 'dayjs';

export const formatHour = (isoTime: string): string => {
  if (!isoTime) return '';
  return dayjs(isoTime).format('MM/DD HH:mm');
};
