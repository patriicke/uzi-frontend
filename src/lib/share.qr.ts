export const QRLINK =
  "https://chart.apis.google.com/chart?cht=qr&chs=300x300&chld=L|0&chl=";

export const ChangeLinkToQRCode = (url: string) => {
  return `${QRLINK}${url}`;
};
