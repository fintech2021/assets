/* test 용 */

const express = require("express");
const mysql = require("mysql");
const { networkInterfaces } = require("os");
const path = require("path");
var request = require("request");
const dbconfig = require("./config/database.js");
const connection = mysql.createConnection(dbconfig);

const app = express();
app.set("views", path.join(__dirname, "views")); // ejs file location
app.set("view engine", "ejs"); //select view templet engine

app.use(express.static(path.join(__dirname, "public"))); //to use static asset

const deposit = [
  {
    name: "최수영",
    bank: "KB증권",
    account: "07605579701069",
    balance: "4,500,000",
  },
  {
    name: "최수영",
    bank: "키움증권",
    account: "02093343701069",
    balance: "9,300,000",
  },
];
const sampletest = {

  eqcode: "123456",
    name: "subin",
      company: "syj",
        count: "5",
          selling_price: "1000",
            purchasing_price: "2000",
              total_price: "5000",
                update_date: "2021-04-28T05:06:09.000Z",
                  input_date: "2021-04-28T05:06:09.000Z",
                    id: "1",


};
const stockhistory = [
  {
    eqcode: "053200",
    name: "삼성전자",
    company: "키움증권",
    category: "매수",
    count: "6",
    account: "0760446903201",
    withdrawAmount: "- 240000",
    depositAmount: "",
    update_date: "2021.04.27  23:00:24",
    input_date: "2021.04.27  23:00:24",
    id: "1",
  },
  {
    eqcode: "076200",
    name: "NAVER",
    company: "삼성증권",
    category: "매도",
    count: "1",
    account: "0560427403201",
    withdrawAmount: "+ 300000",
    depositAmount: "+ 300000",
    update_date: "2021.04.27  23:00:24",
    input_date: "2021.04.29   07:35:44",
    id: "2",
  },
];
const sampletest2 = [
  {
    eqcode: "053200",
    name: "삼성전자",
    company: "키움증권",
    count: "6",
    selling_price: "80000",
    purchasing_price: "40000",
    total_price: "240000",
    update_date: "2021-04-28T05:06:09.000Z",
    input_date: "2021-04-28T05:06:09.000Z",
    id: "1",
  },
  {
    eqcode: "076200",
    name: "NAVER",
    company: "삼성증권",
    count: "10",
    selling_price: "300000",
    purchasing_price: "350000",
    total_price: "3500000",
    update_date: "2021-04-28T05:06:09.000Z",
    input_date: "2021-04-28T05:06:09.000Z",
    id: "2",
  },
];
const sampletest1 = [
  123456,
  "subin",
  "syj",
  3,
  1000,
  2000,
  3000,
  "2021-04-28T05:06:09.000Z",
  "2021-04-28T05:06:09.000Z",
];


app.get("/test", function (req, res) {
  // res.send(sampletest);
  res.send(sampletest2);
});

app.get("/deposit", function (req, res) {
  // res.send(sampletest);
  res.send(deposit);
});
app.get("/history", function (req, res) {
  // res.send(sampletest);
  res.send(stockhistory);
});

// configuration =========================
app.set("port", process.env.PORT || 3000);

app.get("/", (req, res) => {
  res.send("Root");
});

const data = [
  {
    eqcode: 123456,
    name: "subin",
    company: "syj",
    count: 5,
    selling_price: 1000,
    purchasing_price: 2000,
    total_price: 5000,
    update_date: "2021-04-28T05:06:09.000Z",
    input_date: "2021-04-28T05:06:09.000Z",
    id: 1,
  },
];

app.get("/test", (req, res) => {
  res.send(data);
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
      var resultAuth = JSON.parse(body);
      // console.log(requestAuth);
      // res.render("resultChild", { data: requestAuth });
      var accesstoken = resultAuth.access_token;
      var userseqnum = resultAuth.user_seq_no;
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
          var resultAccount = JSON.parse(body);
          console.log(resultAccount); // 출금 계좌 리스트
          var dname, dbank, daccountNo, fUseNum;
          for (var i = 0; i < resultAccount.res_list.length; i++) {
            dname = resultAccount.res_list[i].account_holder_name;
            dbank = resultAccount.res_list[i].bank_name;
            daccountNo = resultAccount.res_list[i].account_num_masked;
            fUseNum = resultAccount.res_list[i].fintech_use_num;

            var countnum = Math.floor(Math.random() * 899999999) + 100000000;
            console.log(countnum);
            var transId = "M202112115U" + countnum; //이용기과번호 본인것 입력

            var option = {
              method: "GET",
              url:
                "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
              headers: {
                Authorization: "Bearer " + accesstoken,
              },
              qs: {
                bank_tran_id: transId,
                fintech_use_num: fUseNum,
                tran_dtime: "20210429123034",
              },
            };
            request(option, function (err, response, body) {
              if (err) {
                console.error(err);
                throw err;
              } else {
                var resultBalance = JSON.parse(body);
                var dbalance = resultBalance.balance_amt;
                console.log(dname + " * " + dbank + " * " + daccountNo  + " * " + fUseNum + " * " + dbalance + "\n");
                var sql = "INSERT INTO iamdb.deposit VALUES (?,?,?,?,?,?,?,?,?)"
                connection.query(
                    sql, // excute sql
                    [null, dname, dbank, daccountNo, dbalance, fUseNum, null, null, 10], // ? <- value
                    function(err, result){
                        if(err){
                            console.error(err);
                            res.json(0);
                            throw err;
                        }
                })
                // console.log(resultBalance);
                //   res.json(resultBalance);
              }
            });

            console.log(
              dname +
                " * " +
                dbank +
                " * " +
                daccountNo +
                " * " +
                fUseNum +
                " * " +
                // balance +
                "\n"
            );
          }
          res.json(
            dname + " * " + dbank + " * " + daccountNo + " * " + fUseNum + "\n"
          );
          // res.json(requestAuth2);
        }
      });
    }
  });
});

// DB 內, 주식(equnity) 데이터 변수에 저장 및 콘솔 출력
app.get("/showAllEquity", (req, res) => {
  connection.query("SELECT * from equity", (error, rows) => {
    if (error) throw error;
    console.log("equity info : ", rows);
    res.send(rows);
  });
});

app.get("/balance", (req, res) => {
  connection.query("SELECT * from deposit", (error, rows) => {
    if (error) throw error;
    console.log("User info is: ", rows);
    res.send(rows);
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
