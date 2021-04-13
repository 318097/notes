const isProd = process.env.REACT_APP_NODE_ENV === "production";

const config = {
  LIMIT: 25,
  SERVER_URL: isProd
    ? "https://bubblegum-server.herokuapp.com/api"
    : "http://localhost:7000/api",
};

export default config;
