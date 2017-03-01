const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup',(req,res,next)=>{
  res.render('auth/signup-view.ejs');
});

router.post('/signup',(req,res,next)=>{
  const username = req.body.username;
  const password = req.body.password;

  if(username === '' || password === ''){
    res.render('auth/signup-view.ejs',{
      errorMessage: 'Pleasw fill out both username and password'
    });
    return;
  }

  User.findOne({ username: username }, {username: 1}, (err,result) =>{
    if(err){
      next(err);
      return;
    }

    if(result !== null){
      res.render('auth/signup-view.ejs',{
        errorMessage: 'The username already exists'
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const userInfo = {
      username : username,
      password : hashPass
    };

    const user = new User(userInfo);

    user.save((err)=>{
      if(err){
        res.render('auth/signup-view.ejs', {
          errorMessage: 'Oops! there was a problem. Try again later'
        });
      }
      res.redirect('/');
    });
    return;
  });

});


router.get('/login',(req,res,next)=>{
  res.render('auth/login-view.ejs');
});

router.post('/login',(req,res,next)=>{
  const username = req.body.username;
  const password = req.body.password;

  if(username==='' || password ===''){
    res.render('auth/login-view.ejs',{
      errorMessage: 'Indicate a username and password to log in'
    });
    return;
  }

  User.findOne({username: username}, (err,user)=>{
    if(err){
      next(err); return;
    }

    if(!user){
      res.render('auth/login-view.ejs',{
        errorMessage: 'The username doesn\'t exist'
      });
      return;
    }

    if(bcrypt.compareSync(password, user.password)){
      req.session.currentUser = user;//Saving user to 'currentUser' session field
      res.redirect('/');
    }else{
      res.render('auth/login-view.ejs',{
        errorMessage: 'The password is incorrect'
      });
      return;
    }
  });
});

router.get('/logout',(req,res,next)=>{
  //Destroy the session
  req.session.destroy((err)=>{
    if(err){
      next(err);
      return;
    }

    res.redirect('/');
  });
});

module.exports = router;
