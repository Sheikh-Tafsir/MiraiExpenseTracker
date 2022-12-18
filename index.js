const express = require('express')
const app = express();
const port = 4000;
const mysql = require('mysql2');
const Sequelize = require("sequelize");
require('dotenv').config()

const DB_URL=process.env.MYSQL_URL;
const DB_NAME=process.env.MYSQQLDATABASE || 'mirainikki';
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

app.set("view engine", "ejs");

/*app.use(async ctx=> {
    ctx.body = 'Hello World from Railway';
});*/

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
                res.render("signup", {messageAlert: "new user added"});
                //res.send({message:"value inserted"});
                
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
                res.render("login", {mess: "abc " + err});
                //res.render("login", {mess: "name or password is wrong"});
            }
            /*if(result.length >0){
                res.render("login", {mess: "logging in"});
            }*/
            else{
                //console.log("not ok");
                //res.send({message:"0"});    
                //res.render('index', {data:"0"});
                //res.render("index", {bro:0});
                //messAlert="not ok";
                //res.redirect("/login");
                //res.render("login", {mess: "2name or password is wrong"});
                res.render("login", {mess: result});
            }
        }
    );
});

/*app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})*/
const PORT = 5000;
app.listen(process.env.PORT || PORT, () =>console.log("running on port " + PORT));
