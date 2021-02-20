const express = require('express');
const bodyParser = require("body-parser");
const usersRoutes = require('./routes/users');
const groupsRoutes = require('./routes/groups');
const tasksRoutes = require('./routes/tasks');
const subtasksRoutes = require('./routes/subtasks');
const historiesRoutes = require('./routes/histories');
const testRoutes = require('./routes/test');
const Group = require(MODEL_PATH + 'group');
const cron = require('node-cron');
const request = require('request');
const app  = express();




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

cron.schedule("59 23 * * SUN", function () {
  let currentdate = new Date();
  let datetime = "Last Sync: " + currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();

  console.log("Running Cron Job at: " + datetime);

  //Do something
  //Get all groups
  let groups = Group.find({}, (err, groups) => {
    groups.forEach((group) => {
      //Do this for all groups
      let options = {
        uri: 'http://localhost:3000/api/tasks/reasign',
        method: 'POST',
        json: group
      };
      request.post(options, function (error, response, body) {
        if (!error) {
          console.log('Task sheduled for group: ' + group._id);
        }
        else{
          console.log('ERROR Task sheduled for group: ' + group._id);
        }
      });
    })
  });



});

app.use('/api/users', usersRoutes);

app.use('/api/groups', groupsRoutes);

app.use('/api/tasks', tasksRoutes);

app.use('/api/subtasks', subtasksRoutes);

app.use('/api/histories', historiesRoutes);

app.use('/api/test', testRoutes);

app.use('/api/history', historiesRoutes);

module.exports = app;


