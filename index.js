import { faker } from "@faker-js/faker";
import mysql from "mysql2";

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'mysqlpassword@123'
});

try{
    connection.query('show tables', (err,result)=>{
      if(err) throw err;
      console.log(result);
    })
}catch(err){
    console.log(err);
}

connection.end();


let gerRandomUser = ()=> {
  return {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}