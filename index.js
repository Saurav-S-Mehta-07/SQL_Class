const {faker} = require("@faker-js/faker");
const mysql =  require("mysql2");
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require("method-override");
const { pseudoRandomBytes } = require("crypto");


app.set("view engine","ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const connection =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'mysqlpassword@123'
});

let getRandomUser = ()=> {
  return [
     faker.string.uuid(),
     faker.internet.username(),
     faker.internet.email(),
     faker.internet.password(),
    ];
}


//home route
app.get("/",(req,res)=>{
   let q = "select count(*) from user";
    try{
     connection.query(q,(err,result)=>{
       if(err) throw err;
       let count = result[0]["count(*)"];
       res.render("home",{count});
     })

     }catch(err){
         console.log(err);
         res.send("some error in DB");
     }
});


//show route
app.get("/user",(req,res)=>{
    let q = "select * from user";
    try{
     connection.query(q,(err,result)=>{
       if(err) throw err;
       res.render("show",{result});
     })

     }catch(err){
         console.log(err);
         res.send("some error in DB");
     }

});

//edit route
app.get("/user/edit/:id",(req,res)=>{
    let {id} = req.params;
    let q = `select * from user where id = '${id}'`;
    try{
     connection.query(q,(err,result)=>{
       if(err) throw err;
       let user = result[0];
       res.render("edit",{user});
     })

     }catch(err){
         console.log(err);
         res.send("some error in DB");
     }
});

//update route
app.patch("/user/:id",(req,res)=>{
   let {id} = req.params;
   let {username, password} = req.body;

    let q = `select * from user where id = '${id}'`;
    try{
     connection.query(q,(err,result)=>{
       if(err) throw err;
       let user = result[0];
       if(user.password == password){

          let q = `update user set username = '${user.username}' where id = '${user.id}'`;
            try{
            connection.query(q,(err,result)=>{
              if(err) throw err;
              let user = result[0];
              res.render("edit",{user});
            })
            }catch(err){
               console.log(err);
               res.send("some error in DB");
           }

          res.redirect("/user");
       }

       else{
         res.send("wrong password");
       }
       
     })

     }catch(err){
         res.send("some error in DB");
     }
});


app.listen(8080,()=>{
  console.log("server is listening to 8080");
})
