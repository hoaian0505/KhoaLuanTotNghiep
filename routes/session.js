const express = require('express');
const session_router = express.Router();
const {ObjectID}=require('mongodb');

  //code session
  session_router.route('/getsession')
    .get(async (req,res) => {
        try {
          //check session
          if (req.session.User){
            // return Promise.resolve(res.status(200).json({status: 'success', session: req.session.User.Loggedin}))
            return Promise.resolve(res.redirect('/app/home'));
          }
          else {
            // return Promise.resolve(res.status(200).json({status: 'error', session: 'No session'}));
            return Promise.resolve(res.redirect('/'));
          }
		    } catch (error) {
          return Promise.reject(res.status(200).json(error.message));
        }
    })

    session_router.route('/islogged')
    .get(async (req,res) => {
        try {
          //check session
          if (req.session.User){
            console.log('REQ SESSIOn == ',req.session.User);
            // return Promise.resolve(res.status(200).json({status: 'success', session: req.session.User.Loggedin}))
            return Promise.resolve(res.status(200).json(req.session.User));
          }
          else {
            // return Promise.resolve(res.status(200).json({status: 'error', session: 'No session'}));
            return Promise.resolve(res.status(200).json(false));
          }
		    } catch (error) {
          return Promise.reject(res.status(200).json(error.message));
        }
    })

  session_router.route('/login')
    .get(async (req,res) => {
        try {
          // console.log('REQ PARA ==',req.query.user)
          req.session.User = {
            Loggedin: true,
            user: req.query.user,
          }
          // return Promise.resolve(res.status(200).json({status: 'success', session: req.session.User}))
          return Promise.resolve(res.redirect('/app/home'));
		    } catch (error) {
          return Promise.reject(res.status(200).json(error.message));
        }

    })

  session_router.route('/logout')
    .get(async (req,res) => {
        try {
          if (req.session.User) {
            //delete session object
            req.session.destroy(function(err) {
              if(err) {
                return Promise.reject(res.status(200).json(err.message));
              }
              return Promise.resolve(res.redirect('/'));
            });
          }
          else {
            return Promise.resolve(res.redirect('/'));
          }
		    } catch (error) {
          return Promise.reject(res.status(200).json(error.message));
        }

    })

// Exports cho biến field_router
module.exports = session_router;