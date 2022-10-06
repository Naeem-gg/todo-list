const express = require("express");
const app = express();
app.set('view engine','ejs');

app.get("/",function(req,res){
    let appTitle = "This is dynamic heading";
    res.render("test",{title:appTitle});
});

app.listen(3000,function () {  
    console.log("http://localhost:3000");
});