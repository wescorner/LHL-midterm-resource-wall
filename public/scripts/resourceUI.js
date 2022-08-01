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
});
