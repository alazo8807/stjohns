var     express = require("express"),
            app = express(),
       passport = require("passport"),
     bodyParser = require("body-parser"),
       mongoose = require("mongoose"),
     nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
          flash = require('connect-flash'),
LocalStrategy = require("passport-local");

var User = require("./models/user");
 
var isHomePage = true;        

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp-camp", {useMongoClient: true});

app.set("view engine", "ejs");
app.use( bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(flash());

//======================  
//PASSPORT CONFIGURATION
//======================
app.use(require("express-session")({
    secret: "This can be anything",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/", function(req, res){
   res.redirect("/landing"); 
});

app.get("/landing", function(req, res){
   res.render("landing", {isHomePage: true}); 
});

app.post("/", function(req,res){
   var nodemailer = require('nodemailer');
   
   var transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: 'stjohnkitchener@gmail.com',
       pass: 'Guadalupe1234'
     }
   });
   
   
   var mailOptions = {
     from: req.body.email,
     to: 'stjohnkitchener@gmail.com',
     subject: 'From ' + req.body.name,
     text: 'Reply to: ' + req.body.email + '\r\r' +  req.body.comments
   };
   
   transporter.sendMail(mailOptions, function(error, info){
     if (error) {
       console.log(error);
       req.flash("error", "Sorry, There was an error and your message could not be sent.")     //It has to be before redirect
       res.redirect("/landing");
     } else {
       console.log('Email sent: ' + info.response);
       req.flash("success", "Thank you! You message has been sent.")     //It has to be before redirect
       res.redirect("/landing");
     }
   });
});

app.get("/login", function(req, res) {
    res.render("login", {isHomePage: false});    
});

app.get("/homilies", function(req, res) {
   res.render("homilies", {isHomePage: false}); 
});

app.get("/bulletin", function(req, res) {
   res.render("bulletin", {isHomePage: false}); 
});

app.get("/calendar", function(req, res) {
   res.render("calendar", {isHomePage: false}); 
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});