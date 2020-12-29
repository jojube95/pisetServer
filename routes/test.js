const express = require('express');
const router = express.Router();

const { exec } = require("child_process");

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

module.exports = router;
