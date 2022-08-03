// Client facing scripts here
$(document).ready(function() {

  //LOGIN BUTTON
  const startLoginButton = function () {
    $loginButton = $('#login');
    $loginButton.on('click', function () {
      closeForms();
      $('.overlay').css('visibility', 'visible');
      $('.login-wrapper').slideDown('slow');
    })
  }
  startLoginButton();

  //REGISTER BUTTON
  const startRegisterButton = function () {
    $registerButton = $('#register');
    $registerButton.on('click', function () {
      closeForms();
      $('.overlay').css('visibility', 'visible');
      $('.register-wrapper').slideDown('slow');
    })
  }
  startRegisterButton();

  //ADD RESOURCE BUTTON
  const startAddResourceButton = function () {
    $resourceButton = $('#add-resource');
    $resourceButton.on('click', function () {
      closeForms();
      $('.overlay').css('visibility', 'visible');
      $('.add-resource-wrapper').slideDown('slow');
    })
  }
  startAddResourceButton();

  //CLOSE BUTTON
  $closeButton = $('.close');
  $closeButton.on('click', function () {
    closeForms();
  })

  //Close All Popup Forms
  const closeForms = function () {
    $('.overlay').css('visibility', 'hidden');
    $('.login-wrapper').css('display','none');
    $('.overlay').css('visibility', 'hidden');
    $('.register-wrapper').css('display','none');
    $('.overlay').css('visibility', 'hidden');
    $('.add-resource-wrapper').css('display','none');
  }
    //LOGOUT BUTTON
    const startLogoutButton = function () {
      $('#logout-button').on('click', function () {
        console.log('test');
        $.post('http://localhost:8080/api/logout')
        .then(function() {
          $navbar = $('.nav-options');
          $navbar.children().remove();
          $navbar.append(`
            <form>
              <button type="button" class="btn btn-dark" id ='register'>Register</button>
            </form>
            <form>
              <button type="button" class="btn btn-dark" id ='login'>Login</button>
            </form>
          `);
          startLoginButton();
          startRegisterButton();
        });
      })
    }
    startLogoutButton();

    //LOGIN BUTTON
    $('#login-button').on('click', function () {
      const email = $('#login-header').next().val();
      const password = $('#login-header').next().next().val();
      $.post('http://localhost:8080/api/login', {email: email, password: password})
      .then(function(user) {
        console.log(user);
        if (user != 'incorrect password' && user != 'user does not exist') {
          $navbar = $('.nav-options');
          $navbar.children().remove();
          console.log('-----------------------------');
          console.log(user);
          $navbar.append(`
            <!--LOGGED IN-->
            <form>
              <button type="button" class="btn btn-dark" id ='add-resource'>Add Resource</button>
            </form>
            <form method="GET" action="/api/resources/${user.user}">
              <button type="submit" class="btn btn-dark" id="my-resources">
                My Resources
              </button>
            </form>
            <form method="GET" action="/api/users/${user.user}">
              <button type="submit" class="btn btn-dark" id="profile">Profile</button>
            </form>
            <form>
              <button type="button" class="btn btn-dark" id="logout-button">Logout</button>
            </form>
          `);
          closeForms();
          startLogoutButton();
          startAddResourceButton();
        } else {
          alert('error');
        }
      });
    })

    //ADD RESOURCE BUTTON
    $('#add-resource-button').on('click', function () {
      const description = $(this).parent().prev().val();
      const title = $(this).parent().prev().prev().val();
      const url = $(this).parent().prev().prev().prev().val();
      console.log('test');

      $.post('http://localhost:8080/api/resources', {url: url, title: title, description: description})
      .then(function(user) {
        console.log('created a resource');
        closeForms();
      });

      const pathname = window.location.pathname;
      $(this).append(`
        <form id="reset" style="visibility:hidden" action="http://localhost:8080${pathname}" method="GET"></form>
      `)

      $('#reset').submit();
    })
});
