import React, { useState, useEffect } from "react";
import { Icon } from "antd";

const Controls = ({ note }) => {
  const [hashtags, setHashtags] = useState([
    "#Web",
    "#WebDevelopment",
    "#Tech",
    "#Coding",
    "#Developer"
  ]);

  useEffect(() => {
    if (!note) return;
    setHashtags(prev => [...prev, note.tags.map(tag => `#${tag}`)]);
  }, [note]);

  const copyToClipboard = () => {
    const textField = document.createElement("textarea");
    textField.innerText = hashtags.join(" ");
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  return (
    <div>
      <div className="flex space-between align-center">
        <h4>Hashtags</h4>
        <Icon onClick={copyToClipboard} type="copy" />
      </div>
      <div>
        {note &&
          hashtags.map(tag => (
            <span className="hashtag" key={tag}>
              {tag}
            </span>
          ))}
      </div>
    </div>
  );
};

export default Controls;
