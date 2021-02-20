const express = require('express');

const MODEL_PATH = '../models/';
const History = require(MODEL_PATH + 'history');
const Subtask = require(MODEL_PATH + 'subtask');
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
    //Generate history

    //Loop the current group subtasks and insert into history
    Subtask.find({ groupId: req.body.groupId }, (err, subtasks) => {
        subtasks.forEach((subtask) => {
            new History({
                subtaskId: subtasks.subtaskId,
                subtaskName: subtasks.subtaskName,
                subtaskPenalty: subtasks.subtaskPenalty,
                subtaskDone: subtasks.subtaskDone,
                userId: subtasks.userId,
                userName: subtask.userName,
                groupId: req.body.groupId,
                groupName: req.body.name,
                dateIni: new Date() - 7,
                dateFin: new Date(),
            }).save();
        })
    });


});

module.exports = router;
