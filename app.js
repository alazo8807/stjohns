var express = require("express"),
        app = express();
        

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

app.use

app.get("/", function(req, res){
   res.redirect("/landing"); 
});

app.get("/landing", function(req, res){
   res.render("landing"); 
});

app.get("/homilies", function(req, res) {
   res.render("homilies"); 
});

app.get("/bulletin", function(req, res) {
   res.render("bulletin"); 
});

app.get("/calendar", function(req, res) {
   res.render("calendar"); 
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});