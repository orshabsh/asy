// Подключение к Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Функция выхода
function logout() {
    window.location.href = "/asy/login.html";
}

// Отображение таблицы учеников
function showStudents() {
    document.getElementById("studentsControls").style.display = "block";
    document.getElementById("exportButton").style.display = "block";

    db.collection("students").get().then(snapshot => {
        const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderStudentsTable(students);
    });
}

// Отображение таблицы сотрудников
function showStaff() {
    document.getElementById("studentsControls").style.display = "none";
    document.getElementById("exportButton").style.display = "block";

    db.collection("staff").get().then(snapshot => {
        const staff = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderStaffTable(staff);
    });
}

// Фильтрация учеников по классу
function filterByClass() {
    const selectedClass = document.getElementById("filterClass").value;
    db.collection("students").where("class", "==", selectedClass).get()
        .then(snapshot => {
            const filteredStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderStudentsTable(filteredStudents);
        });
}

// Сортировка таблицы
function sortTable(key) {
    const content = document.querySelector("tbody");
    let rows = Array.from(content.querySelectorAll("tr"));
    rows.sort((a, b) => {
        const aValue = a.querySelector(`td[data-key='${key}']`).innerText;
        const bValue = b.querySelector(`td[data-key='${key}']`).innerText;
        return aValue.localeCompare(bValue, 'ru', { numeric: true });
    });
    content.innerHTML = "";
    rows.forEach(row => content.appendChild(row));
}

// Рендеринг таблицы учеников
function renderStudentsTable(data) {
    const content = document.getElementById("content");
    content.innerHTML = `<table>
        <thead>
            <tr>
                <th onclick="sortTable('personalNumber')">№ Личного дела</th>
                <th onclick="sortTable('lastName')">Фамилия</th>
                <th>Имя</th>
                <th>Отчество</th>
                <th>Дата рождения</th>
                <th onclick="sortTable('class')">Класс</th>
                <th>Адрес</th>
                <th>Дата зачисления</th>
                <th>ФИО матери</th>
                <th>ФИО отца</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(student => `
                <tr>
                    <td data-key="personalNumber">${student.personalNumber}</td>
                    <td data-key="lastName">${student.lastName}</td>
                    <td>${student.firstName}</td>
                    <td>${student.middleName}</td>
                    <td>${student.birthDate}</td>
                    <td data-key="class">${student.class}</td>
                    <td>${student.address}</td>
                    <td>${student.enrollmentDate}</td>
                    <td>${student.motherName}</td>
                    <td>${student.fatherName}</td>
                    <td><button onclick="deleteStudent('${student.id}')">Удалить</button></td>
                </tr>`).join("")}
        </tbody>
    </table>`;
}

// Рендеринг таблицы сотрудников
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
                <th>Адрес</th>
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
                    <td><button onclick="deleteStaff('${staff.id}')">Удалить</button></td>
                </tr>`).join("")}
        </tbody>
    </table>`;
}

// Добавление ученика
function addStudent(studentData) {
    db.collection("students").add(studentData)
        .then(() => alert("Ученик добавлен!"))
        .catch(error => console.error("Ошибка добавления: ", error));
}

// Добавление сотрудника
function addStaff(staffData) {
    db.collection("staff").add(staffData)
        .then(() => alert("Сотрудник добавлен!"))
        .catch(error => console.error("Ошибка добавления: ", error));
}

// Удаление ученика
function deleteStudent(id) {
    db.collection("students").doc(id).delete()
        .then(() => alert("Ученик удалён!"))
        .catch(error => console.error("Ошибка удаления: ", error));
}

// Удаление сотрудника
function deleteStaff(id) {
    db.collection("staff").doc(id).delete()
        .then(() => alert("Сотрудник удалён!"))
        .catch(error => console.error("Ошибка удаления: ", error));
}

// Экспорт таблицы в Excel
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
