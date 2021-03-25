const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MODEL_PATH = '../models/';

const User = require(MODEL_PATH + 'user');
const History = require(MODEL_PATH + 'history');
const Task = require(MODEL_PATH + 'task');
const router = express.Router();

router.get('/get', (req, res, next) => {
  User.find().then(result =>{
    res.status(200).json({
      message: "Success",
      users: result
    });
  }).catch(err => {
    res.status(500).json({
      error : err
    })
  });
});

router.get('/getWithoutGroup', (req, res, next) => {
  User.find({ groups: [] }).then(result =>{
    res.status(200).json({
      message: "Success",
      users: result
    });
  }).catch(err => {
    res.status(500).json({
      error : err
    })
  });
});

router.get('/getByGroup:id', (req, res, next) => {
  User.find({groups: { $elemMatch: {groupId: req.params.id}}}).then(result =>{
    res.status(200).json({
      message: "Success",
      users: result
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error : err
    })
  });
});

router.get('/getByEmail:mail', (req, res, next) => {
  User.findOne({ mail: req.params.mail }).then(result =>{
    res.status(200).json({
      message: "Success",
      user: result
    });
  }).catch(err => {
    res.status(500).json({
      error : err
    })
  });
});

router.post('/addUserToGroup', (req, res, next) => {
  let group = {groupId: req.body.groupId, groupName: req.body.groupName, groupAdmin: false};

  User.updateOne({ _id: req.body.userId }, { $push: { groups: group}}).then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Success',
      res: result
    });
  }).catch(err => {
    res.status(500).json({
      error: err

    });
  });
});

router.post('/deleteUserFromGroup', (req, res, next) => {
  console.log("Trying delete user from group");

  User.updateOne({ _id: req.body.userId }, { $pull: {groups: {groupId: req.body.groupId}}}).then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Success',
      res: result
    });
    }).catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

router.post('/update', async (req, res, next) => {
  let hash = await bcrypt.hash(req.body.password, 10);

  let result = await User.updateOne({'_id': req.body._id}, {
    mail: req.body.mail,
    password: hash,
    name: req.body.name,
    secondName: req.body.secondName,
    admin: req.body.admin
  });

  if(result){
    console.log('User updated successfully');
    //Update histories user name
    let resultHistory = await History.updateMany({'userId': req.body._id}, {'$set':{'userName': req.body.name}});

    if(resultHistory){
      console.log('History user data updated successfully');
      //Update tasks user name
      let resultTask = await Task.updateMany({'userId': req.body._id}, {'$set':{'userName': req.body.name}});

      if(resultTask){
        console.log('Task user data updated successfully');

        res.status(201).json({
          message: 'Success',
          res: {
            "users": result,
            "tasks": resultTask,
            "histories": resultHistory
          }
        });
      }
      else{
        resultTask.status(500).json({
          error: err
        });
      }

    }
    else{
      resultHistory.status(500).json({
        error: err
      });
    }
  }
  else{
    result.status(500).json({
      error: err
    });
  }

});

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      'mail': req.body.mail,
      'password': hash,
      'name': req.body.name,
      'secondName': req.body.secondName,
      'admin': false,
      'groups': [],
      'achivements': []
    });
    user.save().then(result => {
      res.status(201).json({
        message: 'Success',
        user: result
      });
    }).catch(err => {
      res.status(500).json({
        error: err

      });

    });

  });
});

router.post('/signin', (req, res, next) => {
  let fetchedUser;
  console.log(req.body);

  User.findOne({mail: req.body.mail}).then(user => {
    if (!user) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    else {
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    }

  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
    else {
      const token = jwt.sign({
        mail: fetchedUser.mail,
        userId: fetchedUser._id
      }, 'secret_this_should_be_longer', {expiresIn: '1h'});
      res.status(201).json({
        message: 'Success',
        token: token,
        user: fetchedUser
      });
    }
  }).catch(err => {
    console.log(err);
  });
});

module.exports = router;



