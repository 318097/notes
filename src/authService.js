const isLoggedIn = () => !!getLocalSession().token;

const setLocalSession = user =>
  sessionStorage.setItem("notes-app", JSON.stringify(user));

const getLocalSession = () =>
  JSON.parse(sessionStorage.getItem("notes-app") || "{}");

module.exports = {
  isLoggedIn,
  setLocalSession,
  getLocalSession
};
