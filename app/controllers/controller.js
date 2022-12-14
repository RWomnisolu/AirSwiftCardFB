const { app1, app2} = require("../config/firebaseConfig.js");
const {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  sendSignInLinkToEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} = require('firebase/auth')


const admin = require('firebase-admin');



const fetch = require('node-fetch');

exports.Test= (req, res) => {
  // Validate request
    res.status(200).send({
      message: "ok"
    });
    return;
};


exports.Login= (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const data=req.body

  if (data.Email==undefined || data.Password==undefined) {
    console.log(data.Email+"  "+data.Password)
    res.status(400).send({
      message: "invaild body"
    });
    return;
  }


  const auth=getAuth(app1)
  var token;

  signInWithEmailAndPassword(auth, data.Email, data.Password)
      .then(() => {
          if (!auth.currentUser.emailVerified) {
              sendEmailVerification(auth.currentUser)
                  .then(() => {
                    res.status(200).send({
                      message: "email unverified"
                    });
                  }) .catch((error) => {
                    console.log(error.message)
                    res.status(400).send({
                      message: "Send Email error",
                      data: error.message
                    });
                    return;
                  })
          } 
          else{

            auth.currentUser.getIdToken()
            .then((id)=>{
              token=id;

              fetch('http://localhost:8080/GetUserInfo/'+auth.currentUser.uid, {
              method: 'GET',
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ` + token,
              },
              })
              .then((response)=>response.json())
              .then((data)=>{
                console.log(data)
                if(data==undefined){
                  {
                    res.status(400).send({
                      message: "login get info error",
                      data: data
                    });
                  }
                }
                else if (data.code==1000){
                  res.status(200).send({
                    message: "login success",
                    data:{
                          idToken:token,
                          loginToken:data.data.logintoken,
                          name:data.data.name,
                          numID:data.data.numID
                        }
                    });
                    return;
                }else{
                  res.status(400).send({
                    message: "login get info error",
                    data: data
                  });
                  return;
                }
              })
              .catch ((error)=>{
                console.log(error);
              })


            })
          }
      })
      .catch((error) => {
        console.log("err2 "+error.message)
        res.status(400).send({
          message: "FB login error",
          data: error.message
        });
        return;
      })  
};


exports.RenewToken= (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const data=req.body

  if (data.idToken==undefined || data.loginToken==undefined) {
    res.status(400).send({
      message: "invaild body"
    });
    return;
  }


  const auth=getAuth(app1)
  var token;

  signInWithCustomToken(auth, data.loginToken)
      .then(() => {
            auth.currentUser.getIdToken()
            .then((id)=>{
              token=id;

              fetch('http://localhost:8080/token/'+auth.currentUser.uid, {
              method: 'GET',
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ` + token,
              },})

              .then((response)=>response.json())
              .then((data)=>{
                console.log(data)
                if(data==undefined){
                  {
                    res.status(400).send({
                      message: "login get info error",
                      data: data
                    });
                  }
                }
                else if (data.code==1000){
                  res.status(200).send({
                    message: "login success",
                    data:{
                          idToken:token,
                          loginToken:data.data,
                        }
                    });
                    return;
                }else{
                  res.status(400).send({
                    message: "login get info error",
                    data: data
                  });
                  return;
                }
              })
              .catch ((error)=>{
                console.log(error);
              })


            })
          
      })
      .catch((error) => {
        console.log("err2 "+error.message)
        res.status(400).send({
          message: "FB login error",
          data: error.message
        });
        return;
      })  
};

exports.SignUp= (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const data=req.body

  if (data.Email==undefined || data.Password==undefined || data.Name==undefined) {
    res.status(400).send({
      message: "invaild body"
    });
    return;
  }
  
  console.log(data.Email+"  "+data.Password)
  const auth=getAuth(app1)
  var token;

  createUserWithEmailAndPassword(auth, data.Email, data.Password)
      .then(() => {
              sendEmailVerification(auth.currentUser)
                  .then(() => {
                    auth.currentUser.getIdToken()
                    .then((id)=>{
                      token=id;
                      let userInfo = {
                        User: data.Email,
                        FBID: auth.currentUser.uid,
                        Name: data.Name,
                      };

                      fetch('http://localhost:8080/signup', {
                        method: 'POST',
                        headers: {
                          //"Content-Type": "application/json",
                          //Accept: "application/json",
                          Authorization: `Bearer ` + token,
                        },
                        body: JSON.stringify(userInfo),
                      })
                      .then((response)=>response.json())
                      .then((data)=>{
                        console.log(data)
                          if(data.code==1000){
                            res.status(200).send({
                              message: "sign successful",
                            });
                          }else{
                            res.status(400).send({
                              message: "database signup fail",
                              data: data
                            });
                          }
                      })
                    })
                  })
      })
      .catch((error) => {
        console.log("err2 "+error.message)
        res.status(200).send({
          message: "sign failed",
          data: error.message
        });
      })  
};



exports.ForgetPassword = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  const data=req.body

  if (data.Email==undefined) {
    res.status(400).send({
      message: "invaild body"
    });
    return;
  }

  
  console.log(data.Email)
  const auth=getAuth(app1)
  sendPasswordResetEmail(auth, data.Email)
  .then(() => {
    res.status(200).send({
      message: "email send success"
    });
    return;
  })
  .catch((error) => {
        res.status(400).send({
          message: "email send fail",
          data:error.message
        });
        return;
      })
};


exports.LoginBP= (req, res) =>  {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const data=req.body

  if (data.Email==undefined || data.Password==undefined) {
    res.status(400).send({
      message: "invaild body"
    });
    return;
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
                        message: "send Verify email error",
                        data:error.message
                      });
                  })
          } else{
            auth.currentUser.getIdToken()
            .then((id)=>{
              token=id;
              res.status(200).send({
              message: "login success",
              data:id
              });
            })
          }
      })
      .catch((error) => {
        console.log("err2 "+error.message)
        res.status(400).send({
          message: "login error",
          data: error.message
        });
      })  
};



