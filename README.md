# GitHub Workshop 2026 CRUD Demo

A simple local-only student record management website for GitHub Workshop 2026. It is built for teaching repository structure, `.gitignore`, releases, README files, and basic web project organization.

This project uses only:
- HTML
- CSS
- Bootstrap 5
- Vanilla JavaScript
- `localStorage`

It does not use a backend server, database, Node.js, npm build tools, or front-end frameworks.

## Features

- Admin login
- Student login
- Admin CRUD for student records
- Student view-only dashboard
- Programme list loaded from `config/programmes.json`
- Password generator for new student accounts
- CSV export including passwords
- Automatic local demo data seeding
- Demo reset function
- Optional batch script for generating random admin credentials

## Demo Credentials

Default admin:
- Username: `admin`
- Password: `admin123`

Default student:
- Student ID: `25WMR00001`
- Password: `student123`

Default student record:
- Name: `Ali Tan`
- Programme: `Diploma in Computer Science`
- Group: `DCS1A`

If you run `scripts/generate_random_id.bat`, the project can also read the generated local admin credential file at `config/admin.generated.json` when it exists.

## Folder Structure

```text
github-workshop-crud-demo/
├── index.html
├── README.md
├── .gitignore
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── auth.js
│       ├── storage.js
│       ├── ui.js
│       └── csv.js
├── config/
│   ├── initialize.js
│   ├── programmes.json
│   ├── demo-users.json
│   └── admin.generated.json
└── scripts/
    └── generate_random_id.bat
```

## How It Works

The application stores users and student records in `localStorage` using keys such as:
- `gw2026_users`
- `gw2026_students`
- `gw2026_current_user`
- `gw2026_initialized`

The file `config/initialize.js` seeds the default admin and student data once, then sets the initialization flag so the demo data is not duplicated on reload.

## How To Run Locally

Because the project loads `config/programmes.json` with `fetch()`, open it using a local static server. If you open `index.html` directly and your browser blocks JSON loading, use one of these options:

- VS Code Live Server
- Any simple static file server

## .gitignore Demo

This project ignores `config/admin.generated.json` so each workshop participant can generate their own local admin credentials without committing them.

Ignored examples:
- `config/admin.generated.json`
- `.DS_Store`
- `Thumbs.db`
- `*.log`

## Generate Random Admin Credentials

Run:

```bat
scripts\generate_random_id.bat
```

This creates `config/admin.generated.json` with local admin credentials in a format similar to:

```json
{
  "adminId": "ADM48291",
  "adminName": "Workshop Admin 48291",
  "username": "admin48291",
  "password": "GH-ADM-48291"
}
```

## Reset Demo Data

The admin dashboard includes a reset button that calls `resetDemoData()` and restores the default localStorage data.

## GitHub Release Demo

A simple release flow for this workshop project:

1. Commit your changes to the repository.
2. Create a tag such as `v1.0.0`.
3. Open the repository on GitHub.
4. Go to **Releases**.
5. Click **Draft a new release**.
6. Choose the tag.
7. Write release notes that explain what the demo contains.
8. Publish the release.

This is a good way to show how GitHub releases package a teaching demo separately from the source code.

## Notes

- This authentication is only for workshop learning.
- Do not use this code for production security.
- Student passwords are intentionally included in CSV export for demo purposes.
