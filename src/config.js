const { REACT_APP_NODE_ENV, REACT_APP_SERVER_TYPE } = process.env;

const isProd = REACT_APP_NODE_ENV === "production";

const getServerURL = ({ isProd = false, serverType = "lambda" } = {}) => {
  const connectToLambda = serverType === "lambda";
  const LAMBDA_PROD =
    "https://bubblegum-lambda.netlify.app/.netlify/functions/api";
  const HEROKU_PROD = "https://bubblegum-server.herokuapp.com/api";
  const LOCAL_SERVER = "http://localhost:7000/api";

  if (isProd) return connectToLambda ? LAMBDA_PROD : HEROKU_PROD;

  return LOCAL_SERVER;
};

const config = {
  LIMIT: 25,
  SERVER_URL: getServerURL({ isProd, serverType: REACT_APP_SERVER_TYPE }),
};

export default config;
