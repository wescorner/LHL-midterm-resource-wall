$(document).ready(function() {
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

      $(`<span style="margin-left:0.1rem; margin-right: 0.1rem;" class="badge bg-secondary">${tag}</span>`)
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
