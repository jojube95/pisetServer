const express = require('express');
const bodyParser = require("body-parser");
const usersRoutes = require('./routes/users');
const groupsRoutes = require('./routes/groups');
const tasksRoutes = require('./routes/tasks');
const historiesRoutes = require('./routes/histories');
const invitationsRoutes = require('./routes/invitations');
const devicesRoutes = require('./routes/devices');
const achivementsRoutes = require('./routes/achivements');
const statesRoutes = require('./routes/states');
const testRoutes = require('./routes/test');
const Group = require('./models/group');
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

  //Find all groups
  let groups = Group.find({}, (err, groups) => {
    //For each group. Generate history and reasign tasks
    groups.forEach((group) => {

      let options = {
        uri: 'http://localhost:3000/api/histories/generate',
        method: 'POST',
        json: group
      };
      //Generate history
      request(options, function (error, response, body) {
        if (!error) {
          console.log('Histories generated for group: ' + group._id);
          options = {
            uri: 'http://localhost:3000/api/tasks/reasign',
            method: 'POST',
            json: group
          };
          //Reasign task
          request(options, function (error, response, body) {
            if (!error) {
              console.log('Task sheduled for group: ' + group._id);
            }
            else{
              console.log('ERROR Task sheduled for group: ' + group._id);
            }
          });
        }
        else{
          console.log('ERROR Histories generated for group: ' + group._id);
        }
      });
    })
  });
});

app.use('/api/users', usersRoutes);

app.use('/api/groups', groupsRoutes);

app.use('/api/tasks', tasksRoutes);

app.use('/api/histories', historiesRoutes);

app.use('/api/test', testRoutes);

app.use('/api/history', historiesRoutes);

app.use('/api/invitations', invitationsRoutes);

app.use('/api/devices', devicesRoutes);

app.use('/api/achivements', achivementsRoutes);

app.use('/api/states', statesRoutes);

module.exports = app;


