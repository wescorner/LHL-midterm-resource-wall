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
    if ($dropdown.is(':visible')) {
      $dropdown.slideUp('fast');
    } else {
      $dropdown.slideDown('fast');
    }
  })
});
