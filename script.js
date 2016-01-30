$(window).load(function() {
  /** Sliding states:
  /* 0 - sliding not started
  /* 1 - sliding started
  /* 2 - slide released
  */
  var sliding = 0;
  var startClientX = 0;
  var startPixelOffset = 0;
  var pixelOffset = 0;
  var currentSlide = 0;
  var slideCount = 0;
  var slideWidth = 0;
  // Swipe should be disabled while transition animation is playing.
  var allowSwipe = true;
  var transitionDuration = 500;
  var autoPlayTimeout = 2000;
  var animationDelayID = undefined;
  var autoAnimation = true;
  
  $('#slides').on('mousedown touchstart', slideStart);
  $('html').on('mouseup touchend', slideEnd);
  $('html').on('mousemove touchmove', slide);
  
  /** Set initial values.
  * Make sense to start it when pictures are loaded.
  */
  function init() {
    slideWidth = $('.slide').width();
    $('#slides .slide:last-child').clone().prependTo('#slides');
    $('#slides .slide:nth-child(2)').clone().appendTo('#slides');
    
    slideCount = $('.slide').length;
    currentSlide = 0;
    transitionDuration = 500;
    
    startAutoPlay();
  }
  
  /**
  / Triggers when slide event started
  */
  function slideStart(event) {
    if(!allowSwipe) {
      return;
    }
    
    //autoAnimation = false;
    disableAutoPlay();
    // If it is mobile device redefine event to first touch point
    if (event.originalEvent.touches)
      event = event.originalEvent.touches[0];
    
    // Check if slide started on slider 
    if (sliding == 0){
      sliding = 1; // Status 1 = slide started.
      startClientX = event.clientX;
    }
  }
  
  /** Occurs when image is being slid.
  */
  function slide(event) {
    event.preventDefault();
    if (event.originalEvent.touches)
      event = event.originalEvent.touches[0];
    
    // Distance of slide from the first touch
    var deltaSlide = event.clientX - startClientX;
    
    // If sliding started first time and there was a distance.
    if (sliding == 1 && deltaSlide != 0) {
      sliding = 2; // Set status to 'actually moving'
      startPixelOffset = currentSlide * -slideWidth; // Store current offset of slide
    }
    //ToDo: first slide switches weird
    
    //  When user move image
    if (sliding == 2) {
      // Means that user slide 1 pixel for every 1 pixel of mouse movement.
      var touchPixelRatio = 1;
      // Check for user doesn't slide out of boundaries
      if ((currentSlide == 0 && event.clientX > startClientX) ||
         (currentSlide == slideCount - 1 && event.clientX < startClientX)){
        // Set ratio to 3 means image will be moving by 3 pixels each time user moves it's pointer by 1 pixel. (Rubber-band effect)
        touchPixelRatio = 3;
      }
      
      // How far to translate slide while dragging.
      pixelOffset = startPixelOffset + deltaSlide / touchPixelRatio;
      // Apply moving and remove animation class
      $('#slides').css('transform', 'translateX(' + pixelOffset + 'px').removeClass('animate');
      
    }
  }
  
  /** When user release pointer finish slide moving.
  */
  function slideEnd(event) {
    if (sliding == 2){
      // Reset sliding state.
      sliding = 0;
            
      // Calculate which slide need to be in view.
      currentSlide = pixelOffset < startPixelOffset ? currentSlide + 1 : currentSlide -1;
            
      // If last slide jump to first slide.
      if (currentSlide == slideCount) {
        jumpToStart();
        return;
      }
      
      if (currentSlide < 0){
        jumpToEnd();
        return;
      }
      
      // Make sure that unexisting slides weren't selected.
      currentSlide = Math.min(Math.max(currentSlide, 0), slideCount - 1);
      
      // Since in this example slide is full viewport width offset can be calculated according to it.
      pixelOffset = currentSlide * -slideWidth;
      
      disableSwipe();
      
      $('#slides').addClass('animate');
      $('#slides').css('transform', 'translateX(' + pixelOffset + 'px)');
      
      // If this is the last slide, then wait animation is over
      // and jump to first.
      if (currentSlide == slideCount - 1){
        window.setTimeout(jumpToStart, transitionDuration);
      } else if (currentSlide == 0) {
        window.setTimeout(jumpToEnd, transitionDuration);        
      }
      else {
        autoAnimation = true;
        startAutoPlay();
      }
      

    }
  } 
  
  function disableSwipe() {
    allowSwipe = false;
    window.setTimeout(enableSwipe, transitionDuration)
  }
  
  function enableSwipe() {
    allowSwipe = true;
  }
  
  function disableAutoPlay() {
    autoAnimation = false;
    window.clearTimeout(animationDelayID);
  }
  
  // ToDo: Start animation with slight delay for autoplay, wait to finish translate;
  function startAutoPlay() {
    if(autoAnimation){
      animationDelayID = window.setTimeout(autoPlay, autoPlayTimeout);
    }
  }
  
  function autoPlay() {
    currentSlide += 1;
    switchLeft();

    // If switched to last slide, wait until animation is over and jump to the second.
    if (currentSlide == slideCount - 1) {
      window.setTimeout(jumpToStart, transitionDuration);
    }

    startAutoPlay();
  }
  
  function jumpToStart() {
    $('#slides').removeClass('animate');
    $('#slides').addClass('disable-animation');
    $('#slides').css('transform','translateX(-' + slideWidth + 'px)');  
    currentSlide = 1;
    // Hack to give browser time to switch slide
    window.setTimeout(returnAnimationAfterJump, 50);
  }
  
  function jumpToEnd() {
    $('#slides').removeClass('animate');
    $('#slides').addClass('disable-animation');
    currentSlide = slideCount - 2;
    $('#slides').css('transform','translateX(-' + (slideWidth * currentSlide) + 'px)');
    window.setTimeout(returnAnimationAfterJump, 50);
  }
  
  function returnAnimationAfterJump() {
    $('#slides').removeClass('disable-animation');
    $('#slides').addClass('animate');
  }

  function switchLeft() {
    $('#slides').removeClass('disable-animation');
    $('#slides').addClass('animate');
    $('#slides').css('transform','translateX(-' + currentSlide * slideWidth + 'px)');
  }
  
  function switchRight() {
    $('#slides').addClass('animate');
    $('#slides').css('transform','translateX(' + currentSlide * slideWidth + 'px)');    
  }

  init();  
});