import { authenticate, isAdmin, isStudent, logout } from "./auth.js";
import { downloadStudentRecordsCsv } from "./csv.js";
import {
  findStudentById,
  getCurrentUser,
  getStudents,
  getUsers,
  saveStudents,
  saveUsers,
  setCurrentUser,
  sanitizeText,
} from "./storage.js";
import {
  renderAdminDashboard,
  renderLoginPage,
  renderMessagePage,
  renderStudentDashboard,
  renderToastContainer,
} from "./ui.js";

const app = document.getElementById("app");
let programmes = [];
let createdDetails = { studentId: "", password: "" };

function generatePassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const suffix = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  return `GITHUB-${suffix}`;
}

function renderApp() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    app.innerHTML = renderLoginPage({ generatedAdminHint: getGeneratedAdminHint() }) + renderToastContainer();
    bindLoginEvents();
    return;
  }

  if (isAdmin(currentUser)) {
    app.innerHTML = renderAdminDashboard({
      adminName: currentUser.displayName || currentUser.adminName || currentUser.username,
      programmes,
      students: getStudents(),
    }) + renderToastContainer();
    bindAdminEvents();
    return;
  }

  if (isStudent(currentUser)) {
    const student = findStudentById(currentUser.studentId) || getStudents().find((item) => item.studentId === currentUser.username);
    app.innerHTML = renderStudentDashboard(student || { name: currentUser.displayName, studentId: currentUser.studentId, programme: "", group: "" }) + renderToastContainer();
    bindLogoutOnly();
    return;
  }

  app.innerHTML = renderMessagePage("Unable to determine the current user role.", "warning") + renderToastContainer();
}

function getGeneratedAdminHint() {
  const generatedAdmin = getUsers().find((user) => user.role === "admin" && user.username !== "admin");
  return generatedAdmin ? `${generatedAdmin.username} / ${generatedAdmin.password}` : "";
}

