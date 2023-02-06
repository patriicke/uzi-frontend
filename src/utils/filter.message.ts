import { data } from "./../data";
export const filterMessage = (word: string): string => {
  return word
    .split(" ")
    .map((current) => {
      if (data.badwords.includes(current.toLowerCase())) {
        let wordLen = current.length;
        return `${current[0]}${Array(wordLen - 1)
          .fill("*")
          .map((ast) => ast)
          .join("")}`;
      } else {
        return current;
      }
    })
    .join(" ");
};

export const verifyQRCodeImage = (image: string): boolean => {
  if (image.includes(`${window.location.origin}/room/join/`)) return true;
  return false;
};
