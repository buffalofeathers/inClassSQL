var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10, 
    host: 'localhost',
    user: 'exampleUser',
    password: 'scientific12678',
    database: 'InClassExample'
});

var app = express();

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send("Hello World!");
});

app.route('/api/courses')
    .get(function(req, res) {
        getCourses()
            .then(function(courses) {
                res.send(courses);
            }, function(err) {
                res.status(500).send(err);
            });
            
     })

     .post(function(req,res) {
         createCourse(req.body.name, req.body.description)
         .then(function(id) {
             res.status(201).send(id);
         }, function(err) {
             res.status(500).send(err);
         });
     });

app.route('/api/courses/:id')
    .get(function(req, res) {
        getCourse(req.params.id)
            .then(function(course) {
                 res.send(course);
            }, function(err) {
                res.status(500).send(err);
             });
    });

app.listen(3000);

function getCourses() {
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query('CALL GetCourses();', function(err, resultsets) {
                    if (err) {
                        connection.release();
                        reject(err);
                    } else {
                        connection.release();
                        resolve(resultsets[0]);
                    }
                });
            }
        });
    });
}
function getCourse(id) {
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query('CALL GetCourse(?);', [id], function(err, resultsets) {
                    if (err) {
                        connection.release();
                        reject(err);
                    } else {
                        connection.release();
                        var returnedCourses = resultsets[0];
                        resolve(returnedCourses[0]);
                    }
                });
            }
        });
    });
}
function createCourse(name, description) {
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query('CALL InsertCourse(?,?);', [name, description], function(err, resultsets) {
                    if (err) {
                        connection.release();
                        reject(err);
                    } else {
                        connection.release();
                        var results = resultsets[0];
                        resolve(results[0]);
                        
                    }
                });
            }
        });
    });
}