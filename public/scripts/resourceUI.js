const loadRatings = require('./app');
//RESOURCE PANEL SCRIPTS
$(document).ready(function() {
  //STAR RATINGS
  $('.starsIcons').on({
    //On MOUSE ENTER display solid star for current star and previous stars
    mouseenter: function () {
      const $regularStarContainer = $(this).parent();
      const $solidStarContainer = $regularStarContainer.siblings('.solid-stars');

      for(let i = 0; i <= 5; i++) {
        $solidStarContainer.children(`.${i}star`).css('visibility', 'hidden');
      }

      for (let i = 0; i <=5; i++) {
        if ($(this).attr('class').includes(`${i}star`)) {
          for (j = 1; j <= i; j++) {
            $solidStarContainer.children(`.${j}star`).css('visibility','visible');
          }
        }
      }
    },
    //On MOUSE CLICK AJAX DELETE previous rating and POST new rating
    click: function() {
      const $regularStarContainer = $(this).parent();
      const $solidStarContainer = $regularStarContainer.siblings('.solid-stars');
      let rating = 0;
      if ($(this).attr('class').includes('1star')) {
        rating = 1;
        $solidStarContainer.attr('value', 1);
      }
      if ($(this).attr('class').includes('2star')) {
        rating = 2;
        $solidStarContainer.attr('value', 2);
      }
      if ($(this).attr('class').includes('3star')) {
        rating = 3;
        $solidStarContainer.attr('value', 3);
      }
      if ($(this).attr('class').includes('4star')) {
        rating = 4;
        $solidStarContainer.attr('value', 4);
      }
      if ($(this).attr('class').includes('5star')) {
        rating = 5;
        $solidStarContainer.attr('value', 5);
      }

      resource_id = $regularStarContainer.parent().parent().siblings().attr('id');
      $.ajax(`http://localhost:8080/api/ratings/${resource_id}`, {type: 'DELETE', rating: rating})
      .then(function() {
      });


      $.post(`http://localhost:8080/api/ratings/${resource_id}`, {rating: rating})
      .then(function() {
      });

      loadRatings();
    },
    //On MOUSE LEAVE hide / display stars based on resource rating
    mouseleave: function () {
      const $solidStarContainer = $(this).parent().parent().children('.solid-stars');
      for (let i = 1; i <= 5; i++) {
        if ($solidStarContainer.attr('value') >= i) {
          $solidStarContainer.children(`.${i}star`).css('visibility', 'visible');
        } else {
          $solidStarContainer.children(`.${i}star`).css('visibility', 'hidden');
        }
      }
    }
  });

  //LIKES
  $('.likes').on({
    //On MOUSE ENTER display filled in heart if missing
    mouseenter: function () {
      const $like = $(this)
      if (!$like.children('.fa-solid').length) {
        $like.append(`<i class="fa-solid fa-heart"></i>`)
      }
    },
    //Toggle Like
    //On CLICK check state (liked or unliked) and AJAX DELETE OR POST accordingly
    click: function () {
      const $like = $(this)
      if ($like.attr('value') === 'true') {
        unlikeResource($like);
        $like.find(".fa-solid").remove();
        $like.attr('value', 'false');
        $like.on('mouseleave', function () {
          const $like = $(this)
          $like.children('.fa-solid').remove();
        })
      } else {
        likeResource($like)
        $like.attr('value', 'true');
        $like.off('mouseleave');
      }
    },
    //On MOUSE LEAVE display empty or full heart icon based on liked state
    mouseleave: function () {
      const $like = $(this)
      if ($like.children('.fa-solid').attr('value') !== 'liked') {
        $like.children('.fa-solid').remove();
        $like.children('.fa-regular').css('visibility','visible');
      } else {
        $like.children('.fa-regular').css('visibility','hidden');
      }
    }
  });
  //Perform AJAX POST to api/likes/id
  const likeResource = function ($resource) {
    $resource_id = $resource.parent().parent().siblings()

    $.post(`http://localhost:8080/api/likes/${$resource_id.attr('id')}`)
      .then(function() {
      });
  }
  //Perform AJAX DELETE to api/likes/id
  const unlikeResource = function ($resource) {
    $resource_id = $resource.parent().parent().siblings()

    $.ajax(`http://localhost:8080/api/likes/${$resource_id.attr('id')}`, {type: 'DELETE'})
      .then(function() {
        location.reload();
      });
  }

  //ADD TAG BUTTON (resource panel)
  let $currentResource;
  $('.add-tag').click(function () {
    $currentResource = $(this).parent().parent().parent().siblings();
    $('.overlay').css('visibility', 'visible');
    $('.add-tag-wrapper').slideDown('slow');
  })

  //ADD TAG BUTTON (form)
  $('#add-tag-button').on('click', function () {
    const tag = $(this).parent().prev().val();
    $.post(`http://localhost:8080/api/tags/${$currentResource.attr('id')}`, {tag: tag})
    .then(function(user) {
      $('.overlay').css('visibility', 'hidden');
      $('.add-tag-wrapper').css('display','none');

      $tagTarget = $currentResource.parent().find('.add-tag');

      $(`<span style="margin-left:0.1rem; background-color:rgb(80, 87, 129); margin-right: 0.2rem;" class="badge">${tag}</span>`)
      .insertBefore($tagTarget);
    });
  });



    //COMMENTS DROPDOWN
    //Expand / retract dropdown menu and load comments
  $('.comment-dropdown').click(function () {
    const $dropdown = $(this).parent().parent().siblings();
    if ($(this).children('.fa-angle-down').length) {
      loadComments($dropdown.attr('id'), $dropdown);
      $(this).children('.fa-angle-down').remove();
      $(this).append(`<i class="fa-solid fa-angle-up"></i>`);
    } else {
      loadComments($dropdown.attr('id'), $dropdown);
      $(this).children('.fa-angle-up').remove();
      $(this).append(`<i class="fa-solid fa-angle-down"></i>`);
    }
  })

  //AJAX GET request to api/comments/id
  //Append all comments to dropdown menu
  const loadComments = function (id, $menu) {
    const $dropdown = $menu;
    $.ajax(`http://localhost:8080/api/comments/${id}`)
      .then(function(commentsObj) {
        if ($dropdown.is(':visible')) {
          $dropdown.slideUp('fast', function () {
            $dropdown.children('div').remove();
          });
        } else {
          for (const i in commentsObj.comments) {
            $dropdown.children('form').before(`
            <div>
              <h3>${escape(commentsObj.user_names[i])}</h3>
              <p>${escape(commentsObj.comments[i])}</p>
            </div>
            `)
          }
          $dropdown.slideDown('fast');
        }

      });
  }

  //NEW COMMENT BUTTON
  //AJAX POST request to api/comments/id
  //AJAX GET request to api/comments/id
  const startNewCommentButton = function () {
    $('.new-comment-button').on('click',function () {
      $resource = $(this).parent().parent();
      const data = $(this).siblings().val();
      if (!data) {
        alert("Comments can't be empty!")
      } else {
        $.post(`http://localhost:8080/api/comments/${$resource.attr('id')}`, {comment: data})
      .then(function() {
        $.ajax(`http://localhost:8080/api/comments/${$resource.attr('id')}`)
          .then(function (commentsObj) {
            $resource.children().remove();
            for (const i in commentsObj.comments) {
              $resource.append(`
              <div>
                <h3>${escape(commentsObj.user_names[i])}</h3>
                <p>${escape(commentsObj.comments[i])}</p>
              </div>
              `)
            }
            $resource.append(`
              <form class="new-comment">
                <textarea name="comment" class="form-control" placeholder="comment" aria-label="With textarea"></textarea>
                <button type="button" class="btn new-comment-button">Comment</button>
              </form>
            `)
            startNewCommentButton();
          });
      });
      }
    });
  };
  startNewCommentButton();

  //Convert HTML to a string
  const escape = function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };
});
