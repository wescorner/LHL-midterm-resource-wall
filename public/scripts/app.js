// Client-side scripts
$(document).ready(function() {

  //START LOGIN BUTTON
  const startLoginButton = function () {
    $loginButton = $('#login');
    $loginButton.on('click', function () {
      closeForms();
      $('.overlay').css('visibility', 'visible');
      $('.login-wrapper').slideDown('slow');
    })
  }
  startLoginButton();

  //START REGISTER BUTTON
  const startRegisterButton = function () {
    $registerButton = $('#register');
    $registerButton.on('click', function () {
      closeForms();
      $('.overlay').css('visibility', 'visible');
      $('.register-wrapper').slideDown('slow');
    })
  }
  startRegisterButton();

  //START ADD RESOURCE BUTTON
  const startAddResourceButton = function () {
    $resourceButton = $('#add-resource');
    $resourceButton.on('click', function () {
      closeForms();
      $('.overlay').css('visibility', 'visible');
      $('.add-resource-wrapper').slideDown('slow');
    })
  }
  startAddResourceButton();

  //CLOSE FORM BUTTON
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
        window.location.href = "/api/resources";
        startLoginButton();
        startRegisterButton();
      });
    })
  }
    startLogoutButton();

    //LOGIN BUTTON (POPUP FORM)
    //AJAX POST to /api/login using email and password INPUT FORM
    $('#login-button').on('click', function () {
      const email = $('#login-header').next().val();
      const password = $('#login-header').next().next().val();
      $.post('http://localhost:8080/api/login', {email: email, password: password})
      .then(function(user) {
        if (user !== 'incorrect password' && user !== 'user does not exist') {
          $navbar = $('.nav-options');
          $navbar.children().remove();
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
          alert('Incorrect Login Information!');
        }
      });
    })

    //ADD RESOURCE BUTTON (POPUP FORM)
    //AJAX POST to create a resource using data from INPUT FORM
    $('#add-resource-button').on('click', function () {
      const description = $(this).parent().prev().val();
      const title = $(this).parent().prev().prev().val();
      const url = $(this).parent().prev().prev().prev().val();

      if (!description || !title || !url) {
        alert('Empty Creation Data!');
      } else {

        $.post('http://localhost:8080/api/resources', {url: url, title: title, description: description})
        .then(function(user) {
          closeForms();
        });

        const pathname = window.location.pathname;
        $(this).append(`
          <form id="reset" style="visibility:hidden" action="http://localhost:8080${pathname}" method="GET"></form>
        `)

        $('#reset').submit();
      }
    })

  //REGISTER BUTTON (POPUP FORM)
  $('#register-button').on('click',function () {
    const name = $(this).parent().siblings('#register-name').val();
    const email = $(this).parent().siblings('#register-email').val();
    const password = $(this).parent().siblings('#register-password').val();

    if (!name || !email || !password) {
      alert('Empty Registration Data!');
    } else {
      $.post('http://localhost:8080/api/users', {name: name, email:email, password:password})
      .then(function () {
        window.location.href = "/api/resources";
      });
    }
  });

    //LOAD RATINGS
    const loadRatings = function () {
      $('.rating-label').each(function () {
        resource_id = $(this).parent().parent().parent().siblings().attr('id');
        $.ajax(`http://localhost:8080/api/ratings/average/${resource_id}`)
          .then(function(response) {
            if(response) {
              $(this).text(`${response}/5`)
            } else {
              $(this).text('unrated');
            }
          });
      })
    }
    loadRatings();

    module.exports(loadRatings);
});
