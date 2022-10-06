const express = require("express");
const app = express();
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let day = new Date();
  let today = day.getDay();
  let date = day.getDate();
  switch (today) {
    case 0:
      today = "Sunday";
      break;

    case 1:
      today = "Monday";
      break;

    case 2:
      today = "Tuesday";
      break;

    case 3:
      today = "Wednesday";
      break;

    case 4:
      today = "Thursday";
      break;

    case 5:
      today = "Friday";
      break;

    case 6:
      today = "Saturday";
      break;

    default:
      console.log(`Error ${today}`);
      break;
  }
  res.render("test", { currentDay: today,date:date });
});

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
