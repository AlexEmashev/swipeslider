/**
* jQuery plugin "Swipe slider".
* Image slider that supports swiping function to change slides.
*/
(function($) {
  
  $.fn.swipeslider = function(options) {
    var slider = this; // reference to slider
    var defaultSettings = {
      transitionDuration: 500,
      autoPlayTimeout: 3000,
      timingFunction: 'ease-out',
    };

    var settings = $.extend(defaultSettings, options);

    // Privates //
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
    var transitionDuration = settings.transitionDuration;;
    var autoPlayTimeout = 3000;
    var animationDelayID = undefined;
    var autoAnimation = true;

    /** 
    * Set initial values.
    */
    (function init() {
      slideWidth = slider.width();
      // Add last slide before first and first before last to seamless and engless transition
      slider.find('.slide:last-child').clone().prependTo(slider);
      slider.find('.slide:nth-child(2)').clone().appendTo(slider);
      slideCount = slider.find('.slide').length;

      setTransitionDuration(transitionDuration);
      setTimingFunction(settings.timingFunction);
      setTransitionProperty('all');

      // Add event handlers to react when user swipe.
      slider.on('mousedown touchstart', swipeStart);
      $('html').on('mouseup touchend', swipeEnd);
      $('html').on('mousemove touchmove', swipe);

      // Jump to slide 1 (since another slide was added to the beginning of row);
      jumpToSlide(1);

      startAutoPlay();
    })();

    /**
    * Triggers when user starts swipe.
    * @param event browser event object
    */
    function swipeStart(event) {
      if(!allowSwipe) {
        return;
      }

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

    /** Triggers when user continues swipe.
    * @param event browser event object
    */
    function swipe(event) {
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

    /** Triggers when user finishes swipe.
    * @param event browser event object
    */
    function swipeEnd(event) {
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

    /** 
    * Disables reaction on swipe while transition effect is playing.
    */
    function disableSwipe() {
      allowSwipe = false;
      window.setTimeout(enableSwipe, transitionDuration)
    }

    /** 
    * Enables reaction on swipe.
    */
    function enableSwipe() {
      allowSwipe = true;
    }

    /**
    * Disables autoplay function.
    * Used while swiping.
    */
    function disableAutoPlay() {
      autoAnimation = false;
      window.clearTimeout(animationDelayID);
    }

    /**
    * Launches autoPlay function with delay.
    */
    function startAutoPlay() {
      if(autoAnimation){
        animationDelayID = window.setTimeout(autoPlay, autoPlayTimeout);
      }
    }

    /**
    * Switches between slides in autoplay mode.
    */
    function autoPlay() {
      currentSlide += 1;
      switchForward();

      // If switched to last slide, wait until animation is over and jump to the second.
      if (currentSlide == slideCount - 1) {
        window.setTimeout(jumpToStart, transitionDuration);
      }

      startAutoPlay();
    }

    /**
    * Switches slideshow one slide forward.
    */
    function switchForward() {
      enableTransition(true);
      translateX(-currentSlide * slideWidth);
    }

    /**
    * Switches slideshow one slide backward.
    */
    function switchBackward() {
      enableTransition(true);
      translateX(currentSlide * slideWidth); 
    }

    /**
    * Switches slideshow to the first slide.
    * Remark: the first slide from html elements, not the slide that was added for smooth transition effect.
    */
    function jumpToStart() {
      jumpToSlide(1);
    }

    /**
    * Switches slideshow to exact slide number.
    * Remark: respecting two slides that were added for smooth transaction effect.
    */
    function jumpToSlide(slideNumber){
      enableTransition(false);
      currentSlide = slideNumber;
      translateX(-slideWidth * currentSlide);
      window.setTimeout(returnTransitionAfterJump, 50);
    }

    /**
    * Switches slideshow to the last slide.
    * Remark: the last slide from html elements, not the slide that was added for smooth transition effect.
    */
    function jumpToEnd() {
      jumpToSlide(slideCount - 2);
    }

    /**
    * Returns transition effect after jumpToSlide function call.
    */
    function returnTransitionAfterJump() {
      enableTransition(true);
    }

    /** 
    * Enables or disables transition
    * @param {bool} true to enable traintion.
    */
    function enableTransition(enable) {
      if (enable) {
        setTransitionProperty('all');
      } else {
        setTransitionProperty('none');
      }
    }

    /**
    * Translates slides on certain amount.
    * @param distance {Number} distance of transition. If negative, transition from right to left.
    */
    function translateX(distance){
      slider
      // Prefixes are being set automatically.
  //      .css('-webkit-transform','translateX(' + distance + 'px)')
  //      .css('-ms-transform','translateX(' + distance + 'px)')
        .css('transform','translateX(' + distance + 'px)');
    }

    /**
    * Sets duration of transition between slides.
    * @param duration {Number} amount in milliseconds.
    */
    function setTransitionDuration(duration){
      slider
  //      .css('-webkit-transition-duration', duration + 'ms')
        .css('transition-duration', duration + 'ms');
    }

    /**
    * Sets transition function.
    */
    function setTimingFunction(functionDescription){
      slider
  //      .css('-webkit-transition-timing-function', functionDescription)
        .css('transition-timing-function', functionDescription);
    }

    /**
    * Sets property that will be used in transition effect.
    */
    function setTransitionProperty(property){
      slider
  //      .css('-webkit-transition-property', property)
        .css('transition-property', property);
    }  

    return slider;    
  }
}(jQuery));