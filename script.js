// Handles logout functionality
function logout() {
    window.location.href = "/asy/index.html";
}

// Shows the students table and controls
function showStudents() {
    document.getElementById("studentsControls").style.display = "block";
    document.getElementById("exportButton").style.display = "block";
    function showStudents() {
    document.getElementById("studentsControls").style.display = "block";
    document.getElementById("exportButton").style.display = "block";

    db.collection("students").get().then(snapshot => {
        const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderStudentsTable(students);
    });
}

}

// Shows the staff table and hides students controls
function showStaff() {
    document.getElementById("studentsControls").style.display = "none";
    document.getElementById("exportButton").style.display = "block";
    function showStaff() {
    document.getElementById("studentsControls").style.display = "none";
    document.getElementById("exportButton").style.display = "block";

    db.collection("staff").get().then(snapshot => {
        const staff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderStaffTable(staff);
    });
}

}

function updateStudent(id, updatedData) {
    db.collection("students").doc(id).update(updatedData)
        .then(() => alert("Данные обновлены!"))
        .catch(error => console.error("Ошибка обновления: ", error));
}

function updateStaff(id, updatedData) {
    db.collection("staff").doc(id).update(updatedData)
        .then(() => alert("Данные обновлены!"))
        .catch(error => console.error("Ошибка обновления: ", error));
}

function addStudent(studentData) {
    db.collection("students").add(studentData)
        .then(() => alert("Ученик добавлен!"))
        .catch(error => console.error("Ошибка добавления: ", error));
}

function addStaff(staffData) {
    db.collection("staff").add(staffData)
        .then(() => alert("Сотрудник добавлен!"))
        .catch(error => console.error("Ошибка добавления: ", error));
}

function deleteStudent(id) {
    db.collection("students").doc(id).delete()
        .then(() => alert("Ученик удалён!"))
        .catch(error => console.error("Ошибка удаления: ", error));
}

function deleteStaff(id) {
    db.collection("staff").doc(id).delete()
        .then(() => alert("Сотрудник удалён!"))
        .catch(error => console.error("Ошибка удаления: ", error));
}


// Loads table data from a JSON file
function loadTableData(url, type) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (type === "students") {
                renderStudentsTable(data);
            } else {
                renderStaffTable(data);
            }
        });
}

// Renders the students table
function renderStudentsTable(data) {
    const content = document.getElementById("content");
    content.innerHTML = `<table>
        <thead>
            <tr>
                <th>№ Личного дела</th>
                <th>Фамилия</th>
                <th>Имя</th>
                <th>Отчество</th>
                <th>Дата рождения</th>
                <th>Класс</th>
                <th>Адрес проживания</th>
                <th>Дата зачисления</th>
                <th>ФИО матери</th>
                <th>ФИО отца</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(student => `
                <tr>
                    <td>${student.personalNumber}</td>
                    <td>${student.lastName}</td>
                    <td>${student.firstName}</td>
                    <td>${student.middleName}</td>
                    <td>${student.birthDate}</td>
                    <td>${student.class}</td>
                    <td>${student.address}</td>
                    <td>${student.enrollmentDate}</td>
                    <td>${student.motherName}</td>
                    <td>${student.fatherName}</td>
                    <td><button onclick="editStudent('${student.personalNumber}')">Редактировать</button></td>
                </tr>`).join("")}
        </tbody>
    </table>`;
}

// Renders the staff table
function renderStaffTable(data) {
    const content = document.getElementById("content");
    content.innerHTML = `<table>
        <thead>
            <tr>
                <th>Логин</th>
                <th>Фамилия</th>
                <th>Имя</th>
                <th>Отчество</th>
                <th>Дата рождения</th>
                <th>Должность</th>
                <th>Адрес проживания</th>
                <th>Дата трудоустройства</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(staff => `
                <tr>
                    <td>${staff.login}</td>
                    <td>${staff.lastName}</td>
                    <td>${staff.firstName}</td>
                    <td>${staff.middleName}</td>
                    <td>${staff.birthDate}</td>
                    <td>${staff.position}</td>
                    <td>${staff.address}</td>
                    <td>${staff.hiringDate}</td>
                    <td><button onclick="editStaff('${staff.login}')">Редактировать</button></td>
                </tr>`).join("")}
        </tbody>
    </table>`;
}

// Filters students by class
function filterByClass() {
    const selectedClass = document.getElementById("filterClass").value;
    fetch("/asy/students-data.json")
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(student => student.class === selectedClass);
            renderStudentsTable(filteredData);
        });
}

// Sorts the table by a specific key
function sortTable(key) {
    const tableData = Array.from(document.querySelectorAll("tbody tr"));
    tableData.sort((a, b) => {
        const aValue = a.querySelector(`td:nth-child(${getKeyIndex(key)})`).innerText;
        const bValue = b.querySelector(`td:nth-child(${getKeyIndex(key)})`).innerText;
        return aValue.localeCompare(bValue, 'ru', { numeric: true });
    });
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    tableData.forEach(row => tbody.appendChild(row));
}

// Gets the column index based on key
function getKeyIndex(key) {
    const mapping = { personalNumber: 1, lastName: 2, class: 6 };
    return mapping[key];
}

// Promotes students to the next class
function promoteStudents() {
    fetch("/asy/students-data.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(student => {
                const match = student.class.match(/(\d+)(\D?)/);
                if (match) {
                    student.class = (parseInt(match[1]) + 1) + match[2];
                }
            });
            renderStudentsTable(data);
        });
}

// Exports table to Excel
function exportToExcel() {
    const table = document.querySelector("table");
    const rows = Array.from(table.rows).map(row => Array.from(row.cells).map(cell => cell.innerText));
    const csvContent = rows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table_export.csv";
    link.click();
}

<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"></script>
<script src="/asy/firebase-config.js"></script>
<script src="/asy/script.js" defer></script>
