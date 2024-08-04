const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "student_results",
  password: "root",
});


// Home Route
app.get("/", (req, res) => {
  let q = `SELECT count(*) AS count FROM cadet`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0].count;
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

// Show Route
app.get("/cadet", (req, res) => {
  let q = `SELECT * FROM cadet`;

  try {
    connection.query(q, (err, cadets) => {
      if (err) throw err;
      res.render("show.ejs", { cadets });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

// Edit Route
app.get("/cadet/:Roll_No/edit", (req, res) => {
  let { Roll_No } = req.params;
  let q = `SELECT * FROM cadet WHERE Roll_No ='${Roll_No}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.render("edit.ejs", { cadet: result[0] });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

// Update (DB) Route
app.patch("/cadet/:id", (req, res) => {
  let { Roll_No } = req.params;
  let { password: formPass, username: newCadet } = req.body;
  let q = `SELECT * FROM cadet WHERE Roll_No ='${Roll_No}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let cadet = result[0];
      if (formPass !== cadet.password) {
        res.send("WRONG password");
      } else {
        let q2 = `UPDATE cadet SET username='${newCadet}' WHERE Roll_No ='${Roll_No}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/cadet");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

// Delete Route
app.get("/cadet/:id/delete", (req, res) => {
  let {Registration_No_Year } = req.params;
  let q = `SELECT * FROM cadet WHERE Registration_No_Year ='${Registration_No_Year}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.render("delete.ejs", { cadet: result[0] });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

// Delete (DB) Route
app.delete("/cadet/:id", (req, res) => {
  let { id } = req.params;

  let q = `DELETE FROM cadet WHERE id='${id}'`;

  try {
    connection.query(q, (err) => {
      if (err) throw err;
      console.log(err);
      res.redirect("/cadet");
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});


// Add New user Route 
app.get("/cadet/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/cadet/new", (req, res) => {
  let { Roll_No, Name_Of_Candidate, Registration_No_Year, M_Theory, M_Internal, M_Total, D_Theory, D_Internal, D_Total, C_Theory, C_Internal, C_Total, Total, Com_Prac, Aggregate, Result, password } = req.body;
  
  //Query to Insert New Cadet
  let q = `INSERT INTO cadet (Roll_No, Name_Of_Candidate, Registration_No_Year, M_Theory, M_Internal, M_Total, D_Theory, D_Internal, D_Total, C_Theory, C_Internal, C_Total, Total, Com_Prac, Aggregate, Result, password) 
  VALUES 
  ("${Roll_No}","${Name_Of_Candidate}","${Registration_No_Year}",'${M_Theory}','${M_Internal}','${M_Total}','${D_Theory}','${D_Internal}','${D_Total}','${C_Theory}','${C_Internal}','${C_Total}','${Total}','${Com_Prac}','${Aggregate}','${Result}','${password}')`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added new user");
      res.redirect("/cadet");
    });
  } catch (err) {
    res.send("some error occurred");
  }
});


app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
