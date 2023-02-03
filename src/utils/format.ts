import { default as dayjs } from "dayjs";

export const format = {
  todayDate: () => dayjs().format("YYYY-MM-DD"),
  humanDate: (value: string) => dayjs(value).format("MMMM D, YYYY"),
  humanDateTime: (value: string) => dayjs(value).format("MMMM D, YYYY HH:mm"),
  dateMonthYear: (value: string) => dayjs(value).format("MM / YYYY"),
  exportHumanDateTime: (value: string) =>
    dayjs(value).format("YYYY-MM-DD HH:mm"),
  exportDateMonthYear: (value: string) => dayjs(value).format("MM/YYYY"),

  currenyWithAmount: (value: number) =>
    value.toLocaleString("RWF", {
      style: "currency",
      currency: "RWF"
    }),

  capitalizeName: (value: string) => {
    const result: string[] = [];

    value
      .split(" ")
      .forEach((element) =>
        result.push(element.charAt(0).toUpperCase() + element.slice(1))
      );
    return result.join(" ");
  },
  formatTime(time: string) {
    let [minutes, seconds] = time.split(":");
    minutes = minutes.padStart(2, "0");
    seconds = seconds.padStart(2, "0");
    return `${minutes}:${seconds}`;
  }
};
