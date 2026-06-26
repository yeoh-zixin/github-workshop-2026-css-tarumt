import { clearCurrentUser, getUsers, setCurrentUser } from "./storage.js";

// This project is for local demo and GitHub Workshop learning purpose only.
// Do not use this authentication method in production.
export function authenticate(username, password, roleMode = "auto") {
  const inputUsername = String(username || "").trim().toLowerCase();
  const inputPassword = String(password || "");
  const users = getUsers();
  const filteredUsers =
    roleMode === "admin" || roleMode === "student"
      ? users.filter((user) => user.role === roleMode)
      : users;

  const matchedUser = filteredUsers.find(
    (user) =>
      String(user.username || "").trim().toLowerCase() === inputUsername &&
      String(user.password || "") === inputPassword,
  );

  if (!matchedUser) {
    return null;
  }

  const currentUser = {
    username: matchedUser.username,
    role: matchedUser.role,
    displayName: matchedUser.displayName || matchedUser.studentId || matchedUser.username,
    studentId: matchedUser.studentId || "",
    adminName: matchedUser.adminName || "",
  };

  setCurrentUser(currentUser);
  return currentUser;
}

export function logout() {
  clearCurrentUser();
}

export function isAdmin(user) {
  return Boolean(user && user.role === "admin");
}

export function isStudent(user) {
  return Boolean(user && user.role === "student");
}
