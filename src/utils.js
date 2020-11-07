import { message } from "antd";
import _ from "lodash";
import colors from "@codedrops/react-ui";

export const generateSlug = ({ title = "", seperator = "-", prevSlug }) => {
  const slug = title
    .trim()
    .replace(/\s+/gi, seperator)
    .replace(/[^a-zA-Z0-9\-\s]/gi, "")
    .toLowerCase();
  const timestamp = prevSlug
    ? prevSlug.split(seperator).pop()
    : new Date().getTime();
  return slug ? `${slug}${seperator}${timestamp}` : "";
};

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

export const generateNewResourceId = (note, index) =>
  `R${note.index || index}-${note.slug}-${
    _.get(note, "resources.length", 0) + 1
  }`;

export const extractTagCodes = (tags = []) =>
  _.reduce(
    tags,
    (acc, { label, color }) => ({
      ...acc,
      [label]: color,
    }),
    { uncategorized: colors.red }
  );
