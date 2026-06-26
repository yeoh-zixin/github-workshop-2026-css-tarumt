export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderToastContainer() {
  return `<div class="toast-container position-fixed top-0 end-0 p-3" id="toastArea"></div>`;
}

export function renderLoginPage({ generatedAdminHint = "" } = {}) {
  return `
    <section class="container py-5">
      <div class="row justify-content-center align-items-center g-4 py-lg-5">
        <div class="col-lg-6">
          <div class="hero-panel rounded-4 p-4 p-lg-5">
            <span class="hero-badge mb-3">GitHub Workshop 2026</span>
            <h1 class="display-5 page-title fw-bold mb-3">Student Record Management Demo</h1>
            <p class="lead mini-muted mb-4">
              A local-only CRUD website built with HTML, CSS, Bootstrap 5, vanilla JavaScript, and localStorage.
            </p>
            <div class="alert alert-primary border-0 mb-0">
              <strong>Demo purpose only.</strong> This project is for GitHub workshop learning and should not be used for real authentication.
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="surface-card rounded-4 p-4 p-lg-5">
            <h2 class="h4 fw-bold mb-3">Login</h2>
            <p class="mini-muted mb-4">Use the demo credentials below or any local admin generated from the batch script.</p>
            <form id="loginForm" class="vstack gap-3">
              <div>
                <label class="form-label" for="roleMode">Role</label>
                <select id="roleMode" class="form-select">
                  <option value="auto" selected>Auto detect</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label class="form-label" for="loginUsername">Username / Student ID</label>
                <input class="form-control" id="loginUsername" name="username" autocomplete="username" required />
              </div>
              <div>
                <label class="form-label" for="loginPassword">Password</label>
                <input class="form-control" id="loginPassword" name="password" type="password" autocomplete="current-password" required />
              </div>
              <button class="btn btn-primary btn-lg" type="submit">Login</button>
            </form>
            <div class="mt-4">
              <div class="small text-uppercase fw-bold text-secondary mb-2">Demo credentials</div>
              <div class="card border-0 bg-light-subtle mb-3">
                <div class="card-body small">
                  <div><strong>Admin:</strong> admin / admin123</div>
                  <div><strong>Student:</strong> 25WMR00001 / student123</div>
                  ${generatedAdminHint ? `<div class="mt-2"><strong>Generated admin:</strong> ${escapeHtml(generatedAdminHint)}</div>` : ""}
                </div>
              </div>
              <p class="small mini-muted mb-0">If programme loading fails in your browser, run the site with a static server such as VS Code Live Server.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderAdminDashboard({ adminName, programmes, students }) {
  const programmeOptions = programmes
    .map((programme) => `<option value="${escapeHtml(programme.name)}">${escapeHtml(programme.name)}</option>`)
    .join("");

  const rows = students
    .map(
      (student) => `
        <tr>
          <td>${escapeHtml(student.name)}</td>
          <td>${escapeHtml(student.studentId)}</td>
          <td>${escapeHtml(student.programme)}</td>
          <td>${escapeHtml(student.group)}</td>
          <td><span class="code-chip">${escapeHtml(student.password)}</span></td>
          <td class="text-nowrap">
            <button class="btn btn-sm btn-outline-primary me-2" data-action="edit-student" data-student-id="${escapeHtml(student.studentId)}">Edit</button>
            <button class="btn btn-sm btn-outline-danger" data-action="delete-student" data-student-id="${escapeHtml(student.studentId)}">Delete</button>
          </td>
        </tr>
      `,
    )
    .join("");

  return `
    <nav class="navbar navbar-expand-lg dashboard-nav sticky-top">
      <div class="container">
        <span class="navbar-brand fw-bold">GitHub Workshop 2026</span>
        <div class="ms-auto d-flex gap-2">
          <button class="btn btn-outline-secondary" id="resetDemoBtn" type="button">Reset Demo Data</button>
          <button class="btn btn-outline-dark" id="logoutBtn" type="button">Logout</button>
        </div>
      </div>
    </nav>
    <section class="container py-4 py-lg-5">
      <div class="row g-4 mb-4">
        <div class="col-12">
          <div class="surface-card rounded-4 p-4 p-lg-5">
            <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 align-items-lg-center">
              <div>
                <span class="hero-badge mb-3">Admin Dashboard</span>
                <h1 class="h2 fw-bold mb-2">Welcome, ${escapeHtml(adminName || "Admin")}</h1>
                <p class="mini-muted mb-0">Manage students locally with no backend and no database.</p>
              </div>
              <button class="btn btn-success" id="exportCsvBtn" type="button">Export CSV</button>
            </div>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="surface-card rounded-4 p-4 h-100">
            <h2 class="h5 fw-bold mb-3" id="studentFormTitle">Add Student Record</h2>
            <form id="studentForm" class="vstack gap-3">
              <input type="hidden" id="editingStudentId" name="editingStudentId" />
              <div>
                <label class="form-label" for="studentName">Name</label>
                <input class="form-control" id="studentName" name="name" required />
              </div>
              <div>
                <label class="form-label" for="studentId">Student ID</label>
                <input class="form-control" id="studentId" name="studentId" required />
              </div>
              <div>
                <label class="form-label" for="studentProgramme">Programme</label>
                <select class="form-select" id="studentProgramme" name="programme" required>
                  <option value="">Loading programmes...</option>
                  ${programmeOptions}
                </select>
              </div>
              <div>
                <label class="form-label" for="studentGroup">Group</label>
                <input class="form-control" id="studentGroup" name="group" required />
              </div>
              <div>
                <label class="form-label" for="studentPassword">Password</label>
                <div class="input-group">
                  <input class="form-control" id="studentPassword" name="password" required />
                  <button class="btn btn-outline-secondary" type="button" id="generatePasswordBtn">Generate Password</button>
                </div>
              </div>
              <button class="btn btn-primary" type="submit" id="saveStudentBtn">Save Student</button>
              <button class="btn btn-outline-secondary d-none" type="button" id="cancelEditBtn">Cancel Edit</button>
            </form>
          </div>
        </div>
        <div class="col-lg-7">
          <div class="surface-card rounded-4 p-4 h-100">
            <h2 class="h5 fw-bold mb-3">Student Records</h2>
            <div class="table-responsive">
              <table class="table align-middle table-hover mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Programme</th>
                    <th>Group</th>
                    <th>Password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="studentTableBody">${rows || `<tr><td colspan="6" class="text-center py-4 text-secondary">No students found.</td></tr>`}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="modal fade" id="studentCreatedModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Student account created successfully</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="mb-2"><strong>Student ID:</strong> <span id="createdStudentId"></span></p>
            <p class="mb-3"><strong>Password:</strong> <span id="createdStudentPassword"></span></p>
            <button class="btn btn-outline-primary" type="button" id="copyLoginDetailsBtn">Copy Login Details</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderStudentDashboard(student) {
  return `
    <nav class="navbar navbar-expand-lg dashboard-nav sticky-top">
      <div class="container">
        <span class="navbar-brand fw-bold">GitHub Workshop 2026</span>
        <div class="ms-auto d-flex gap-2">
          <button class="btn btn-outline-dark" id="logoutBtn" type="button">Logout</button>
        </div>
      </div>
    </nav>
    <section class="container py-4 py-lg-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-xl-7">
          <div class="surface-card rounded-4 p-4 p-lg-5">
            <span class="hero-badge mb-3">Student Dashboard</span>
            <h1 class="h2 fw-bold mb-2">Welcome, ${escapeHtml(student.name)}</h1>
            <p class="mini-muted mb-4">You can only view your own details in this demo.</p>
            <dl class="row detail-list mb-0">
              <dt class="col-sm-4">Name</dt>
              <dd class="col-sm-8">${escapeHtml(student.name)}</dd>
              <dt class="col-sm-4">Student ID</dt>
              <dd class="col-sm-8">${escapeHtml(student.studentId)}</dd>
              <dt class="col-sm-4">Programme</dt>
              <dd class="col-sm-8">${escapeHtml(student.programme)}</dd>
              <dt class="col-sm-4">Group</dt>
              <dd class="col-sm-8">${escapeHtml(student.group)}</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderMessagePage(message, kind = "info") {
  return `
    <section class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-7">
          <div class="alert alert-${kind} shadow-sm">${escapeHtml(message)}</div>
        </div>
      </div>
    </section>
  `;
}
