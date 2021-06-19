const { REACT_APP_NODE_ENV, REACT_APP_SERVER_TYPE } = process.env;

const isProd = REACT_APP_NODE_ENV === "production";

const getServerURL = ({ isProd = false, serverType = "heroku" } = {}) => {
  const connectToLambda = serverType === "lambda";

  if (isProd)
    return connectToLambda
      ? null
      : "https://bubblegum-server.herokuapp.com/api";

  return connectToLambda ? null : "http://localhost:7000/api";
};

const config = {
  LIMIT: 25,
  SERVER_URL: getServerURL({ isProd, serverType: REACT_APP_SERVER_TYPE }),
};

export default config;
