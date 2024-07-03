const dotEnv = require('dotenv');
const mySql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
dotEnv.config({ path: './.env' });
const con = mySql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.password,
    database: process.env.DB
})
con.connect(function (err, success) {
    if (err) throw err;
    console.log("Connected");
});

app.post('/api/register', function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    if (!userName) {
        res.status(200).json({
            massage: "Enter Username"
        });
        return;
    }
    if (!password) {
        res.status(200).json({
            massage: "Enter Username"
        });
        return;
    }
    const checkValidUser = `select count(id) as count from users where username=?`;
    con.query(checkValidUser, [userName], function (err, success) {
        if (err) throw err;
        if (success[0]["count"] != 0) {
            res.status(200).json({
                massage: "User already Exists"
            });
        }
        else {
            const query = `INSERT INTO users (username,password) values(?,?)`;
            con.query(query, [userName, password], function (err, success) {
                if (err) throw err;
                res.status(200).json({
                    massage: "User Register Successfully"
                });
            });
        }
    });
});

app.post('/api/login', function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    if (!userName) {
        res.status(200).json({
            massage: "Enter Username"
        });
        return;
    }
    if (!password) {
        res.status(200).json({
            massage: "Enter Username"
        });
        return;
    }
    const checkValidUser = `select count(id) as count from users where username=? and password=?`;
    con.query(checkValidUser, [userName, password], function (err, success) {
        if (err) throw err;
        if (success[0]["count"] == 0) {
            res.status(200).json({
                massage: "User Not Found"
            });
        }
        else {
            res.status(200).json({
                massage: "User login Successfully"
            });
        }
    });
});

app.post('/api/posts', function (req, res) {
    const title = req.body.title;
    const content = req.body.content;
    const authorId = req.body.author_id;
    if (!title) {
        res.status(200).json({
            massage: "plz Enter Titile"
        });
        return;
    }
    if (!content) {
        res.status(200).json({
            massage: "plz Enter Content"
        });
        return;
    }
    if (!authorId) {
        res.status(200).json({
            massage: "plz Enter author_id"
        });
        return;
    }
    const checkValidAuthor_id = `select count(id) as count from users where id=?`;
    con.query(checkValidAuthor_id, [authorId], function (err, success) {
        if (err) throw err;
        if (success[0]["count"] == 0) {
            res.status(200).json({
                massage: "Enter valid author id"
            });
        }
        else {
            const checkValidPost = `select count(title) as count from posts where title=?`;
            con.query(checkValidPost, [title], function (err, success) {
                if (err) throw err;
                if (success[0]["count"] != 0) {
                    res.status(200).json({
                        massage: "Enter valid title this title Already exists"
                    });
                }
                else {
                    const query = `insert into posts (title,content,author_id) values(?,?,?)`;
                    con.query(query, [title, content, authorId], function (err, success) {
                        if (err) throw err
                        res.status(200).json({
                            massage: "Post upload Successfully"
                        });
                    });
                }
            });

        }
    });

});

app.get('/api/posts', function (req, res) {

    const limit = req.body.limit;
    const page = (req.body.page - 1) * limit;
    const query = `select * from posts limit ` + page + `,` + limit;
    con.query(query, function (err, success) {
        if (err) throw err;
        res.status(200).json({
            postRecord: success
        })
    });
});

app.get('/api/post', function (req, res) {
    const id = req.body.id;
    const checkValidId = `select count(id) as count from posts where id=` + id;
    con.query(checkValidId, function (err, success) {
        if (err) throw err;
        if (success[0]["count"] == 0) {
            res.status(200).json({
                massage: "enter valid id"
            });
            return;
        }
    });

    const query = `SELECT posts.*,users.username as author FROM posts INNER JOIN users ON users.id = posts.author_id where posts.id =` + id;
    con.query(query, function (err, success) {
        if (err) throw err;
        res.status(200).json({
            data: success
        })
    })
});

app.put('/api/posts', function (req, res) {
    const id = req.body.id;
    const title = req.body.title;
    const content = req.body.content;
    if (!id) {
        res.status(200).json({
            massage: "plz enter id"
        });
        return;
    }
    if (!title) {
        res.status(200).json({
            massage: "plz enter title"
        });
        return;
    }
    if (!content) {
        res.status(200).json({
            massage: "plz enter content"
        });
        return;
    }

    const checkValidId = `select count(id) as count from posts where id=` + id;
    con.query(checkValidId, function (err, success) {
        if (err) throw err;
        if (success[0]["count"] == 0) {
            res.status(200).json({
                massage: "enter valid id"
            });
            return;
        }
        else {
            const query = `update posts set title=?,content=?,updated_at=current_timestamp where id=` + id;
            con.query(query, [title, content], function (err, success) {
                if (err) throw err;
                res.status(200).json({
                    data: success
                });
            });
        }
    });
});
app.delete('/api/posts',function(req,res){
    const id = req.body.id;
    if (!id) {
        res.status(200).json({
            massage: "plz enter id"
        });
        return;
    }
    const checkValidId = `select count(id) as count from posts where id=` + id;
    con.query(checkValidId, function (err, success) {
        if (err) throw err;
        if (success[0]["count"] == 0) {
            res.status(200).json({
                massage: "enter valid id"
            });
            return;
        }
        else {
            const query = `delete from posts where id=` + id;
            con.query(query, function (err, success) {
                if (err) throw err;
                res.status(200).json({
                    massage:"Posts Deleted"
                });
            });
        }
    });
});


app.get('/api/users/post', function (req, res) {
    const id = req.body.id;
    const checkValidId = `select count(id) as count from users where id=` + id;
    con.query(checkValidId, function (err, success) {
        if (err) throw err;
        if (success[0]["count"] == 0) {
            res.status(200).json({
                massage: "enter valid id"
            });
            return;
        }
        else
        {
            const query = `SELECT posts.*,users.username as author FROM posts INNER JOIN users ON users.id = posts.author_id where users.id =` + id;
            con.query(query, function (err, success) {
                if (err) throw err;
                res.status(200).json({
                    data: success
                })
            })
        }
    });
  
});

app.listen(3000);







