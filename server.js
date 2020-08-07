const express = require('express')
const path =  require('path')
const mysql = require('mysql')
const session = require('express-session')
const bodyparser = require('body-parser')
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
	database : 'nodelogin'
});

const app = express()
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use('/static', express.static('scripts'))
app.use(bodyparser.urlencoded({extended : true}))
app.use(bodyparser.json())
app.use(function (req, res, next){
    res.locals.scripts = ['static/client.js']
    next();
})
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
  
});

app.post('/auth',function(request,response){

    var user = request.body.user;
    var wallet = request.body.wallet;
    console.log(wallet)
    console.log(user)
    if(user && wallet){
        connection.query('SELECT * FROM acc WHERE user = ? AND wallet = ?', [user, wallet],function(err, results, fields){
            if(results.length > 0){
                request.session.loggedin = true;
				request.session.username = user;
				response.redirect('/home');
            }
            else{
                response.send('Incorrect Username and Wallet ID!');
                
            }
            response.end()
        } );
        
    }else{
        response.send('PLEASE ENTER USERNAME AND PASSWORD')
        response.end();
    }
})
app.post('/test',(req,res)=>{
    
    console.log(req.body)
    randomNum = Math.floor(100000000 + Math.random() * 900000000)
    res.send({message : randomNum.toString(16)})
})
app.post('/signup', function(req,res){
    var user = req.body.username;
    var wallet = req.body.password;
    console.log(wallet)
    if(user && wallet){
        
        connection.query(`INSERT INTO acc(user, wallet) VALUES( '${user}', '${wallet}')` ,function(err,result){
                if(err) throw err;
                console.log("inserted")
        });
    }
    res.redirect('/')
})

app.post('/sample',(req,res)=>{
    console.log(req.body)
    res.end()
    
})

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

const port = 3000

app.listen(port)