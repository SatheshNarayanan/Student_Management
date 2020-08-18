const express = require("express");
const students = require("./studentdata");
const Student = require("./studentModel");
const { response } = require("express");

const studentsRouter = express.Router();

const arrayBase = Object.keys(students[0]);

const getAllStudents = async () => {
  const result = await Student.findAll();

  // TODO: Find a better way to get plain json
  return JSON.parse(JSON.stringify(result));
};

const getStudentbyId = async (id) => {
  const result = await Student.findByPk(id);
  return JSON.parse(JSON.stringify(result));
};

const validStudent = (studentobject) => {
  let studentKeys = Object.keys(studentobject);
  if (studentKeys.length > 0) {
    if (studentKeys.includes("firstName")) {
      if (studentKeys.every((each) => arrayBase.includes(each))) return true;
    }
    return false;
  }
  return false;
};

const Update = (arrays, splicingArray) => {
  const { id } = arrays;
  const studentId = parseInt(id);
  let requiredStudentIndex;
  for (let i = 0; i < splicingArray.length; i++) {
    if (splicingArray[i].id === studentId) {
      requiredStudentIndex = i;
      break;
    }
  }
  if (typeof requiredStudentIndex !== "undefined") {
    const originalStudent = splicingArray[requiredStudentIndex];
    const newStudent = {
      ...originalStudent,
      ...arrays
    };
    splicingArray.splice(requiredStudentIndex, 1, newStudent);
  }
};

studentsRouter
  .get("/", async (req, res) => {
    try {
      res.status(200).json({
        data: await getAllStudents()
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("Internal Server error");
    }
  })
  .post("/", async (req, res) => {
    console.log(req);
    try {
      if (req.body.firstName) {
        const result = await Student.create(req.body);
        res.status(200).json({
          message: "Student added Succesfully",
          data: result
        });
      }
    } catch (e) {
      res.status(500).json({
        message: "Internal Server Error"
      });
    }
  })

  .put("/", (req, res) => {
    let arrayStudent = req.body.filter((each) => validStudent(each));
    arrayStudent.forEach((each) => Update(each, students));
    res.send(students);
  })

  /**
   * Individual student resource
   */

  .get("/:id", async (req, res) => {
    const { id } = req.params;
    const studentId = parseInt(id);
    const requiredStudent = await getStudentbyId(parseInt(studentId));
    if (requiredStudent) {
      res.status(200).json({ data: requiredStudent });
    } else {
      res.status(400).send("Student unavailable");
    }
  })
  .delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validStudent = await Student.findByPk(id);
      console.log(validStudent);
      if (validStudent) {
        await validStudent.destroy();
        res.status(200).json({
          message: "Student has been deleted"
        });
      }
    } catch (e) {
      res.status(500).json({
        message: "Internal Server Error"
      });
    }
  })

  .put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Student.update(req.body, {
        where: {
          id
        }
      });
      if (result.length) {
        res.status(200).json({ message: "Student Updated!" });
      } else {
        res.status(400).send("Student unavailable");
      }
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal Server Error");
    }
  });

module.exports = { studentsRouter, getAllStudents, getStudentbyId };
