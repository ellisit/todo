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
      console.log(boolean);
      if( boolean == true ){
        res.redirect('/inscription');
        // fiare aparaitre pseudo deja utilisé
      }else{
        user.register(req.body.email, req.body.password);
        session = req.session ;
        session.uniqueID = req.body.email;
        res.redirect('/');
      };
    });
    
})

.get('/connection', function(req,res,next){
  res.render('pageapp-login.ejs');
})

.post('/connection', urlencodedParser, function(res,res,next ){
  user.verification(req.body.email,req.body.password, function(boolean){
      if( boolean == true){
        user.userID;
        console.log(user.userID);
        res.redirect('/');
      }else{
        res.redirect('/connection');
        //compte inexistant
      };
    });
})

.get('/deconnection', function(req,res,next){
  req.session.destroy();
  res.render('/');
})


.get('/', function(req,res,next){
  session = req.session ;
  res.render('index.ejs', {name : session.uniqueID});
})


.get('/supprimer/:id', function(req,res,next){
    user.remove(req.params.id);
    session.destroy();
  res.render('/');
})

.get('/task', function(req,res,next){
  res.render('tasklist.ejs');
})

.get('/task/supprimer/:id', function(req,res,next){
    task.remove(req.params.id);
  res.render('/');
})


.get('/contact', function(req,res,next){
  res.render('contact.ejs');
})


.get('/setting', function(req,res,next){
  res.render('setting.ejs');
})


.get('/credits', function(req,res,next){
  res.render('credits.ejs');
})

.get('/fallback', function(req,res,next){
  res.render('fallback.ejs');
})


.get('/task/modifier', function(req,res,next){
  res.render('/task');
})

.post('/task/formModifer', function( req,res,next){
  task.modifier(req.params.id,req.body.title,req.body.contenu,req.body.date);
 res.redirect('/task/modifier')
})

.get('/task/add', function(req,res,next){
  session = req.session;
  task.register(req.body.title, req.body.contenu,req.body.date,session.uniqueID);
  res.render('/task');
})



/* Supprime un élément de la todolist */
.get('/todo/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})




.listen(8080);