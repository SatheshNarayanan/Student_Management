var express = require("express");

var {
  studentsRouter,
  getAllStudents,
  getStudentbyId
} = require("./studentRouter");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const ifEquality = require("./Views/helpers/ifEquality");
const expressHBS = require("express-handlebars");
const path = require("path");
const adminRouter = require("./adminRouter");
const auth = require("./middlewares/auth");
const passiveAuth = require("./middlewares/passiveauth");
//create a server object:
var app = express();

//creating handlebars engine
const hbs = expressHBS.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./Views/layouts"),
  partialsDir: path.join(__dirname, "./Views/partials"),
  helpers: {
    ifEquality
  }
});

//let express know to use handlebars
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./Views"));

app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/student", studentsRouter);

app.use("/admin", adminRouter);

app.get("/logout", (request, response) => {
  response.clearCookie("jwt");
  response.redirect("/");
});

app.get("/", passiveAuth, (request, response) => {
  response.status(200).render("home.hbs", {
    layout: "hero.hbs",
    title: "Home",
    isAdmin: request.jwt ? request.jwt.sub === "admin" : false
  });
});

app.get("/adminLogin", (request, response) => {
  response.status(200).render("adminLogin.hbs", {
    layout: "login.hbs",
    title: "Admin",
    submitTarget: "/admin/login",
    submitMethod: "POST",
    formTitle: "Admin Login"
  });
});

app.get("/edit-students/:id", auth, async (request, response) => {
  const { id } = request.params;
  const requiredStudent = await getStudentbyId(parseInt(id));
  if (requiredStudent) {
    response.status(200).render("Addstudents.hbs", {
      layout: "navigation.hbs",
      title: "Edit Students",
      student: requiredStudent,
      action: "/student/" + requiredStudent.id,
      method: "PUT"
    });
  } else {
    response.status(404).send("Student not found");
  }
});

app.get("/students", auth, async (request, response) => {
  try {
    response.status(200).render("student.hbs", {
      layout: "navigation.hbs",
      title: "Students",
      data: await getAllStudents()
    });
  } catch (e) {
    console.log(e);
    response.status(500).send("Internal Server error");
  }
});

app.get("/Addstudents", auth, (request, response) => {
  response.status(200).render("Addstudents.hbs", {
    layout: "navigation.hbs",
    title: "Add Students",
    action: "/student",
    method: "POST"
  });
});

app.get("*", (request, response) => {
  response.status(404).send("Page not found");
});

app.listen(8080, () => {
  console.log("server is running");
});
