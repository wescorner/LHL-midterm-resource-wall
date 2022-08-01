
// Client facing scripts here
$(document).ready(function() {

  //LOGIN BUTTON
  $loginButton = $('#login');
  $loginButton.on('click', function () {
    closeForms();
    $('.overlay').css('visibility', 'visible');
    $('.login-wrapper').slideDown('slow');
  })

  //REGISTER BUTTON
  $loginButton = $('#register');
  $loginButton.on('click', function () {
    closeForms();
    $('.overlay').css('visibility', 'visible');
    $('.register-wrapper').slideDown('slow');
  })

  //ADD RESOURCE BUTTON
  $loginButton = $('#add-resource');
  $loginButton.on('click', function () {
    closeForms();
    $('.overlay').css('visibility', 'visible');
    $('.add-resource-wrapper').slideDown('slow');
  })


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


  //COMMENTS DROPDOWN
  $('.comment-dropdown').click(function () {
    $dropdown = $(this).parent().parent().siblings()
    loadComments($dropdown.attr('id'), $dropdown);
  })


  const loadComments = function (id, $menu) {
    $.ajax(`http://localhost:8080/api/comments/${id}`)
      .then(function(commentsObj) {

        for (const i in commentsObj.comments) {
          $dropdown.prepend(`
          <div>
            <h3>${escape(commentsObj.comments[i])}</h3>
            <p>${escape(commentsObj.user_ids[i])}</p>
          </div>
          `)
        }
        if ($dropdown.is(':visible')) {
          $dropdown.slideUp('fast');
        } else {
          $dropdown.slideDown('fast');
        }

      });
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
});
