module.exports = app => {
    const controller = require("../controllers/controller.js");
  
    var router = require("express").Router();
  

    router.post("/login", controller.Login);

    router.post("/bplogin", controller.LoginBP);

    router.post("/login", controller.SignUp);

    router.post("/forgetPassword", controller.ForgetPassword);
  
    app.use('/api/fb', router);
  };