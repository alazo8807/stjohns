var     express = require("express"),
            app = express(),
     bodyParser = require("body-parser"),
       mongoose = require("mongoose"),
     nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
          flash = require('connect-flash'),
       passport = require("passport"),
LocalStrategy = require("passport-local");

var User = require("./models/user");
 
var pageId = "home";        

mongoose.Promise = global.Promise;
mongoose.connect("process.env.DATABASEURL", {useMongoClient: true});

// mongoose.connect("mongodb://localhost/stjohns", {useMongoClient: true});

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
    res.locals.userLogged = req.user;
    next();
});

app.get("/", function(req, res){
   res.redirect("/landing"); 
});

app.get("/landing", function(req, res){
   res.render("landing", {pageId: "home"}); 
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
     to: 'pastor@stjohnskitchener.ca',
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

//-----------------------
//AUTH ROUTES------------
//-----------------------
app.get("/login", function(req, res) {
    res.render("login", {pageId: "login"});    
});

app.post("/login", passport.authenticate("local", {
        successRedirect: "/landing",
        failureRedirect: "/login"
    }), 
function(req, res) {
});


app.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You logged out successfully");
    res.redirect("/landing");
})

app.get("/register", function(req, res) {
    res.render("register", {pageId: "register"});    
});

app.post("/register", function(req, res) {
   
   console.log("here");
   var newUser = new User({username: req.body.username});
   var password = req.body.password;
   User.register(newUser, password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            console.log("here2");
            req.flash("success", "Welcome " + req.user.username + "!");
            res.redirect("/landing");
        });
   }) 
});

app.get("/homilies", function(req, res) {
   res.render("homilies", {pageId: "homilies"}); 
});

app.get("/bulletin", function(req, res) {
   res.render("bulletin", {pageId: "bulletin"}); 
});

app.get("/calendar", function(req, res) {
   res.render("calendar", {pageId: "calendar"}); 
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});