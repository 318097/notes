import { message } from "antd";

export const generateSlug = (title = "", seperator = "-") =>
  title
    .trim()
    .replace(/[^a-zA-Z0-9\-\s]/gi, "")
    .replace(/\s+/gi, seperator)
    .toLowerCase();

export const copyToClipboard = (text) => {
  const textField = document.createElement("textarea");
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  textField.remove();
  message.info(`Copied - ${text}`);
};

export const getNextNote = ({
  data,
  id,
  increment = 1,
  matchKey = "_id",
} = {}) => {
  const currentNoteIndex = data.findIndex((note) => note[matchKey] === id);
  const newIndex = currentNoteIndex + increment;
  return newIndex >= 0 && newIndex < data.length ? data[newIndex] : {};
};
