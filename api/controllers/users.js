const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

exports.users_get_all = (req, res, next) => {
    User.find()
        .select('_id email')                        // Only return user ID and email address
        .exec()
        .then(users => {
            if (users.length >= 1) {                // Check if there are 1 or more users registered in the DB
                return res.status(200).json({       // Return success, number of users, and then user information
                    count: users.length,
                    users: users
                });
            } else {
                return res.status(404).json({
                    message: "No registered users!" // In theory this should never be returned as user auth is checked to enter this function
                });
            }
        })
        .catch(err => {
            return res.status(500).json({           // If query fails return internal error HTML status code and error information
                error: err
            });
        });
};

exports.users_create_user = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists!"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(user);
                                res.status(201).json({
                                    message: "User created!"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                        });
                    }
                });
            }
        });   
};

exports.users_login = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: "Auth failed!"
            });
        } else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        }, process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        });
                    return res.status(200).json({
                        message: "Auth successful!",
                        token: token
                    });
                }
                return res.status(401).json({
                    message: "Auth failed"
                });
                }
            );
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
};

exports.users_delete_user = (req, res, next) => {
    User.findByIdAndRemove(req.params.userId)
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted!"
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};
