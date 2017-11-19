var express = require("express"),
        app = express();

var isHomePage = true;        

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

// app.use(function(req,res,next){
//    res.locals.isHomePage = isHomePage;   
// });

app.get("/", function(req, res){
   res.redirect("/landing"); 
});

app.get("/landing", function(req, res){
   res.render("landing", {isHomePage: true}); 
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