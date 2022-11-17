const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/todoList", {
  useNewUrlParser: true,
});
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
  if(listName == "Today")
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
    
  
});

  app.post("/delete", (req, res) => {
    // console.log(req.body);
    let itemId = req.body.checkBox.toString().trim();
    // title = String(title);

    console.log(typeof "itemId" + " : " + "itemId");

    console.log(mongoose.Types.ObjectId.isValid(`${itemId}`));
    Item.findByIdAndRemove(itemId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Item deleted");
        // mongoose.connection.close();
      }
    });
    res.redirect("/");
  });

//dynamic routes defined in app by user
app.get("/:userRoute", (req, res) => {
  const userRoute = req.params.userRoute;
  if (userRoute !== "favicon.ico") { //something wrong with my system thats why
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
