const User = require('../model/user.js');
const Exercise = require('../model/exercise.js');

exports.createUser = (req, res, callback) => {
  if(req.body.username.indexOf(" ") != -1){
    res.send("username cannot have spaces");
  } else if(req.body.username.length > 0){
    User.findOne({ "username": req.body.username }, (err, user) => {
      if(err) {
        res.json({ "error": "Unable to validate username"});
      } else if (user != null) {
        res.send("username already taken");
      } else {
        User.create({ "username": req.body.username }, (err, user) => {
          if(err) {
            res.send("unable to create user. try again");
          } else {
            res.json({ "username": user.username, "_id": user._id });
          }
        });
      }
    });
  } else  {
    res.send("username cannot be blank");
  }
}

exports.getUsers = (req, res, callback) => {
  User.find({}, (err, users) => {
    res.json(users);
  });
}

exports.createExercise = (req, res, callback) => {
  User.findById(req.body.userId, (err, user) => {
    if(err || user == null) {
      res.send('unkown _id');
    } else {
      let date = req.body.date.length < 1 ? new Date(Date.now()) : Date.parse(req.body.date);
      
      if (date) {
        if(!req.body.description) {
          res.send('description cannot be blank');
        } else if(req.body.duration == '') {
          res.send('duration cannot be blank');
        } else if(!parseInt(req.body.duration)) {
          res.send('duration must be integer');
        } else {
          Exercise.create({
            "user_id": user._id,
            "description": req.body.description,
            "duration": req.body.duration,
            "date": date,
          }, (err, exercise) => {
            if(err) {
              res.send('unable to create exercise');
            } else {
              let options = {weekday: 'short', day: 'numeric', month: 'short', year:'numeric'};
              res.json({
                "username": user.username, 
                "description": exercise.description,
                "duration": exercise.duration,
                "_id": exercise._id,
                "date": exercise.date.toLocaleDateString("en-US", options)
              });
            }
          });
        }
      } else {
        res.send('date is in the wrong format');
      }
    }
  });
}

exports.getUsersExcercises = (req, res, callback) => {
  if(req.query.userId == null) {
    res.send("userId parameter is required");
  } else {
    User.findById({"_id": req.query.userId}, (err, user) => {
      if(err || user == null) {
        res.send('unable to find user');
      } else {
        let query = { "user_id": user._id};
        if(req.query.from || req.query.to) {
          query.date = {};
          if(req.query.to) {
            query.date.$lte = req.query.to;
          }
          if(req.query.from) {
            query.date.$gte = req.query.from;
          }
        }
        Exercise.find(query).limit(parseInt(req.query.limit)).exec((err, exercises) => {
          if(err) {
            res.send('an error occurred while retrieving exercises');
          } else  {
            user = user.toJSON();
            user.count = exercises.length;
            user.log = exercises;
            res.json(user);
          }
        });
      }
    }); 
  }
}