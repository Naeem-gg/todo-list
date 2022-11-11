const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/todoList",{useNewUrlParser: true});
const itemSchema = new mongoose.Schema({
  title: {type: String, required: true}
});

const Item = mongoose.model("Item",itemSchema);


// let items = ["learn React","learn Hooks", "learn props"];
app.get("/", function (req, res) {
  Item.find({},(err,itemsArray)=>{
    if(err){
      console.log(err);
    }else{
      // console.log(result); 
      const options = {weekday:"long",month:"long",day:"numeric",year:"numeric"};
      let today = new Date();
      today = today.toLocaleDateString("en-US",options);
      
      if(itemsArray.length === 0){
            const first = new Item({title: "The first item"});
            const second = new Item({title: "The second item"});
            const third = new Item({title: "The third item"});
            const fourth = new Item({title: "The fourth item"});
            
            const defaultItem = [first, second, third, fourth];
            
            Item.insertMany(defaultItem, (err)=>{
              if(err){
                console.log(err);
                }else{
                console.log("Items inserted");
                }
            });
            res.redirect("/");
          }
          else
          {
            
            res.render("test", { currentDay: today, items:itemsArray });
          }

        }});
});

app.post("/",function (req,res) {
  let item = req.body.todo;
  items.push(item);
  console.log(item);
  res.redirect("/");
});

app.get("/about",(req,res)=>{
  res.render("about");
});

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
