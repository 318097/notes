export const generateSlug = (title = "") =>
  title
    .trim()
    .replace(/[^a-zA-Z0-9\-\s]/gi, "")
    .replace(/\s/gi, "-")
    .toLowerCase();

export const copyToClipboard = text => {
  const textField = document.createElement("textarea");
  textField.innerText = text;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand("copy");
  textField.remove();
};

export const tagList = [
  { label: "GIT", value: "GIT" },
  { label: "CSS", value: "CSS" },
  { label: "SASS", value: "SASS" },
  { label: "JAVASCRIPT", value: "JAVASCRIPT" },
  { label: "REACT", value: "REACT" }
];
