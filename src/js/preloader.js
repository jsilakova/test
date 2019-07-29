$(window).on('load', function () {
  $preloader = $('.preloader-area'),
  
  setTimeout(function () {
    $preloader.delay(350).fadeOut('slow');
  }, 2000);
});