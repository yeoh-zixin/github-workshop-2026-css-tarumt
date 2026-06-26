function escapeCsvValue(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function buildStudentCsv(students) {
  const header = ["Name", "Student ID", "Programme", "Group", "Password"];
  const rows = students.map((student) => [
    student.name,
    student.studentId,
    student.programme,
    student.group,
    student.password,
  ]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\r\n");
}

export function downloadCsv(filename, csvText) {
  const blob = new Blob(["\ufeff", csvText], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadStudentRecordsCsv(students) {
  const csvText = buildStudentCsv(students);
  downloadCsv("student_records.csv", csvText);
}
