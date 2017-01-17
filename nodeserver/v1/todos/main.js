module.exports = function (opts) {
    var http = require('http');
    var url = require('url');
    var express = require('express');
    var winston = opts.winston || require('winston');
    var fs = require('fs');
    var inspect = require('util').inspect;
    var current_files = {};
    var doDelete = true;
    var     ObjectID = require('mongodb').ObjectID;

    var expiry = opts.expiry || 86400000; //24 hours

    var multer = require('multer');

    var router = express.Router();

    var module = {};

    var todos = opts.todos;


    module.router = router;

    var storage = multer.memoryStorage();


    router.get('/', function (req, res) {
        var options = {
            "limit": 20,
            "sort": "created"
        }
        todos.find({}, options).toArray((function (err, results) {
            if (err) {
                winston.error(err);
            }
            winston.debug(results); // output all records
            res.send(JSON.stringify(results));
            return;
        }));
        return;
    });

    router.post('/', function (req, res) {
        // winston.debug(req);
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        todos.insert(req.body);
        res.status(201).end();
        return;
    });

    router.delete('/:id', function (req, res) {
        // winston.debug(req);
        // todos.delete({_id:id});
        winston.debug('request params=' + JSON.stringify(req.params));
        winston.debug('request body=' + JSON.stringify(req.body));
        todos.remove({_id: ObjectID(req.params.id)},{w:1}, function (error, result) {
            if (error) {
                winston.error(error);
            }
            winston.debug(result.result);
        });

         res.status(201).end();


    });



    return module;
};