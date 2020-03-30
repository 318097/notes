const isLoggedIn = () => !!getLocalSession().token;

const setLocalSession = session =>
  localStorage.setItem("notes-app", JSON.stringify(session));

const getLocalSession = () =>
  JSON.parse(localStorage.getItem("notes-app") || "{}");

module.exports = {
  isLoggedIn,
  setLocalSession,
  getLocalSession
};
