const isLoggedIn = () => !!getLocalSession().token;

const setLocalSession = session =>
  sessionStorage.setItem("notes-app", JSON.stringify(session));

const getLocalSession = () =>
  JSON.parse(sessionStorage.getItem("notes-app") || "{}");

module.exports = {
  isLoggedIn,
  setLocalSession,
  getLocalSession
};
