const API_URL = "https://employeemanage-bwvj.onrender.com";  // 🔥 YOUR BACKEND URL

const form = document.getElementById("employeeForm");
const table = document.getElementById("employeeTable");
const search = document.getElementById("search");
const saveBtn = document.getElementById("saveBtn");

let employees = [];

form.addEventListener("submit", saveEmployee);
search.addEventListener("keyup", loadTable);

loadEmployeesFromBackend();

// =======================
// LOAD FROM BACKEND
// =======================
async function loadEmployeesFromBackend() {
  const res = await fetch(`${API_URL}/employees`);
  employees = await res.json();
  loadTable();
}

// =======================
// SAVE OR UPDATE EMPLOYEE
// =======================
async function saveEmployee(e) {
  e.preventDefault();

  const id = document.getElementById("empId").value;
  const name = document.getElementById("name").value;
  const position = document.getElementById("position").value;
  const salary = document.getElementById("salary").value;

  const data = { name, position, salary };

  if (id) {
    // UPDATE API CALL
    await fetch(`${API_URL}/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } else {
    // CREATE API CALL
    await fetch(`${API_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  form.reset();
  document.getElementById("empId").value = "";
  saveBtn.textContent = "Add Employee";

  loadEmployeesFromBackend();
}

// =======================
// LOAD TABLE
// =======================
function loadTable() {
  const keyword = search.value.toLowerCase();
  table.innerHTML = "";

  employees
    .filter(emp => emp.name.toLowerCase().includes(keyword))
    .forEach(emp => {
      const row = `
        <tr>
          <td>${emp.name}</td>
          <td>${emp.position}</td>
          <td>${emp.salary}</td>
          <td>
            <button class="action-btn edit" onclick="editEmployee('${emp._id}')">Edit</button>
            <button class="action-btn delete" onclick="deleteEmployee('${emp._id}')">Delete</button>
            <button class="action-btn print" onclick="printDetails('${emp._id}')">Print</button>
          </td>
        </tr>
      `;
      table.innerHTML += row;
    });
}

// =======================
// EDIT EMPLOYEE
// =======================
function editEmployee(id) {
  const emp = employees.find(e => e._id === id);
  document.getElementById("empId").value = emp._id;
  document.getElementById("name").value = emp.name;
  document.getElementById("position").value = emp.position;
  document.getElementById("salary").value = emp.salary;
  saveBtn.textContent = "Update Employee";
}

// =======================
// DELETE EMPLOYEE
// =======================
async function deleteEmployee(id) {
  if (!confirm("Are you sure to delete this employee?")) return;

  await fetch(`${API_URL}/employees/${id}`, {
    method: "DELETE",
  });

  loadEmployeesFromBackend();
}

// =======================
// PRINT EMPLOYEE DETAILS
// =======================
function printDetails(id) {
  const emp = employees.find(e => e._id === id);
  const content = `
    Employee Details
    -----------------------
    Name: ${emp.name}
    Position: ${emp.position}
    Salary: ${emp.salary}
  `;
  const newWindow = window.open("", "", "width=400,height=400");
  newWindow.document.write(`<pre>${content}</pre>`);
  newWindow.print();
  newWindow.close();
}
