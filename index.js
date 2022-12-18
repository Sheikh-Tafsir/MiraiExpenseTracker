const express = require('express')
const app = express();
const port = 4000;
const mysql = require('mysql2');
const Sequelize = require("sequelize");
require('dotenv').config()


// create the connection to database
/*const db = mysql.createConnection({
    host: '0.0.0.0:6625',
    user: "taf",
    password: "taf30",
    database: 'mirainikki'
  });*/

const DB_URL=process.env.MYSQL_URL;
if(!DB_URL){
    throw Error("database env vars are not set");
}
/*const db = new Sequelize(DB_URL,{
  dialect: 'mysql'
});*/
const db = new Sequelize(DB_URL);


db.sync();
db.authenticate();

//const db = "mysql -hcontainers-us-west-178.railway.app -uroot -pmMvqAwWP2AI7a45CVzLd --port 6625 --protocol=TCP railway";


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

                res.render("login", {mess: "name or password is wrong"});
            }
            if(result.length>0){
                res.render("login", {mess: "logging in"});
            }
            else{
                //console.log("not ok");
                //res.send({message:"0"});    
                //res.render('index', {data:"0"});
                //res.render("index", {bro:0});
                //messAlert="not ok";
                //res.redirect("/login");
                res.render("login", {mess: "name or password is wrong"});
            }
        }
    );
});

/*app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})*/
const PORT = 5000;
app.listen(process.env.PORT || PORT, () =>console.log("running on port " + PORT));
