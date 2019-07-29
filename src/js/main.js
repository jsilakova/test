jQuery(document).ready(function() {
	//according bootstrap theme
  var widthMD = 768;
  var widthLG = 992;

  AOS.init({
    disable: window.innerWidth < widthLG,
    startEvent: 'load'
  });

  //main navigation on mobile
  $(".btn-navigation-open").on('click', function(e){
    $(this).toggleClass('active');
    $("body").toggleClass('menu-opened');
    $(".main-navigation").toggleClass('open');
    e.stopPropagation();
  });

  $(window).on('resize', function(e) {
    if ($(window).width() > widthMD) {
      $(".btn-navigation-close").removeClass('active');
      $("body").removeClass('menu-opened');
      $(".main-navigation").removeClass('open');
    }
  });

  //sticky header
  function yScroll(){
      var sticky = $('.header');

      yPos = window.pageYOffset;
      if(yPos > 300){
          sticky.addClass("header-fixed");
      } else {
          sticky.removeClass("header-fixed");
      }
  }
  window.addEventListener("scroll", yScroll);

  $("*[data-href]").click(function(){

    if ($("body").hasClass("menu-opened")) {
        $(".btn-navigation-open").removeClass('active');
        $("body").removeClass('menu-opened');
        $(".main-navigation").removeClass('open');
    }

    $("body,html").animate({
      scrollTop:$('#' + $(this).data('href')).offset().top - $(".header").height() + 'px'
    },1000);
    return false;
  });

  //technologies section
  var tabChange = function () {
    var tabs = $('.js-nav-tabs-autoplay a');
    var active = tabs.filter('.active');
    var next = active.next('a');

    if (active.is(":last-child")) {
      var next = $('.js-nav-tabs-autoplay > a:first-child');
    }

    next.tab('show');
  };

  var intervalTabs = setInterval(tabChange, 8000);

  $('.js-nav-tabs-autoplay, .js-tab-content-autoplay').hover(function() {
    clearInterval(intervalTabs);
  }, function() {
    intervalTabs = setInterval(tabChange, 8000);
  });

  $('.tech-content .collapse').on('show.bs.collapse', function () {
    $(this).parent('.tech-content-item').addClass('open');
  });

  $('.tech-content .collapse').on('hide.bs.collapse', function () {
    $(this).parent('.tech-content-item').removeClass('open');
  });

  $(".btn-watch-video").on('click', function(e){
    var videoModalSrc = $(this).data("video"),
        videoModalContainer = $(".js-video-tech iframe");
    videoModalContainer.attr('src', videoModalSrc);
    $('#modalTechVideo').modal('show');
    return false;
  });

  $('#modalTechVideo').on('hidden.bs.modal', function () {
    $('.js-video-tech iframe').attr('src','');
  });

  $('.js-team-slider').slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    variableWidth: true,
    arrows:false,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      }
    ]
  });

  //- contact Us
  $(".js-email-submit").click(function(e) {
    var userEmail = $(this).parents('.contact-form').find(".js-contact-email");
    var userEmailHolder = userEmail.parent(".form-control-holder");
    var userName = $(this).parents('.reguest-sdk-form').find(".js-contact-name");
    var userNameHolder = userName.parent(".form-control-holder");
    var company = $(this).parents('.reguest-sdk-form').find(".js-company-name");
    var message = $(this).parents('.reguest-sdk-form').find(".js-contact-message");

    if (userEmail.val() == '' || (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail.val())))) {
      userEmailHolder.addClass('error');
    }

    if ($(this).parents('.contact-form').hasClass('reguest-sdk-form')) {

      if (userName.val() == '') {
        userNameHolder.addClass('error');
      }
    } 

    if(userName.hasClass('error') || userEmail.hasClass('error')) {
      return false;
    }

    if (userEmail.val() == '' || (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail.val())))) {
      userEmailHolder.addClass('error');
      return false;
    } else {
      e.preventDefault();
      $.ajax({
          url: 'https://aedra4vy0c.execute-api.us-east-1.amazonaws.com/prod/banubaMailSend',
          type : "POST",
          dataType : 'json',
          data : JSON.stringify({
            'email': userEmail.val(), 
            'name': userName.val(), 
            'company_name': company.val(),
            'message': message.val()
          }),
         beforeSend: function(x) {
              if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
               }
          },
          success : function(result) {
            $(".js-contact-name, .js-contact-email, .js-company-name, .js-contact-message").val('');

            $('#modalSuccessSend').modal('show');
            $('.contact-form-holder').hide(100);
            $('.contact-success').show(100);
         },
          error: function(xhr, resp, text) {
            $('#modalError').modal('show');
          }
      });
    }

  });

  $(".js-contact-email").keyup(function(){
    var userEmail = $(this).parents('.contact-form').find(".js-contact-email");
    var userEmailHolder = userEmail.parent(".form-control-holder"); 

    if(userEmailHolder.hasClass('error')) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($(this).val())) {
        userEmailHolder.removeClass('error');
      }
    } 
  });

  $(".js-contact-name").keyup(function(){
    var userName = $(this).parents('.contact-form').find(".js-contact-name");
    var userNameHolder = userName.parent(".form-control-holder");

    if(userNameHolder.hasClass('error')) {
      if (userName.val() !== '') {
        userNameHolder.removeClass('error');
      }
    } 
  });

});

