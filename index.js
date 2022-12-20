const express = require('express')
const app = express();
const port = 4000;
const mysql = require('mysql2');
const Sequelize = require("sequelize");
require('dotenv').config()

const DB_URL=process.env.MYSQL_URL;
const DB_NAME=process.env.MYSQLDATABASE || 'mirainikki';
const DB_HOST=process.env.MYSQLHOST || 'localhost';
const DB_PASSWORD=process.env.MYSQLPASSWORD || 'taf30';
const DB_PORT=process.env.MYSQLPORT || 3306;
const DB_USER=process.env.MYSQLUSER || 'taf';

// create the connection to database
const db = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});



/*const db = mysql.createConnection({
    host: 'localhost',
    port:'3306',
    user: "taf",
    password: "taf30",
    database:'mirainikki'
});*/


app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

/*app.use(async ctx=> {
    ctx.body = 'Hello World from Railway';
});*/

let statara=[];
let ara=[];
let messAlert="";

app.get('/', (req, res) => {
  res.render("index", {plNames: ara});
});

app.post('/', (req, res) => {
   const name= req.body.name;
   ara.push(name);
   res.redirect("/");
});

app.get('/signup', (req, res) => {
    res.render("signup", {messageAlert: messAlert});
});
app.post("/signup", (req,res)=>{
    const signupName= req.body.signupName;
    const signupPassword= req.body.signupPassword;
    console.log(signupName +" "+ signupPassword);
    
    db.query(
        "INSERT INTO users (name,password) VALUES (?,?)",
        [signupName,signupPassword],
        (err,result) =>{
            if(err){
                res.render("signup", {messageAlert: "name already taken"});
                //res.send({message:"0"});
            }
            else{
                //res.render("signup", {messageAlert: "new user added"});
                //res.send({message:"value inserted"});
                res.redirect('/mirai');
                
            }
        }
    );
});


app.get('/login', (req, res) => {
    res.render("login", {mess: messAlert});
});
app.post("/login", (req,res)=>{
    const loginName= req.body.loginName;
    const loginPassword= req.body.loginPassword;
    console.log("login " + loginName +" "+ loginPassword);

    db.query(
        "SELECT * FROM users WHERE name = ? AND password = ?",
        [loginName,loginPassword],
        (err,result) =>{
            if(err){
                //res.render("login", {mess: "abc " + err});
                res.render("login", {mess: "name or password is wrong"});
            }
            if(result.length >0){
                //res.render("login", {mess: "logging in"});
                res.redirect('/mirai');
            }
            else{
                //console.log("not ok");
                //res.send({message:"0"});    
                //res.render('index', {data:"0"});
                //res.render("index", {bro:0});
                //messAlert="not ok";
                //res.redirect("/login");
                res.render("login", {mess: "name or password is wrong"});
                //res.render("login", {mess: result});
            }
        }
    );
});
app.get('/mirai', (req, res) => {
    res.render("mirai", {mess: messAlert});
});
app.post("/mirai", (req,res)=>{
    const miraiCredit= req.body.miraiCredit;
    const miraiDebit= req.body.miraiDebit;
    const miraiName= req.body.miraiName;
    const miraiDate= req.body.miraiDate;
    //console.log("mirai " + miraiName +" "+ miraiDate +" "+ miraiCredit +" "+ miraiDebit);
    
    var flag=0;

    db.query(
        "Select * from expenses where name = ? AND date = ?",
        [miraiName,miraiDate],
        (err,result) =>{
            if(err){
                //console.log(err);
                //res.render("new", {mess: "abc " + err});
                res.render("mirai", {mess: "something is wrong"});
                flag=0;
                //console.log(flag);
                expenseAdd(flag);
            }
            else if(result.length>=1){
                flag=1;
                //console.log(flag);
                expenseAdd(flag);
            }
            else{
                flag=2;
                //console.log(flag);
                expenseAdd(flag);
                //console.log(result.length);
                //res.render("mirai", {mess: "todays expenses added"});
            }
        }
    );

    //console.log("exces"+ flag);
    function expenseAdd(flag){
        //console.log("exces"+ flag);
        
        if(flag == 0){
            //console.log("some problem");
        }
        else if(flag == 2){
            db.query(
                "INSERT INTO expenses (name,date,credit,debit) VALUES (?,?,?,?)",
                [miraiName,miraiDate,miraiCredit,miraiDebit],
                (err,result) =>{
                    if(err){
                        //console.log(err);
                        //res.render("login", {mess: "abc " + err});
                        res.render("mirai", {mess: "something is wrong"});
                    }
                    else{
                        res.render("mirai", {mess: "todays expenses added"});
                    }
                }
            );
        }
        else{
            //console.log("yes in 1");
            db.query(
                "UPDATE expenses SET credit = credit + ? WHERE name = ? AND date = ?",
                [miraiCredit,miraiName,miraiDate],
                (err,result) =>{
                    if(err){
                        //console.log(err);
                        //res.render("login", {mess: "abc " + err});
                        res.render("mirai", {mess: "something is wrong"});
                    }
                    else{
                    }
                }
            );

            db.query(
                "UPDATE expenses SET debit = debit + ? WHERE name = ? AND date = ?",
                [miraiDebit,miraiName,miraiDate],
                (err,result) =>{
                    if(err){
                        //console.log(err);
                        //res.render("login", {mess: "abc " + err});
                        res.render("mirai", {mess: "something is wrong"});
                    }
                    else{
                        res.render("mirai", {mess: "todays expenses added"});
                    }
                }
            );
        }

    }
});


app.get('/stats', (req, res) => {
    //res.render("stats", {mess: messAlert});
    res.render("stats", {statara : statara});
});

app.post('/stats', (req, res) => {
    const statsName= req.body.statsName;
    const statsDate= req.body.statsDate;
    db.query(
        "Select * from expenses where name = ? AND date = ?",
        [statsName,statsDate],
        (err,result) =>{
            if(err){
                //console.log(err);
                //res.render("new", {mess: "abc " + err});
                res.render("stats", {mess: "something is wrong"});
                flag=0;
                //console.log(flag);
                expenseAdd(flag);
            }
            else if(result.length>=1){
                //var statara=[];
                //statara.push(result);
                //console.log(result[0]["date"]);
                res.render("stats", {statara: [result[0]["date"],result[0]["credit"],result[0]["debit"] ] });
            }
            else{
                res.render("stats", {mess: "user don't exist"});
            }
        }
    );
});

/*app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})*/
const PORT = 5000;
app.listen(process.env.PORT || PORT, () =>console.log("running on port " + PORT));
