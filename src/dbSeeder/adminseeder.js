const Admin = require("../adminModel");

Admin.sync({ force: true })
  .then(() => {
    return Admin.create({
      email: "sathesh@gmail.com",
      password: "12345"
    });
  })
  .then(result => {
    console.log(result.get());
  })
  .catch(console.error);
