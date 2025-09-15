// script.js - Simple CRUD with localStorage

// DOM elements
const form = document.getElementById('studentForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const rollNoInput = document.getElementById('rollNo');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const tbody = document.getElementById('studentsTableBody');

let students = [];       // array of {firstName, lastName, rollNo}
let isEditing = false;
let editIndex = null;

// Load saved data from localStorage on start
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('students');
  students = saved ? JSON.parse(saved) : [];
  renderTable();
});

// Render table rows from students array
function renderTable() {
  tbody.innerHTML = '';
  if (students.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4" class="text-muted">No records yet</td>`;
    tbody.appendChild(tr);
    return;
  }

  students.forEach((s, i) => {
    const tr = document.createElement('tr');

    const tdFirst = document.createElement('td');
    tdFirst.textContent = s.firstName;
    tr.appendChild(tdFirst);

    const tdLast = document.createElement('td');
    tdLast.textContent = s.lastName;
    tr.appendChild(tdLast);

    const tdRoll = document.createElement('td');
    tdRoll.textContent = s.rollNo;
    tr.appendChild(tdRoll);

    const tdActions = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-sm btn-warning me-2';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editStudent(i));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-sm btn-danger';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteStudent(i));

    tdActions.appendChild(editBtn);
    tdActions.appendChild(delBtn);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}

// Save students array to localStorage
function save() {
  localStorage.setItem('students', JSON.stringify(students));
}

// Reset the form to default
function clearForm() {
  form.reset();
  isEditing = false;
  editIndex = null;
  submitBtn.textContent = 'Submit';
  cancelBtn.style.display = 'none';
}

// Add or update on submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const rollNo = rollNoInput.value.trim();

  // basic validation
  if (!firstName || !lastName || !rollNo) {
    alert('Please fill all fields.');
    return;
  }

  if (isEditing && editIndex !== null) {
    // Update record
    students[editIndex] = { firstName, lastName, rollNo };
    save();
    renderTable();
    clearForm();
  } else {
    // Create new
    students.push({ firstName, lastName, rollNo });
    save();
    renderTable();
    clearForm();
  }
});

// Edit a student record (fills the form)
function editStudent(index) {
  const s = students[index];
  firstNameInput.value = s.firstName;
  lastNameInput.value = s.lastName;
  rollNoInput.value = s.rollNo;

  isEditing = true;
  editIndex = index;
  submitBtn.textContent = 'Update';
  cancelBtn.style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete a student record
function deleteStudent(index) {
  const s = students[index];
  if (confirm(`Delete ${s.firstName} ${s.lastName} (Roll ${s.rollNo})?`)) {
    students.splice(index, 1);
    save();
    renderTable();
    // if the deleted record was being edited, reset form
    if (isEditing && editIndex === index) clearForm();
  }
}

// Cancel editing
cancelBtn.addEventListener('click', () => clearForm());
