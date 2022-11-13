const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/todoList");

const todoSchema = mongoose.Schema({title: {type: String,required: true}});
const Item = mongoose.model('Item', todoSchema);

// Item.find({},(err,eee)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(eee);
//     }
// });
itemId = "636f98f294e2b9aa3171c272";

Item.findByIdAndRemove(itemId, (err)=>{
    if (err) {
    console.log(err);
    } else {
        console.log("Item deleted");
        mongoose.connection.close();
    }
});