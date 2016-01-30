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
  var autoPlayTimeout = 3000;
  var animationDelayID = undefined;
  var autoAnimation = true;
  
  /** Set initial values.
  * Make sense to start it when pictures are loaded.
  */
  function init() {
    slideWidth = $('.slide').width();
    $('#slides .slide:last-child').clone().prependTo('#slides');
    $('#slides .slide:nth-child(2)').clone().appendTo('#slides');
    
    slideCount = $('.slide').length;
    transitionDuration = 500;
    setTransitionDuration(transitionDuration);
    setTimingFunction('ease-out');
    setTransitionProperty('all');
    
    $('#slides').on('mousedown touchstart', slideStart);
    $('html').on('mouseup touchend', slideEnd);
    $('html').on('mousemove touchmove', slide);
    
    // Move slides to make it look like first slide selected
    jumpToSlide(1);
    
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
      enableTransition(false);
      // Apply moving and remove animation class
      translateX(pixelOffset);
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

      // Make sure that unexisting slides weren't selected.
      currentSlide = Math.min(Math.max(currentSlide, 0), slideCount - 1);
      
      // Since in this example slide is full viewport width offset can be calculated according to it.
      pixelOffset = currentSlide * -slideWidth;
      
      disableSwipe();
      enableTransition(true);
      translateX(pixelOffset);
      
      // If this is the last slide, then wait animation is over
      // and jump to first.
      if (currentSlide == slideCount - 1){
        window.setTimeout(jumpToStart, transitionDuration);
      } else if (currentSlide == 0) {
        window.setTimeout(jumpToEnd, transitionDuration);        
      }
      
      autoAnimation = true;
      startAutoPlay();
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
    switchForward();

    // If switched to last slide, wait until animation is over and jump to the second.
    if (currentSlide == slideCount - 1) {
      window.setTimeout(jumpToStart, transitionDuration);
    }

    startAutoPlay();
  }
  
  function jumpToStart() {
    enableTransition(false);
    translateX(-slideWidth);
    currentSlide = 1;
    // Hack to give browser time to switch slide
    window.setTimeout(returnAnimationAfterJump, 50);
  }
  
  function jumpToSlide(slideNumber){
    enableTransition(false);
    currentSlide = slideNumber;
    translateX(-slideWidth * currentSlide);
    window.setTimeout(returnAnimationAfterJump, 50);
  }
  
  function jumpToEnd() {
    enableTransition(false);
    currentSlide = slideCount - 2;
    translateX(-slideWidth * currentSlide);
    window.setTimeout(returnAnimationAfterJump, 50);
  }
  
  function returnAnimationAfterJump() {
    enableTransition(true);
  }

  function switchForward() {
    enableTransition(true);
    translateX(-currentSlide * slideWidth);
  }
  
  function switchBackward() {
    enableTransition(true);
    translateX(currentSlide * slideWidth); 
  }
  
  /** Enables or disables transition
  * @param {bool} true to enable traintion.
  */
  function enableTransition(enable) {
    if (enable) {
      setTransitionProperty('all');
    } else {
      setTransitionProperty('none');
    }
  }
  
  // Translates slides on certain amount.
  function translateX(width){
    $('#slides').css('-webkit-transform','translateX(' + width + 'px)')
      .css('-ms-transform','translateX(' + width + 'px)')
      .css('transform','translateX(' + width + 'px)');
  }
  
  // Sets duration of transition between slides
  function setTransitionDuration(duration){
    $('#slides').css('-webkit-transition-duration', duration + 'ms')
      .css('transition-duration', duration + 'ms');
  }
  
  function setTimingFunction(functionDescription){
    $('#slides').css('-webkit-transition-timing-function', functionDescription)
      .css('transition-timing-function', functionDescription);
  }
  
  // Used to disable or enable animation
  function setTransitionProperty(property){
    $('#slides').css('-webkit-transition-property', property)
      .css('transition-property', property);
  }
  
  init();  
});