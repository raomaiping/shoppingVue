const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors")
//执行前端页面
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

//引入路由
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles");
const type = require("./routes/api/type");
const goods = require("./routes/api/goods")

//DB confing
const db = require("./config/keys").mongoURI;

//引入passport
const passport = require("passport");

//使用body-parser中间件
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//避免使用findOneAndUpdate()更新数据库的时候出现警告信息
mongoose.set("useFindAndModify", false);

//passport 初始化
app.use(passport.initialize());

require("./config/passport")(passport);

// app.get("/",(req,res) =>{
//     res.send("Hello World!");
// })

//使用routers
app.use("/api/users", users);
app.use("/api/profiles", profiles);
app.use("/api/type", type);
app.use("/api/goods", goods);




const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
