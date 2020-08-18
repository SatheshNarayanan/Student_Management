const Teacher = require("../teachersModel");
const { studentSeeder } = require("./dbseeder.js");

const newTeacher = {
  firstName: "Dani",
  lastName: "Akash",
  age: 24,
  gender: "Male",
  email: "test@gmail.com"
};

const teacherSeeder = async () => {
  await Teacher.sync({ force: true });

  try {
    const result = await Teacher.create(newTeacher);
    console.log(result.get());
    const { id } = result.get();
    studentSeeder(id);
  } catch (e) {
    console.error(e);
  }
};

teacherSeeder();
