/* test 용 */

const express = require("express");
const mysql = require("mysql");
const path = require("path");
var request = require("request");
const dbconfig = require("./config/database.js");
const connection = mysql.createConnection(dbconfig);

const app = express();
app.set("views", path.join(__dirname, "views")); // ejs file location
app.set("view engine", "ejs"); //select view templet engine

app.use(express.static(path.join(__dirname, "public"))); //to use static asset

// configuration =========================
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.send("Root");
});

// 로그인 view
app.get("/signup", function (req, res) {
  res.render("signup");
});

// 사용자 토큰 발급
app.get("/authResult", function (req, res) {
  var authCode = req.query.code;
  console.log(authCode);
  var option = {
    method: "POST",
    url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      code: authCode,
      client_id: "f5bb47c6-152c-4974-8d03-85c881ef365a",
      client_secret: "3796b83a-f678-4b67-92c2-4cf1e5142c93",
      redirect_uri: "http://localhost:3000/authResult",
      grant_type: "authorization_code",
    },
  };
  request(option, function (err, response, body) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      var accessRequestResult = JSON.parse(body);
      // console.log(accessRequestResult);
      // res.render("resultChild", { data: accessRequestResult });
      var accesstoken = accessRequestResult.access_token;
      var userseqnum = accessRequestResult.user_seq_no;
      console.log("at: " + accesstoken + "usq: " + userseqnum);

      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/user/me",
        headers: {
          Authorization: "Bearer " + accesstoken,
        },
        qs: {
          user_seq_no: userseqnum,
        },
      };
      request(option, function (err, response, body) {
        if (err) {
          console.error(err);
          throw err;
        } else {
          var accessRequestResult2 = JSON.parse(body);
          console.log(accessRequestResult2); // 출금 계좌 리스트
          res.json(accessRequestResult2);
        }
      });
    }
  });
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