function showToast(message, kind = "primary") {
  const toastArea = document.getElementById("toastArea");
  if (!toastArea) {
    return;
  }

  const toastId = `toast-${Date.now()}`;
  toastArea.innerHTML = `
    <div id="${toastId}" class="toast text-bg-${kind} border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  const toastElement = document.getElementById(toastId);
  const toast = bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 3500 });
  toast.show();
}

async function loadProgrammes() {
  try {
    const response = await fetch("config/programmes.json", { cache: "no-store" });
    if (!response.ok) {
      programmes = [];
      return;
    }
    programmes = await response.json();
  } catch {
    programmes = [];
  }
}

function ensureUniqueStudentId(studentId, editingId = "") {
  return !getStudents().some((student) => student.studentId === studentId && student.studentId !== editingId);
}

function upsertLoginForStudent(student, previousStudentId = "") {
  const users = getUsers();
  const previousId = sanitizeText(previousStudentId);
  const existingIndex = users.findIndex((user) => user.role === "student" && user.studentId === student.studentId);
  const previousIndex = previousId
    ? users.findIndex((user) => user.role === "student" && user.studentId === previousId)
    : -1;
  const loginUser = {
    username: student.studentId,
    password: student.password,
    role: "student",
    studentId: student.studentId,
    displayName: student.name,
  };

  if (existingIndex >= 0) {
    users[existingIndex] = loginUser;
  } else if (previousIndex >= 0) {
    users[previousIndex] = loginUser;
  } else {
    users.push(loginUser);
  }

  const dedupedUsers = users.filter((user, index, list) => {
    if (user.role !== "student") {
      return true;
    }

    return list.findIndex((candidate) => candidate.role === "student" && candidate.studentId === user.studentId) === index;
  });

  saveUsers(dedupedUsers);
}

function removeLoginForStudent(studentId) {
  const users = getUsers().filter((user) => !(user.role === "student" && user.studentId === studentId));
  saveUsers(users);
}

function bindLoginEvents() {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const roleMode = document.getElementById("roleMode").value;
    const username = sanitizeText(formData.get("username"));
    const password = sanitizeText(formData.get("password"));

    const matchedUser = authenticate(username, password, roleMode);
    if (!matchedUser) {
      showToast("Invalid login details.", "danger");
      return;
    }

    renderApp();
  });
}

function bindLogoutOnly() {
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", () => {
    logout();
    renderApp();
  });
}

function populateEditForm(student) {
  document.getElementById("studentFormTitle").textContent = "Edit Student Record";
  document.getElementById("editingStudentId").value = student.studentId;
  document.getElementById("studentName").value = student.name;
  document.getElementById("studentId").value = student.studentId;
  document.getElementById("studentProgramme").value = student.programme;
  document.getElementById("studentGroup").value = student.group;
  document.getElementById("studentPassword").value = student.password;
  document.getElementById("saveStudentBtn").textContent = "Update Student";
  document.getElementById("cancelEditBtn").classList.remove("d-none");
}

function resetStudentForm() {
  const form = document.getElementById("studentForm");
  form.reset();
  document.getElementById("editingStudentId").value = "";
  document.getElementById("studentFormTitle").textContent = "Add Student Record";
  document.getElementById("saveStudentBtn").textContent = "Save Student";
  document.getElementById("cancelEditBtn").classList.add("d-none");
}

function openCreatedStudentModal(student) {
  createdDetails = { studentId: student.studentId, password: student.password };
  document.getElementById("createdStudentId").textContent = student.studentId;
  document.getElementById("createdStudentPassword").textContent = student.password;
  const modalElement = document.getElementById("studentCreatedModal");
  bootstrap.Modal.getOrCreateInstance(modalElement).show();
}

async function copyLoginDetails() {
  const text = `Student ID: ${createdDetails.studentId}\nPassword: ${createdDetails.password}`;
  await navigator.clipboard.writeText(text);
  showToast("Login details copied to clipboard.", "success");
}

function handleStudentSave(event) {
  event.preventDefault();
  const form = document.getElementById("studentForm");
  const formData = new FormData(form);
  const editingStudentId = sanitizeText(formData.get("editingStudentId"));
  const student = {
    name: sanitizeText(formData.get("name")),
    studentId: sanitizeText(formData.get("studentId")),
    programme: sanitizeText(formData.get("programme")),
    group: sanitizeText(formData.get("group")),
    password: sanitizeText(formData.get("password")),
  };

  if (!student.name || !student.studentId || !student.programme || !student.group || !student.password) {
    showToast("Please complete all student fields.", "warning");
    return;
  }

  if (!ensureUniqueStudentId(student.studentId, editingStudentId)) {
    showToast("Student ID already exists.", "danger");
    return;
  }

  const students = getStudents();
  const previousStudent = editingStudentId ? students.find((item) => item.studentId === editingStudentId) : null;
  if (editingStudentId) {
    const index = students.findIndex((item) => item.studentId === editingStudentId);
    if (index >= 0) {
      students[index] = student;
    }
  } else {
    students.push(student);
  }

  saveStudents(students);
  upsertLoginForStudent(student, previousStudent?.studentId || editingStudentId);
  resetStudentForm();
  renderApp();

  if (editingStudentId) {
    showToast("Student record updated successfully.", "success");
    return;
  }

  openCreatedStudentModal(student);
}

function handleStudentTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const studentId = button.dataset.studentId;
  const student = getStudents().find((item) => item.studentId === studentId);
  if (!student) {
    return;
  }

  if (button.dataset.action === "edit-student") {
    populateEditForm(student);
    return;
  }

  if (button.dataset.action === "delete-student") {
    const confirmed = window.confirm(`Delete student ${student.name} (${student.studentId})?`);
    if (!confirmed) {
      return;
    }

    saveStudents(getStudents().filter((item) => item.studentId !== studentId));
    removeLoginForStudent(studentId);
    renderApp();
  }
}

function bindAdminEvents() {
  document.getElementById("studentForm").addEventListener("submit", handleStudentSave);
  document.getElementById("generatePasswordBtn").addEventListener("click", () => {
    document.getElementById("studentPassword").value = generatePassword();
  });
  document.getElementById("cancelEditBtn").addEventListener("click", resetStudentForm);
  document.getElementById("exportCsvBtn").addEventListener("click", () => downloadStudentRecordsCsv(getStudents()));
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logout();
    renderApp();
  });
  document.getElementById("resetDemoBtn").addEventListener("click", () => {
    const confirmed = window.confirm("Reset all local demo data?");
    if (!confirmed) {
      return;
    }
    window.resetDemoData();
  });
  document.getElementById("copyLoginDetailsBtn").addEventListener("click", copyLoginDetails);
  document.getElementById("studentTableBody").addEventListener("click", handleStudentTableClick);
}

await loadProgrammes();
renderApp();
