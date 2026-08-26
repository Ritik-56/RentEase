export const getUser = () => JSON.parse(localStorage.getItem("rentease_user"));

export const setUser = (user) => localStorage.setItem("rentease_user", JSON.stringify(user));

export const clearUser = () => localStorage.removeItem("rentease_user");