//main background
var canvas = document.getElementById('nokey'),
   can_w = parseInt(canvas.getAttribute('width')),
   can_h = parseInt(canvas.getAttribute('height')),
   ctx = canvas.getContext('2d');

var ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      alpha: 1,
      phase: 0
   },
   ball_color = {
       r: 244,
       g: 104,
       b: 51
   },
   R = 3,
   balls = [],
   alpha_f = 0.03,
   alpha_phase = 0,
    
// Line
   link_line_width = 0.8,
   dis_limit = 260,
   add_mouse_point = true,
   mouse_in = false,
   mouse_ball = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 0,
      type: 'mouse'
   };

// Random speed
function getRandomSpeed(pos){
    var  min = -1,
       max = 1;
    switch(pos){
        case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
            break;
        case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
            break;
        case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
            break;
        case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
            break;
        default:
            return;
            break;
    }
}
function randomArrayItem(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumFrom(min, max){
    return Math.random()*(max - min) + min;
}

// Random Ball
function getRandomBall(){
    var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
    switch(pos){
        case 'top':
            return {
                x: randomSidePos(can_w),
                y: -R,
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'right':
            return {
                x: can_w + R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('right')[0],
                vy: getRandomSpeed('right')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'bottom':
            return {
                x: randomSidePos(can_w),
                y: can_h + R,
                vx: getRandomSpeed('bottom')[0],
                vy: getRandomSpeed('bottom')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
        case 'left':
            return {
                x: -R,
                y: randomSidePos(can_h),
                vx: getRandomSpeed('left')[0],
                vy: getRandomSpeed('left')[1],
                r: R,
                alpha: 1,
                phase: randomNumFrom(0, 10)
            }
            break;
    }
}
function randomSidePos(length){
    return Math.ceil(Math.random() * length);
}

// Draw Ball
function renderBalls(){
    Array.prototype.forEach.call(balls, function(b){
       if(!b.hasOwnProperty('type')){
           ctx.fillStyle = 'rgba('+ball_color.r+','+ball_color.g+','+ball_color.b+','+b.alpha+')';
           ctx.beginPath();
           ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
           ctx.closePath();
           ctx.fill();
       }
    });
}

// Update balls
function updateBalls(){
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        b.x += b.vx;
        b.y += b.vy;
        
        if(b.x > -(50) && b.x < (can_w+50) && b.y > -(50) && b.y < (can_h+50)){
           new_balls.push(b);
        }
        
        // alpha change
        b.phase += alpha_f;
        b.alpha = Math.abs(Math.cos(b.phase));
        // console.log(b.alpha);
    });
    
    balls = new_balls.slice(0);
}

// loop alpha
function loopAlphaInf(){
    
}

// Draw lines
function renderLines(){
    var fraction, alpha;
    for (var i = 0; i < balls.length; i++) {
        for (var j = i + 1; j < balls.length; j++) {
           
           fraction = getDisOf(balls[i], balls[j]) / dis_limit;
            
           if(fraction < 1){
               alpha = (1 - fraction).toString();

               ctx.strokeStyle = 'rgba(150,150,150,'+alpha+')';
               ctx.lineWidth = link_line_width;
               
               ctx.beginPath();
               ctx.moveTo(balls[i].x, balls[i].y);
               ctx.lineTo(balls[j].x, balls[j].y);
               ctx.stroke();
               ctx.closePath();
           }
        }
    }
}

// calculate distance between two points
function getDisOf(b1, b2){
    var  delta_x = Math.abs(b1.x - b2.x),
       delta_y = Math.abs(b1.y - b2.y);
    
    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}

// add balls if there a little balls
function addBallIfy(){
    if(balls.length < 40){
        balls.push(getRandomBall());
    }
}

// Render
function render(){
    ctx.clearRect(0, 0, can_w, can_h);
    
    renderBalls();
    
    renderLines();
    
    updateBalls();
    
    addBallIfy();
    
    window.requestAnimationFrame(render);
}

// Init Balls
function initBalls(num){
    for(var i = 1; i <= num; i++){
        balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
        });
    }
}

// Init Canvas
function initCanvas(){
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    
    can_w = parseInt(canvas.getAttribute('width'));
    can_h = parseInt(canvas.getAttribute('height'));
}
window.addEventListener('resize', function(e){
    console.log('Window Resize...');
    initCanvas();
});

function goMovie(){
    initCanvas();
    initBalls(30);
    window.requestAnimationFrame(render);
}


if(window.innerWidth>992) {
  goMovie();
} 


// Mouse effect
canvas.addEventListener('mouseenter', function(){
    mouse_in = true;
    balls.push(mouse_ball);
});
canvas.addEventListener('mouseleave', function(){
    mouse_in = false;
    var new_balls = [];
    Array.prototype.forEach.call(balls, function(b){
        if(!b.hasOwnProperty('type')){
            new_balls.push(b);
        }
    });
    balls = new_balls.slice(0);
});
canvas.addEventListener('mousemove', function(e){
    var e = e || window.event;
    mouse_ball.x = e.pageX;
    mouse_ball.y = e.pageY;
});

