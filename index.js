const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

//IMPORT concept - here we are importing javascript code that was written
//in models/TodoTask.js, this allows for reusable js throughtout my project
//in this case, we're importing a todo schema, which may be used elsewhere

//FILE STRUCTURE concept - it will find the “views and models” folders 
//respectively and render ejs files for the frontend. this is convenient 
//because it puts less pressure on the developer to link files together 

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

//EXTERNAL DATABASE CONCEPT: This is the only framework that uses
//an online database that is backed up in the cloud as opposed to Flask & Svelte

//connection to database
// mongoose.set("useFindAndModify", false);
mongoose.set("strictQuery", true);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to db!");
  app.listen(3000, () => console.log("Server Up and running"));
});

//ROUTES concept -  this allows us to use different HTTP request and 
//render different parts of the website at different times

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
