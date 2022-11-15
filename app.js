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
  title: { type: String, required: true, unique: false },
});

const Item = mongoose.model("Item", itemSchema);
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  data: [itemSchema],
});
const User = new mongoose.model("User", userSchema);

const first = new Item({ title: "The first item" });
const second = new Item({ title: "The second item" });
const third = new Item({ title: "The third item" });
const fourth = new Item({ title: "The fourth item" });
let today = new Date();
const defaultItem = [first, second, third, fourth];
// let items = ["learn React","learn Hooks", "learn props"];
app.get("/", function (req, res) {
  Item.find({}, (err, itemsArray) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(itemsArray);
      const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      };
      today = new Date();
      today = today.toLocaleDateString("en-US", options);

      if (itemsArray.length === 0) {
        Item.insertMany(defaultItem, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Items inserted");
          }
        });
        res.redirect("/");
      } else {
        res.render("test", { currentDay: today, items: itemsArray });
      }
    }
  });
});

app.post("/", function (req, res) {
  let reqItem = req.body.todo;
  let userDefined = req.body.user;
  const item = new Item({ title: reqItem });
  
  if(userDefined === today)
  {
    item.save();
    res.redirect("/");
    
  }else{

    User.findOne({name:userDefined},(err,foundResult)=>{
      if(!err)
        if(foundResult)
          console.log("Hurrayyyyy!!!!!!")
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

app.get("/about", (req, res) => {
  res.render("about");
});

//dynamic routes defined in app by user
app.get("/:userRoute", (req, res) => {
  const userRoute = req.params.userRoute;
  // res.send(`<h1>${userRoute}</h1>`);
  if (userRoute !== "favicon.ico") {
    console.log(userRoute);

    //Find for duplicate entry in db

    User.findOne({ name: userRoute }, (err, result) => {
      if (!err) {
        if (!result) {
          // console.log("Does not exists");
          const user = new User({
            name: userRoute,
            data: defaultItem,
          });
          user.save();
          res.redirect(`/${userRoute}`);
        } else //result is present
        {
          res.render("test", { item: result.name, items: result.data });
        }
      }
    });
  }
});

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
