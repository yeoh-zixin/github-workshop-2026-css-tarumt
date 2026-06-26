export const STORAGE_KEYS = {
  users: "gw2026_users",
  students: "gw2026_students",
  currentUser: "gw2026_current_user",
  initialized: "gw2026_initialized",
};

function readArray(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  return readArray(STORAGE_KEYS.users);
}

export function saveUsers(users) {
  writeArray(STORAGE_KEYS.users, users);
}

export function getStudents() {
  return readArray(STORAGE_KEYS.students);
}

export function saveStudents(students) {
  writeArray(STORAGE_KEYS.students, students);
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.currentUser);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
}

export function findUserByUsername(username) {
  const needle = String(username || "").trim().toLowerCase();
  return getUsers().find((user) => String(user.username || "").trim().toLowerCase() === needle) || null;
}

export function findStudentById(studentId) {
  const needle = String(studentId || "").trim().toLowerCase();
  return getStudents().find((student) => String(student.studentId || "").trim().toLowerCase() === needle) || null;
}

export function sanitizeText(value) {
  return String(value ?? "").trim();
}
