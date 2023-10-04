const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const tokenStore = {};

app.use(cookieParser());
app.use(express.json())
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  });
  

app.post('/login', (req, res) => {
  let isAdmin = false;
  let isAuthen = false;
  let token = req.cookies.token;
  if (token && tokenStore[token]){
    res.send({ message: 'already logged in'});
  }
  if (req.body.username === 'admin' && req.body.password === 'admin'){
    isAdmin = true;
    isAuthen = true;
    token = 'admin-token'
  } else if (req.body.username == 'user' && req.body.password === 'user'){
    isAdmin = false;
    isAuthen = true;
    token = 'user-token'
  }
  if (isAuthen) {
    tokenStore[token] = true;
    res.cookie('token', token, { httpOnly: true });
    res.send({ message: 'Login successful', loggedIn: true, isAdmin: isAdmin, token: token});
  } else{
    res.send({ message: 'Login failed'});
  }
});


app.get('/check-login', (req, res) => {
  const token = req.cookies.token;

  if (token && tokenStore[token]) {
    if (token.startsWith('admin')) {
        res.send({ loggedIn: true , isAdmin: true });
    } else {
        res.send({ loggedIn: true , isAdmin: false});
    }
  } else {
    res.send({ loggedIn: false });
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
