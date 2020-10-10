const config = {
  LIMIT: 25,
  SERVER_URL: process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL
    : "http://localhost:7000/api",
};

export default config;
