const { DataTypes } = require("sequelize");
const studentDb = require("./config/db");
const Teachers = require("./teachersModel");

const Student = studentDb.define("students", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "first_name"
  },
  lastName: {
    type: DataTypes.STRING,
    field: "last_name"
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 3,
      max: 16
    }
  },
  gender: {
    type: DataTypes.ENUM,
    values: ["Male", "Female"],
    allowNull: false
  },
  teacherId: {
    type: DataTypes.INTEGER,
    field: "teacher_id",
    allowNull: false,
    references: {
      model: Teachers,
      key: "id"
    }
  }
});

/*(async () => {
  // clear existing tables & create new tables
  await studentDb.sync({ force: true });

  // Create a new entry in student table
  const result = await Student.create({
    firstName: "Dani",
    lastName: "Akash",
    age: 15,
    gender: "Male"
  });

  console.log(result.get());
})();*/

module.exports = Student;
