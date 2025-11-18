let employees = JSON.parse(localStorage.getItem("employees")) || [];

const form = document.getElementById("employeeForm");
const table = document.getElementById("employeeTable");
const search = document.getElementById("search");
const saveBtn = document.getElementById("saveBtn");

form.addEventListener("submit", saveEmployee);
search.addEventListener("keyup", loadTable);
loadTable();

// Save or Update Employee
function saveEmployee(e) {
  e.preventDefault();
  const id = document.getElementById("empId").value;
  const name = document.getElementById("name").value;
  const position = document.getElementById("position").value;
  const salary = document.getElementById("salary").value;

  if (id) {
    const index = employees.findIndex(emp => emp.id === id);
    employees[index] = { id, name, position, salary };
  } else {
    employees.push({ id: Date.now().toString(), name, position, salary });
  }

  localStorage.setItem("employees", JSON.stringify(employees));
  form.reset();
  document.getElementById("empId").value = "";
  saveBtn.textContent = "Add Employee";
  loadTable();
}

// Load Employee Data into Table
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
            <button class="action-btn edit" onclick="editEmployee('${emp.id}')">Edit</button>
            <button class="action-btn delete" onclick="deleteEmployee('${emp.id}')">Delete</button>
            <button class="action-btn print" onclick="printDetails('${emp.id}')">Print</button>
          </td>
        </tr>
      `;
      table.innerHTML += row;
    });
}

// Edit Employee
function editEmployee(id) {
  const emp = employees.find(e => e.id === id);
  document.getElementById("empId").value = emp.id;
  document.getElementById("name").value = emp.name;
  document.getElementById("position").value = emp.position;
  document.getElementById("salary").value = emp.salary;
  saveBtn.textContent = "Update Employee";
}

// Delete Employee
function deleteEmployee(id) {
  if (confirm("Are you sure to delete this employee?")) {
    employees = employees.filter(emp => emp.id !== id);
    localStorage.setItem("employees", JSON.stringify(employees));
    loadTable();
  }
}

// Print Employee Details
function printDetails(id) {
  const emp = employees.find(e => e.id === id);
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
