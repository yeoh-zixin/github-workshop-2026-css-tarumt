import { saveStudents, saveUsers, STORAGE_KEYS } from "../assets/js/storage.js";

const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123",
  role: "admin",
  displayName: "Demo Admin",
};

const DEFAULT_STUDENT = {
  name: "Ali Tan",
  studentId: "25WMR00001",
  programme: "Diploma in Computer Science",
  group: "DCS1A",
  password: "student123",
};

function buildInitialUsers(extraAdmin = null) {
  const users = [DEFAULT_ADMIN, {
    username: DEFAULT_STUDENT.studentId,
    password: DEFAULT_STUDENT.password,
    role: "student",
    studentId: DEFAULT_STUDENT.studentId,
    displayName: DEFAULT_STUDENT.name,
  }];

  if (extraAdmin && extraAdmin.username && extraAdmin.password) {
    users.push({
      username: String(extraAdmin.username).trim(),
      password: String(extraAdmin.password),
      role: "admin",
      displayName: extraAdmin.adminName || String(extraAdmin.username).trim(),
      adminName: extraAdmin.adminName || String(extraAdmin.username).trim(),
    });
  }

  return users;
}

function readStoredValue(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function seedData() {
  const initialized = localStorage.getItem(STORAGE_KEYS.initialized) === "true";
  if (initialized) {
    return;
  }

  const existingUsers = readStoredValue(STORAGE_KEYS.users, []);
  const existingStudents = readStoredValue(STORAGE_KEYS.students, []);

  const seededUsers = existingUsers.length ? existingUsers : buildInitialUsers();
  const seededStudents = existingStudents.length
    ? existingStudents
    : [DEFAULT_STUDENT];

  saveUsers(seededUsers);
  saveStudents(seededStudents);
  localStorage.setItem(STORAGE_KEYS.initialized, "true");
  localStorage.setItem("githubWorkshopInitialized", "true");
}

export function resetDemoData() {
  localStorage.clear();
  seedData();
  if (typeof window !== "undefined" && typeof window.location !== "undefined") {
    window.location.reload();
  }
}

async function loadOptionalGeneratedAdmin() {
  try {
    const response = await fetch("config/admin.generated.json", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

async function initialize() {
  const generatedAdmin = await loadOptionalGeneratedAdmin();
  const initialized = localStorage.getItem(STORAGE_KEYS.initialized) === "true";
  if (initialized) {
    return;
  }

  const users = buildInitialUsers(generatedAdmin);
  saveUsers(users);
  saveStudents([DEFAULT_STUDENT]);
  localStorage.setItem(STORAGE_KEYS.initialized, "true");
  localStorage.setItem("githubWorkshopInitialized", "true");
}

await initialize();

if (typeof window !== "undefined") {
  window.resetDemoData = resetDemoData;
}
