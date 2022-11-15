const { app1, app2} = require("../config/firebaseConfig.js");

const {
  getAuth,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} = require('firebase/auth')




exports.Login= (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const data=req.body

  if (data.Email==undefined || data.Password==undefined) {
    res.status(400).send({
      message: "invaild body"
    });
  }

  console.log(data.Email+"  "+data.Password)
  const auth=getAuth(app1)
  var token;

  signInWithEmailAndPassword(auth, data.Email, data.Password)
      .then(() => {
          if (!auth.currentUser.emailVerified) {
              sendEmailVerification(auth.currentUser)
                  .then(() => {
                    res.status(200).send({
                      message: "email unregister"
                    });
                  })
                  .catch((error) => {
                      const errorCode = error.code
                      const errorMessage = error.message
                      console.log("err1 "+error.message)
                      res.status(400).send({
                        code: error.code,
                        message: error.message
                      });
                  })
          } else{
            auth.currentUser.getIdToken()
            .then((id)=>{
              token=id;
              res.status(200).send({
              message: id
              });
            })
          }
      })
      .catch((error) => {
        console.log("err2 "+error.message)
        res.status(400).send({
          code: error.code,
          message: error.message
        });
      })  
};


exports.LoginBP= (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  
  const data=req.body

  if (data.Email==undefined || data.Password==undefined) {
    res.status(400).send({
      message: "invaild body"
    });
  }

  console.log(data.Email+"  "+data.Password)
  const auth=getAuth(app2)
  var token;

  signInWithEmailAndPassword(auth, data.Email, data.Password)
      .then(() => {
          if (!auth.currentUser.emailVerified) {
              sendEmailVerification(auth.currentUser)
                  .then(() => {
                    res.status(200).send({
                      message: "email unregister"
                    });
                  })
                  .catch((error) => {
                      const errorCode = error.code
                      const errorMessage = error.message
                      console.log("err1 "+error.message)
                      res.status(400).send({
                        code: error.code,
                        message: error.message
                      });
                  })
          } else{
            auth.currentUser.getIdToken()
            .then((id)=>{
              token=id;
              res.status(200).send({
              message: id
              });
            })
          }
      })
      .catch((error) => {
        console.log("err2 "+error.message)
        res.status(400).send({
          code: error.code,
          message: error.message
        });
      })  
};

exports.SignUp= (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const data=req.body

  if (data.Email==undefined || data.Password==undefined) {
    res.status(400).send({
      message: "invaild body"
    });
  }
  
  console.log(data.Email+"  "+data.Password)
  const auth=getAuth(app1)
  var token;

  createUserWithEmailAndPassword(auth, data.Email, data.Password)
      .then(() => {
              sendEmailVerification(auth.currentUser)
                  .then(() => {
                    res.status(200).send({
                      message: "sign up"
                    });
                  })
                  .catch((error) => {
                      console.log("err1 "+error.message)
                      res.status(400).send({
                        code: error.code,
                        message: error.message
                      });
                  })
      })
      .catch((error) => {
        console.log("err2 "+error.message)
        res.status(400).send({
          code: error.code,
          message: error.message
        });
      })  
};

exports.ForgetPassword = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const data=req.body

  if (data.Email==undefined) {
    res.status(400).send({
      message: "invaild body"
    });
  }

  
  console.log(data.Email)
  const auth=getAuth(app1)
  sendPasswordResetEmail(auth, data.Email)
  .then(() => {
    res.status(200).send({
      message: "massage send"
    });
  })
  .catch((error) => {
      if (error.message.includes('user-not-found')) {
        res.status(400).send({
          message: "no such user"
        });
      } else if (error.message.includes('invalid-email')) {
        res.status(400).send({
          message: "no such user"
        });
      }else{
        res.status(400).send({
          message: error.message
        });
      }
  })
};

