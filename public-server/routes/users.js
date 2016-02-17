var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User');


router.get('/index', function(req, res) {
  User.find(function (err, users) {
      if(err)res.send(500, err.message);
      
      console.log('GET /users');
      res.status(200).jsonp(users);
  });
});

router.get('/find/:id', function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err)res.send(500, err.message);
    res.setHeader("Content-type", "application/json");
    res.status(200); 
    res.send(JSON.stringify(user));
  });
});

router.post('/create', function(req, res) {
    console.log('POST /user/create');
        console.log(req.body);
        
        var user = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        });
        
        user.save(function(err, user){
           if(err) return res.status(500).send(err.message);
           res.setHeader("Content-type", "application/json");
           res.status(200); 
           res.send(JSON.stringify(user));
        });
});

router.post('/update/:id', function(req, res) {
    
        console.log(req.body);
    User.findById(req.params.id, function (err, user) {
        if(err) return res.send(500, err.message);
        
        user.userName = req.body.userName;
        user.email = req.body.email;
        user.password = req.body.password;
        
        user.save(function (err) {
            if(err) return res.send(500, err.message);
            res.setHeader("Content-type", "application/json");
            res.status(200); 
            res.send(JSON.stringify(user));
        });
    });
});

router.get('/delete/:id', function(req, res) {
  User.findById(req.params.id, function (err, user) {
        if(err) return res.send(500, err.message);
        
        user.remove(function (err) {
            if(err) return res.send(500, err.message);
            return res.status(200).send('User Deleted');
        });
    });
});

module.exports = router;