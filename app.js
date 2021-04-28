/* test 용 */
const express = require("express");
const mysql = require("mysql");
const dbconfig = require("./config/database.js");
const connection = mysql.createConnection(dbconfig);

const app = express();

// configuration =========================
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.send("Root");
});

// DB 內, 주식(equnity) 데이터 변수에 저장 및 콘솔 출력
app.get("/showAllEquity", (req, res) => {
    connection.query("SELECT * from equity", (error, rows) => {
        if (error) throw error; 
        var a = rows[0].company;
        console.log("deposit info : ", a);
        res.send(a);
    });
});

app.get("/users", (req, res) => {
  connection.query("SELECT * from user", (error, rows) => {
    if (error) throw error;
    console.log("User info is: ", rows);
    res.send(rows);
  });
});

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});