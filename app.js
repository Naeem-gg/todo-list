const express = require("express");
const mongoose = require("mongoose");
const lodash = require('lodash');
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//Local MongoDb
// mongoose.connect("mongodb://localhost:27017/todoList",{useNewUrlParser: true,});

//Atlas Mongodb

mongoose.connect("mongodb+srv://naeem:<PASSWORD>@testcluster.zhdjquu.mongodb.net/todoList");
const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);
const listSchema = new mongoose.Schema({
  name: { type: String, required: true},
  items: [itemSchema],
});
const List = new mongoose.model("List", listSchema);

const first = new Item({ name: "The first item" });
const second = new Item({ name: "The second item" });
const third = new Item({ name: "The third item" });
const fourth = new Item({ name: "The fourth item" });
const defaultItem = [first, second, third, fourth];
app.get("/", function (req, res) {

  Item.find({}, (err, foundItems) => {
    if (err) {
      console.log(err);
    } else {
      //console.log(foundItems);
      

      if (foundItems.length === 0) {
        Item.insertMany(defaultItem, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Items inserted");
          }
        });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    }
  });
});

app.post("/", function (req, res) {
  let itemName = req.body.todo;
  let listName = req.body.list;
  const item = new Item({ name: itemName });
  if(listName === "Today")
  {

    item.save();
    res.redirect("/");
    
  }
  else
  {
    List.findOne({name:listName},(err,foundList)=>{
      if(err)
      {
        console.log(err);
      }
      else if(foundList)
      {

        foundList.items.push(item)
        foundList.save();
        res.redirect(`/${listName}`);
      }
      else
      {console.log("****ERRRRROORRR****"+listName);}
    });
  }
    // res.redirect(`/${listName}`);
  
});

  app.post("/delete", (req, res) => {
    // console.log(req.body);
    let itemId = req.body.checkBox.toString().trim();
    // title = String(title);
    let listTitle = req.body.listTitle;
   
    if(listTitle === "Today")
    {

      // console.log(mongoose.Types.ObjectId.isValid(`${itemId}`));
      Item.findByIdAndRemove(itemId, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Item deleted");
          console.log(listTitle);
          // mongoose.connection.close();
          res.redirect("/");
        }
      });
    }
    else
    {
      List.findOneAndUpdate({name:listTitle},{$pull:{items:{_id:itemId}}},(err,foundList)=>{
        if(!err)
        {
          res.redirect(`/${listTitle}`);
        }
      });

      // res.redirect("/"+listTitle);
    }
  });

//dynamic routes defined in app by user
app.get("/:userRoute", (req, res) => {

  const userRoute = lodash.capitalize(req.params.userRoute);
  // const userRoute = req.params.userRoute;
  if (userRoute !== "favicon.ico" && userRoute !== "Favicon.ico") { //something wrong with my system thats why
    console.log(userRoute);

    //Find for duplicate entry in db

    List.findOne({ name: userRoute }, (err, foundList) => {
      if (!err) {
        if (!foundList) {
          // console.log("Does not exists");
          const list = new List({
            name: userRoute,
            items: defaultItem,
          });
          list.save();
          res.redirect(`/${userRoute}`);
        } else //foundList is present
        {
          res.render("list", { listTitle:foundList.name, newListItems: foundList.items });
        }
      }
    });
  }
});

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
