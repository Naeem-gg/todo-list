// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/todoList");

// const itemSchema = new mongoose.Schema({
//     title : {type:String,require:true},
// });

// const Item = mongoose.model("Item",itemSchema);

// const item = new Item({
//     title: "One"
// });

// const userSchema = new mongoose.Schema({
//     name:{type:String, require:true},
//     data: itemSchema
// });
// const User = mongoose.model("User",userSchema);

// const user = new User({
//     name : "naeem",
//     data: item
// });

// item.save();
// user.save();


const sampleFun = (...data) =>
{
    console.log(...data);
}

sampleFun(10,20,30,40,"hello","ola maguire", true, false, undefined, null, {name:"naeem",age:21},[10,11,12,13,14,15]);