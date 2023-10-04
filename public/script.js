const next = document.querySelector('.next')
const prev = document.querySelector('.prev')
const comment = document.querySelector('#list-comment')
const commentItem = document.querySelectorAll('#list-comment .item')
var translateY = 0;
var count = commentItem.length;

next.addEventListener('click', function (event) {
  event.preventDefault()
  if (count == 1) {
    // Xem hết bình luận
    return false
  }
  translateY += -400
  comment.style.transform = `translateY(${translateY}px)`
  count--
})

prev.addEventListener('click', function (event) {
  event.preventDefault()
  if (count == 3) {
    // Xem hết bình luận
    return false
  }
  translateY += 400
  comment.style.transform = `translateY(${translateY}px)`
  count++
})


function redirectToLoginPage() {
    window.location.href = "login.html";
}

window.onload = function() {
  checkIfUserIsLoggedIn()
    .then(isLoggedIn => {
      const userIcon = document.getElementById("login");
      if (isLoggedIn) {
        userIcon.innerHTML = "Username"; 
      } else {
        userIcon.addEventListener("click", redirectToLoginPage);
      }
    })
    .catch(error => {
      console.error('Error while checking if the user is logged in:', error);
    });
};


 function checkIfUserIsLoggedIn() {

  const token = document.cookie.split()

  if (token) {
    return fetch('http://localhost:3000/check-login', {
      credentials: 'include' 
    })
      .then(response => response.json())
      .then(data => {

        return data.loggedIn;
      })
      .catch(error => {
        console.error('Error while validating token:', error);
        return false;
      });
  }

  return false; 
}

document.getElementById('login-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const loginData = {
    username: username,
    password: password
  };

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
  

    const data = await response.json();

    if (data.loggedIn === true) {

      document.cookie = 'token=${data.token}'
      window.location.href = 'index.html';
    } else {
 
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
  }
});


function login(event) {
  event.preventDefault(); 

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.loggedIn === true) {
  
        document.cookie = 'token=${data.token}'
        if (data.isAdmin) {
          window.location.href = 'dashboard.html';
        } else {
          window.location.href = 'index.html';
        }
        
      } else {

        alert('Authentication failed. Please try again.');
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again later.');
    });
}