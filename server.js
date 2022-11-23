

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv")
const app = express();


var corsOptions = {
  origin: "*"
};

dotenv.config()

app.use(cors(corsOptions));

// content-type：application/json
app.use(bodyParser.json());

// content-type：application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// 简单路由
app.get("/", (req, res) => {
  res.json({ message: "welcome" });
});

require("./app/routes/routers.js")(app);

// 设置监听端口

//console.log(process.env.PORT)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`服务器运行端口： ${PORT}.`);
});

