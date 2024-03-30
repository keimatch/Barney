import dayjs from "dayjs";

export function getFormattedDate(
  unixtime: number,
  format = "YYYY/MM/DD HH:mm:ss"
) {
  return dayjs.unix(unixtime).format(format);
}
