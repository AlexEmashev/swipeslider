$(window).load(function() {
  var sliding = 0;
  var startClientX = 0;
  var startPixelOffset = 0;
  var pixelOffset = 0;
  var currentSlide = 0;
  var slideCount = 0;
  var slideWidth = 0;
  var transitionDuration = 0;
  
  $('html').on('mousedown touchstart', slideStart);
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
    currentSlide = 1;
    transitionDuration = .5;
    
    startAutoPlay();
  }
  
  /**
  / Triggers when slide event started
  */
  function slideStart(event) {
    autoAnimation = false;
    // If it is mobile device redefine event to first touch point
    if (event.originalEvent.touches)
      event = event.originalEvent.touches[0];
    // If sliding not started yet store current touch position to calculate distance in future.
    if (sliding == 0) {
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
    // Distance of slide.
    var deltaSlide = event.clientX - startClientX;
    // If sliding started first time and there was a distance.
    if (sliding == 1 && deltaSlide != 0) {
      sliding = 2; // Set status to 'actually moving'
      startPixelOffset = pixelOffset; // Store current offset
    }
    
    //  When user move image
    if (sliding == 2) {
      // Means that user slide 1 pixel for every 1 pixel of mouse movement.
      var touchPixelRatio = 1;
      // Check for user doesn't slide out of boundaries
      if ((currentSlide == 0 && event.clientX > startClientX) ||
         (currentSlide == slideCount - 1 && event.clientX < startClientX))
        // Set ratio to 3 means image will be moving by 3 pixels each time user moves it's pointer by 1 pixel. (Rubber-band effect)
        touchPixelRatio = 3;
      // Calculate move distance.
      pixelOffset = startPixelOffset + deltaSlide / touchPixelRatio;
      // Apply moving and remove animation class
      $('#slides').css('transform', 'translateX(' + pixelOffset + 'px').removeClass();
    }
  }
  
  /** When user release pointer finish slide moving.
  */
  function slideEnd(event) {
    if (sliding == 2){
      // Reset sliding.
      sliding = 0;
      // Calculate which slide need to be in view.
      currentSlide = pixelOffset < startPixelOffset ? currentSlide + 1 : currentSlide -1;
      // Make sure that unexisting slides weren't selected.
      currentSlide = Math.min(Math.max(currentSlide, 0), slideCount - 1);
      // Since in this example slide is full viewport width offset can be calculated according to it.
      pixelOffset = currentSlide * -$('body').width();
      // Remove style from DOM (look below)
      $('#temp').remove();
      // Add a translate rule dynamically and asign id to it
      $('<style id="temp">#slides.animate{transform: translateX(' + pixelOffset + 'px)}</style>').appendTo('head');
      // Add animate class to slider and reset transform prop of this class.
      $('#slides').addClass('animate').css('transform', '');
      autoAnimation = true;
      startAutoPlay();
    }
  }
  
  var animationDelayID = undefined;
  var currentSlide = 1;
  var autoAnimation = true;
  
  function disableAutoPlay() {
    autoAnimation = false;
  }
  // ToDo: Start animation with slight delay for autoplay, wait to finish translate;
  function startAutoPlay() {
    if(autoAnimation){
      animationDelayID = window.setTimeout(autoPlay, 1000);
    }
  }
  
  function autoPlay() {
    if (currentSlide < slideCount) {
      switchLeft(currentSlide);
      currentSlide += 1;
      startAutoPlay();
    } else {
      jumpToStart();
      currentSlide = 2;
      //autoPlay();
    }
  }
  
  function jumpToStart() {
    $('#slides').removeClass('animate');
    $('#slides').addClass('static-move');
    $('#slides').css('transform','translateX(-' + slideWidth + 'px)');  
    window.setTimeout(autoPlay, 50);
  }
  
  function stopAutoPlay() {
    window.clearTimeout(animationDelayID);
  }
  
  function switchLeft(slide) {
    $('#slides').removeClass('static-move');
    $('#slides').addClass('animate');
    $('#slides').css('transition-property', 'all');
    $('#slides').css('transform','translateX(-' + slide * slideWidth + 'px)');    
  }
  
  function switchRight(slide) {
    $('#slides').addClass('animate');
    $('#slides').css('transform','translateX(' + slide * slideWidth + 'px)');    
  }

  init();  
});