const express = require('express');
const user_router = express.Router();
const {ObjectID}=require('mongodb');
const normalize = require('normalize-text').normalizeWhitespaces;
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config()

  //code user database
  user_router.route('/signin')
    .get(async (req,res) => {
        try {
			const result = await User.find({}).toArray();
            return Promise.resolve(res.json(result[0]));
		} catch (error) {
			return Promise.reject(error.message);
        }
    })
    .post(async (req,res) => {
        User.findOne({ user: req.body.user }, function(err, user) {
            if (!user) return res.send({success:false, msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
            //console.log('USER == ',user);
            if (user.password !== req.body.password){
                res.send({success:false, msg: 'Invalid password. Please try again!' });
            }

            res.send({success:true,result:user});
        });   
    })

    user_router.route('/signup')
    .post(async (req,res) => {
        try {
            var _Tempid = new ObjectID().toString();
            var data = req.body;
            data._id =_Tempid;
            // Make sure this account doesn't already exist
            User.find({  $or: [ {email: req.body.email}, {user:req.body.user }]}).toArray(async function (err, user){
                console.log('USER == ',process.env.USER_EMAIL);
                // Make sure user doesn't already exist
                if (user.length) return res.send({success:false, msg: 'The email address/user name you have entered is already associated with another account.' });
                // Create and save the user
                //user = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
                //await User.insertOne(data);
                // Create a verification token for this user
                var token=crypto.randomBytes(16).toString('hex');
                await Token.insertOne({ _id: _Tempid, token: token });

                // Save the verification token
                // Send the email
                let testAccount = await nodemailer.createTestAccount();
                let transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: process.env.USER_EMAIL, pass: process.env.PASSWORD_EMAIL } });
                var mailOptions = { from: 'no-reply@yourwebapplication.com', to: req.body.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token + '\n' };
                transporter.sendMail(mailOptions,async function (err) {
                        if (err) { return res.send({success:false, msg: err.message }); }
                        await User.insertOne(data);
                        res.send({success:true,msg:'A verification email has been sent to ' + req.body.email + '.'});
                    });
            });
		} catch (error) {
			return Promise.reject(error.message);
		}
    })
    
    user_router.route('/:id')
    .delete(async (req,res) => {
        try {
            var id = req.params.id;
            //await user.insertOne(data);
            await  user.deleteOne({_id: id});
			return Promise.resolve(res.json({ success: true }));
		} catch (error) {
			return Promise.reject(error.message);
		}
    })

// Exports cho biến field_router
module.exports = user_router;