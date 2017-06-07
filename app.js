var express = require('express');
var sessions = require('express-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var path = require('path');
var app = express();
var user = require('user');
var mysql = require('mysql');
var session; 

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todolist"
});

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

/* On utilise les sessions */
app.use(sessions({secret: 'zbla', saveUninitialized: false, resave: false}))


/* Inscription */
.get('/inscription', function(req, res, next){
  res.render('pageapp-sigin.ejs');
})

.post('/inscription',urlencodedParser, function(req, res){
    user.verification(req.body.email, req.body.password, function(boolean){
      if( boolean == true ){
        res.redirect('/inscription');
        // fiare aparaitre pseudo deja utilisé
      }else{
        user.register(req.body.email, req.body.password);
        res.redirect('/connection');
      };
    });
    
})

.get('/connection', function(req,res,next){
 
  res.render('pageapp-login.ejs');
})

.post('/connection', urlencodedParser, function(req,res){
  user.connection(req.body.email,req.body.password, function(boolean){
      session = req.session;
      if( boolean !== null){
        session.userId = boolean[0].id;
        return res.redirect('/');
      }else{
        return res.redirect('/connection');
        //compte inexistant
      }
    });
})

.get('/deconnection', function(req,res,next){
  req.session.destroy();
  res.redirect('/');
})


.get('/', function(req,res,next){
  session = req.session ;
  res.render('index.ejs', {name : session.userId});
})


.get('/supprimer/:id', function(req,res,next){
    user.remove(req.params.id);
  res.redirect('/');
})

.get('/taskslist', function(req,res,next){
  res.render('taskslist.ejs',{name : session.userId});
})

.get('/task/supprimer/:id', function(req,res,next){
    task.remove(req.params.id);
  res.redirect('/');
})


.get('/contact', function(req,res,next){
  res.render('contact.ejs',{name : session.userId});
})





.get('/credits', function(req,res,next){
  res.render('credits.ejs',{name : session.userId});
})

.get('/fallback', function(req,res,next){
  res.render('fallback.ejs',{name : session.userId});
})


.get('/task/modifier', function(req,res,next){
  res.redirect('/task');
})

.post('/task/formModifer', function( req,res,next){
  task.modifier(req.params.id,req.body.title,req.body.contenu,req.body.date);
 res.redirect('/task/modifier')
})

.get('/task/add', function(req,res,next){
  session = req.session;
  task.register(req.body.title, req.body.contenu,req.body.date,session.uniqueID);
  res.redirect('/task');
})

.get('/index', function(req,res,next){
  res.redirect('/');
})




.listen(8080);