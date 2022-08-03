$(document).ready(function() {

  //RATINGS

  $('.starsIcons').on({
    mouseenter: function () {
      const $regularStarContainer = $(this).parent();
      const $solidStarContainer = $regularStarContainer.siblings('.solid-stars');
      if ($(this).attr('class').includes('1star')) {
        $solidStarContainer.children('.1star').css('visibility','visible');
      }
      if ($(this).attr('class').includes('2star')) {
        $solidStarContainer.children('.1star').css('visibility','visible');
        $solidStarContainer.children('.2star').css('visibility','visible');
      }
      if ($(this).attr('class').includes('3star')) {
        $solidStarContainer.children('.1star').css('visibility','visible');
        $solidStarContainer.children('.2star').css('visibility','visible');
        $solidStarContainer.children('.3star').css('visibility','visible');
      }
      if ($(this).attr('class').includes('4star')) {
        $solidStarContainer.children('.1star').css('visibility','visible');
        $solidStarContainer.children('.2star').css('visibility','visible');
        $solidStarContainer.children('.3star').css('visibility','visible');
        $solidStarContainer.children('.4star').css('visibility','visible');
      }
      if ($(this).attr('class').includes('5star')) {
        $solidStarContainer.children('.1star').css('visibility','visible');
        $solidStarContainer.children('.2star').css('visibility','visible');
        $solidStarContainer.children('.3star').css('visibility','visible');
        $solidStarContainer.children('.4star').css('visibility','visible');
        $solidStarContainer.children('.5star').css('visibility','visible');
      }
    },
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
        console.log('deleted rating');
      });


      $.post(`http://localhost:8080/api/ratings/${resource_id}`, {rating: rating})
      .then(function() {
        console.log('rated');
      });
    }
  });

$('.stars').on({
  mouseleave: function () {
    $solidStarContainer = $(this).parent().find('.solid-stars');
    if ($solidStarContainer.attr('value') === '0') {
      $solidStarContainer.children('.1star').css('visibility', 'hidden');
      $solidStarContainer.children('.2star').css('visibility', 'hidden');
      $solidStarContainer.children('.3star').css('visibility', 'hidden');
      $solidStarContainer.children('.4star').css('visibility', 'hidden');
      $solidStarContainer.children('.5star').css('visibility', 'hidden');
    }
    if ($solidStarContainer.attr('value') === '1') {
      $solidStarContainer.children('.2star').css('visibility', 'hidden');
      $solidStarContainer.children('.3star').css('visibility', 'hidden');
      $solidStarContainer.children('.4star').css('visibility', 'hidden');
      $solidStarContainer.children('.5star').css('visibility', 'hidden');
    }
    if ($solidStarContainer.attr('value') === '2') {
      $solidStarContainer.children('.3star').css('visibility', 'hidden');
      $solidStarContainer.children('.4star').css('visibility', 'hidden');
      $solidStarContainer.children('.5star').css('visibility', 'hidden');
    }
    if ($solidStarContainer.attr('value') === '3') {
      $solidStarContainer.children('.4star').css('visibility', 'hidden');
      $solidStarContainer.children('.5star').css('visibility', 'hidden');
    }
    if ($solidStarContainer.attr('value') === '4') {
      $solidStarContainer.children('.5star').css('visibility', 'hidden');
    }
  }
});




  // //RATINGS
  // const startStarIcons = function () {
  //   //ON CLICK
  //   $('.starsIcons').on('click', function () {
  //     const $starContainer = $(this).parent();
  //     let rating = 0;
  //     if ($(this).attr('class').includes('1star')) {
  //       rating = 1;
  //       replaceStars($starContainer, 1);
  //     }
  //     if ($(this).attr('class').includes('2star')) {
  //       rating = 2;
  //       replaceStars($starContainer, 2);
  //     }
  //     if ($(this).attr('class').includes('3star')) {
  //       rating = 3;
  //       replaceStars($starContainer, 3);
  //     }
  //     if ($(this).attr('class').includes('4star')) {
  //       rating = 4;
  //       replaceStars($starContainer, 4);
  //     }
  //     if ($(this).attr('class').includes('5star')) {
  //       rating = 5;
  //       replaceStars($starContainer, 5);
  //     }


  //     resource_id = $starContainer.parent().parent().siblings().attr('id');
  //     $.ajax(`http://localhost:8080/api/ratings/${resource_id}`, {type: 'DELETE', rating: rating})
  //     .then(function() {
  //       console.log('deleted rating');
  //     });


  //     $.post(`http://localhost:8080/api/ratings/${resource_id}`, {rating: rating})
  //     .then(function() {
  //       console.log('rated');
  //     });
  //   })
  // }
  // startStarIcons();

  // const replaceStars = function ($starContainer, rating) {
  //   const starArray = [];
  //   for (let i = 1; i <= 5; i++){
  //     if (i <= rating) {
  //       starArray.push('fa-solid');
  //     } else {
  //       starArray.push('fa-regular');
  //     }
  //   }
  //   $starContainer.children().remove();
  //   $starContainer.append(`
  //     <i class="${starArray[0]} fa-star 1star starsIcons"></i>
  //     <i class="${starArray[1]} fa-star 2star starsIcons"></i>
  //     <i class="${starArray[2]} fa-star 3star starsIcons"></i>
  //     <i class="${starArray[3]} fa-star 4star starsIcons"></i>
  //     <i class="${starArray[4]} fa-star 5star starsIcons"></i>
  //   `);
  //   startStarIcons();
  // }


  //LIKES
  $('.likes').on({
    mouseenter: function () {
      const $like = $(this)
      if (!$like.children('.fa-solid').length) {
        $like.append(`<i class="fa-solid fa-heart"></i>`)
      }
    },
    //Toggle Like
    click: function () {
      const $like = $(this)
      if ($like.attr('value') === 'true') {
        unlikeResource($like);
        console.log('clicked')
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
      console.log($like.attr('value'));
    },
    mouseleave: function () {
      const $like = $(this)
      $like.children('.fa-solid').remove();
    }
  });
  const likeResource = function ($resource) {
    $resource_id = $resource.parent().parent().siblings()

    $.post(`http://localhost:8080/api/likes/${$resource_id.attr('id')}`)
      .then(function() {
        console.log('liked');
      });
  }
  const unlikeResource = function ($resource) {
    $resource_id = $resource.parent().parent().siblings()

    $.ajax(`http://localhost:8080/api/likes/${$resource_id.attr('id')}`, {type: 'DELETE'})
      .then(function() {
        console.log('liked');
      });
  }

  //ADD TAG BUTTON
  let $currentResource;
  $('.add-tag').click(function () {
    $currentResource = $(this).parent().parent().parent().siblings();
    $('.overlay').css('visibility', 'visible');
    $('.add-tag-wrapper').slideDown('slow');
  })

  //ADD TAG FORM SUBMISSION
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
            $dropdown.prepend(`
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

    //NEW COMMENT
  $('.new-comment-button').on('click',function () {
    $resource = $(this).parent().parent();
    const data = $(this).siblings().val();

    $.post(`http://localhost:8080/api/comments/${$resource.attr('id')}`, {comment: data})
    .then(function(comment) {
      console.log(comment);
      $resource.prepend(`
        <div>
          <h3>${escape(comment.user_id)}</h3>
          <p>${escape(comment.comment)}</p>
        </div>
      `);
      $(this).parent().parent().slideDown('fast');
    });
  });
});
