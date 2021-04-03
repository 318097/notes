import { message } from "antd";
import _ from "lodash";
import colors from "@codedrops/react-ui";
import hljs from "highlight.js";
import markdown from "markdown-it";
import * as lib from "./lib/basic";

export const md = markdown({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ""; // use external default escaping
  },
});

export const copyToClipboard = (text) => {
  lib.copyToClipboard(text);
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
