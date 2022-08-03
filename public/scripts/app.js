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

  //LOAD RESOURCES
  const loadResources = function () {
    $.ajax('http://localhost:8080/api/resources:id')
      .then(function(resourcesObj) {
        renderResources(resourcesObj);
      });
  };

  const renderResources = function (resourcesObj) {
    for (const resourceObj of resourcesObj) {
      const $resource = createResourceElement(resourceObj);
      $('main').append($resource);
    }
  };

  const createResourceElement = function(resourceObj) {
    const $resource = $(`
    <!--RESOURCE FRAME-->
    <section id="resource-wrapper">
      <div class="resource bg-light">
        <header>
          <a href="'${escape(resourceObj.urls)}">${escape(resourceObj.url)}</a>
          <div class="likes">
            <i class="fa-regular fa-heart"></i>
          </div>
        </header>

        <section class="title-description">
          <h2>${escape(resourceObj.titles)}</h2>
          <p>${escape(resourceObj.descriptions)}</p>
        </section>

        <section class="tags">
          <label>
            <span class="badge bg-secondary">Search Engine</span>
            <span class="badge bg-secondary">Something</span>
            <span class="badge bg-secondary">Fancy</span>
          </label>
        </section>

        <footer>
          <div class='comment-dropdown'>
            <label>Comments <span id="number-of-comments" class="badge bg-secondary">55</span></label>
            <i class="fa-solid fa-angle-down"></i>
          </div>
          <div class="stars">
            <i class="fa-regular fa-star 1star"></i>
            <i class="fa-regular fa-star 2star"></i>
            <i class="fa-regular fa-star 3star"></i>
            <i class="fa-regular fa-star 4star"></i>
            <i class="fa-regular fa-star 5star"></i>
          </div>
        </footer>
      </div>
      <section class="comments">
        <div>
          <h3>Pwsjas</h3>
          <p>This is a comment telling you about how amazing google is,
            and how much I use it every day.
          </p>
        </div>
        <div>
          <h3>Pwsjas</h3>
          <p>This is a comment telling you about how awful google is,
            and how much I hate it.
          </p>
        </div>
        <div>
          <textarea class="form-control" placeholder="comment" aria-label="With textarea"></textarea>
          <button type="submit" class="btn btn-success">Comment</button>
        </div>
      </section>
    </section>
    `);
    return $resource;
  };

    //Convert HTML to a string
    const escape = function(str) {
      let div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    };


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
          $navbar.append(`
            <!--LOGGED IN-->
            <form>
              <button type="button" class="btn btn-dark" id ='add-resource'>Add Resource</button>
            </form>
            <form method="GET" action="/api/resources/<%=user%>">
              <button type="submit" class="btn btn-dark" id ='my-resources'>My Resources</button>
            </form>
            <form method="GET" action="/api/profile/<%=user%>">
              <button type="submit" class="btn btn-dark" id ='profile'>Profile</button>
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
    })
});
