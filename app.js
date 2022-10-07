const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs");
let items = ["learn React","learn Hooks", "learn props"];
app.get("/", function (req, res) {
  const options = {weekday:"long",month:"long",day:"numeric",year:"numeric"};
  let today = new Date();
  today = today.toLocaleDateString("en-US",options);
  res.render("test", { currentDay: today, items:items});
});

app.post("/",function (req,res) {
  let item = req.body.todo;
  items.push(item);
  console.log(item);
  res.redirect("/");
});


app.listen(3000, function () {
  console.log("http://localhost:3000");
});
