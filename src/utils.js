import { message } from "antd";
import _ from "lodash";
import colors from "@codedrops/react-ui";

export const copyToClipboard = (text) => {
  const textField = document.createElement("textarea");
  textField.innerHTML = text;
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
  return newIndex >= 0 && newIndex < data.length ? data[newIndex] : null;
};

export const extractTagCodes = (tags = []) =>
  _.reduce(
    tags,
    (acc, { label, color }) => ({
      ...acc,
      [label]: color,
    }),
    { uncategorized: colors.red }
  );

export const generateSlug = ({ title = "", seperator = "-", prevSlug }) => {
  const slug = title
    .trim()
    .replace(/-/, " ")
    .replace(/\//, "-")
    .replace(/&/, "and")
    .replace(/[^a-zA-Z0-9\-\s]/gi, "")
    .replace(/\s+/gi, seperator)
    .toLowerCase();
  const timestamp = prevSlug
    ? prevSlug.split(seperator).pop()
    : new Date().getTime();

  return slug ? `${slug}${seperator}${timestamp}` : "";
};
