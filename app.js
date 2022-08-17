const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const appRouter = require("./routers/appRouter")

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

app.use(appRouter);

app.listen(3000, () => {
  console.log("Server is running with port 3000");
});
