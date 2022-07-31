$(document).ready(function() {
  const $like = $('.likes')
  $like.on({
    mouseenter: function () {
      if (!$like.children('.fa-solid').length) {
        $like.append(`<i class="fa-solid fa-heart"></i>`)
      }
    },
    //Toggle Like
    click: function () {
      $like.off('mouseleave');
    },
    mouseleave: function () {
      $like.children('.fa-solid').remove();
    }
  });
});
