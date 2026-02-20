const express = require('express');
const path = require('path');
const app = express();
const PORT = 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let students = [
  { id: 1, name: "Alice", marks: 85 },
  { id: 2, name: "Bob", marks: 42 },
  { id: 3, name: "Charlie", marks: 73 }
];

function calculateGrade(marks) {
  if (marks >= 80) return "A";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  if (marks >= 40) return "D";
  return "F";
}

app.get('/', (req, res) => {
  res.redirect('/students');
});

app.get('/students', (req, res) => {
  const updatedStudents = students.map(s => ({ ...s, grade: calculateGrade(s.marks) }));
  res.render('students', { students: updatedStudents });
});

app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.send("Student not found");
  res.render('student', { student: { ...student, grade: calculateGrade(student.marks) } });
});

app.get('/add-student', (req, res) => {
  res.render('add-student');
});

app.post('/add-student', (req, res) => {
  const { name, marks } = req.body;
  students.push({ id: students.length + 1, name, marks: parseInt(marks) });
  res.redirect('/students');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
