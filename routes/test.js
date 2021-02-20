const express = require('express');
const router = express.Router();

const { exec } = require("child_process");

let currentDate = new Date();

module.exports = function(io) {
  return router;
};


router.get('/restoreDatabase:id', (req, res, next) => {
  const mongoose = req.app.get('mongoose');

  const database = req.params.id;

  let restoreProcess = 'mongorestore --archive=database/' + database + ' --drop';

  exec(restoreProcess, (error, stdout, stderr) => {
    if (error) {
      console.log('error: ' + error.message);
      return;
    }
    if (stderr) {
      console.log('stderr: ' + stderr);
      return;
    }
    console.log('stdout: ' + stdout);
  });

});

router.get('/exportDatabase:id', (req, res, next) => {
  const mongoose = req.app.get('mongoose');

  const database = req.params.id;

  let backupProcess = 'mongodump --db=' + database + ' --archive=database/' + database;

  exec(backupProcess, (error, stdout, stderr) => {
    if (error) {
      console.log('error: ' + error.message);
      return;
    }
    if (stderr) {
      console.log('stderr: ' + stderr);
      return;
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
  currentDate.setDate(currentDate.getDate() + 7);

  console.log(currentDate);

  res.status(200).json({
    message: "Success",
    currentDate: currentDate
  });
});

module.exports = router;
