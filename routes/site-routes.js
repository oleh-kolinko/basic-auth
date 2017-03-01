const express = require('express');
const router = express.Router();

router.use((req,res,next)=>{
  if(req.session.currentUser){
    next();
  }else{
    res.redirect('/login');
  }
});

router.get('/secret',(req,res,next)=>{

  res.render('secret-view.ejs');
});

router.get('/cia-files',(req,res,next)=>{

  res.render('cia-files.ejs');
});

module.exports = router;
