const dotEnv = require('dotenv');
const mySql=require('mysql');

dotEnv.config({path:'./.env'});
const con = mySql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.password,
    database:process.env.DB
})
con.connect(function(err,success){
    if(err) throw err;
    console.log("Connected");
});

const creteTableUser = `CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const createTablePosts = `CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
)`;

const createTableComments = `CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    author VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id)
)`;


con.query(createTableComments,function(err,success){
    if(err) throw err;
    console.log(success);
});






