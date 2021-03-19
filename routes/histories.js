const express = require('express');

const MODEL_PATH = '../models/';
const History = require(MODEL_PATH + 'history');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

module.exports = function(io) {
    return router;
};

router.get('/getByUser:id', (req, res, next) => {
    History.find({ userId: req.params.id }).then(result =>{
        res.status(200).json({
            message: "Success",
            histories: result
        });
    }).catch(err => {
        res.status(500).json({
            error : err
        })
    });

});

router.post('/addHistory', (req, res, next) => {
    const history = new History({
        subtaskId: req.body.history.subtaskId,
        subtaskName: req.body.history.subtaskName,
        subtaskPenalty: req.body.history.subtaskPenalty,
        subtaskDone: req.body.history.subtaskDone,
        userId: req.body.history.userId,
        dateIni: req.body.history.dateIni,
        dateFin: req.body.history.dateFin,
    });

    history.save().then(result => {
        res.status(201).json({
            message: 'History added successfully',
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/generate', async (req, res, next) => {
    let dateIni;
    let dateFin;

    if(req.body.currentDate == undefined){
        dateFin = new Date();
    }
    else{
        dateFin = new Date(req.body.currentDate);
    }
    dateIni = new Date().setDate(dateFin.getDate() - 7);

    //Generate history
    console.log('Generate histories for group: ' + req.body.group.name);
    //Loop the current group subtasks and insert into history
    Subtask.find({ groupId: req.body.group._id }, (err, subtasks) => {
        subtasks.forEach((subtask) => {
            new History({
                subtaskId: subtask._id,
                subtaskName: subtask.name,
                subtaskPenalty: subtask.penalty,
                subtaskDone: subtask.done,
                userId: subtask.userId,
                userName: subtask.userName,
                groupId: req.body.group._id,
                groupName: req.body.group.name,
                dateIni: dateIni,
                dateFin: dateFin
            }).save();

        })
    }).then(result => {
        res.status(201).json({
            message: 'Histories generated successfully',
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;
