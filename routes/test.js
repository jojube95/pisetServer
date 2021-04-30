const express = require('express');
const router = express.Router();
const MODEL_PATH = '../models/';
const Group = require(MODEL_PATH + 'group');
const request = require('request');
const { exec } = require("child_process");

let currentDate = new Date();

module.exports = function(io) {
  return router;
};


router.get('/restoreDatabase:id', (req, res, next) => {
  const mongoose = req.app.get('mongoose');

  const database = req.params.id;

  //mongorestore "mongodb+srv://cluster0.53xnf.mongodb.net/piset-test" -u root -p root --archive=database/test --drop
  let restoreProcess = 'mongorestore --archive=database/' + database + ' --drop';

  exec(restoreProcess, (error, stdout, stderr) => {
    if (error) {
      console.log('error: ' + error.message);
      res.status(500).json({
        error: error
      });
    }
    if (stderr) {
      console.log('stderr: ' + stderr);
      res.status(201).json({
        message: "Database restored"
      });
    }
    console.log('stdout: ' + stdout);
  });

});

router.get('/exportDatabase:id', (req, res, next) => {
  const mongoose = req.app.get('mongoose');

  const database = req.params.id;

  //mongodump "mongodb+srv://cluster0.53xnf.mongodb.net/piset-test" -u root -p root --archive=database/test
  let backupProcess = 'mongodump --db=' + database + ' --archive=database/' + database;

  exec(backupProcess, (error, stdout, stderr) => {
    if (error) {
      console.log('error: ' + error.message);
      res.status(500).json({
        error: error
      });
    }
    if (stderr) {
      console.log('stderr: ' + stderr);
      res.status(201).json({
        message: "Database exported"
      });
    }
    console.log('stdout: ' + stdout);
  });

});

router.get('/getCurrentDate', (req, res, next) => {
  res.status(200).json({
    message: "Success",
    currentDate: this.currentDate
  });

});

router.get('/nextWeek', (req, res, next) => {
  console.log('NextWeek');

  currentDate.setDate(currentDate.getDate() + 7);

  //Find all groups
  let groups = Group.find({}, (err, groups) => {
    //For each group. Generate history and reasign tasks
    groups.forEach((group) => {
      console.log('Process group: ' + group.name)
      let options = {
        uri: 'http://localhost:3000/api/histories/generate',
        method: 'POST',
        json: {group: group, currentDate: currentDate}
      };
      //Generate history
      request(options, function (error, response, body) {
        if (!error) {
          console.log('Histories generated for group: ' + group.name);
          options = {
            uri: 'http://localhost:3000/api/tasks/reasign',
            method: 'POST',
            json: {group: group, currentDate: currentDate}
          };
          //Reasign task
          request(options, function (error, response, body) {
            if (!error) {
              console.log('Task sheduled for group: ' + group.name);
            }
            else{
              console.log('ERROR Task sheduled for group: ' + group.name);
              res.status(200).json({
                message: "Success",
                currentDate: currentDate
              });
            }
          });
        }
        else{
          console.log('ERROR Histories generated for group: ' + group.name);
        }
      });
    })
  });


});

module.exports = router;
