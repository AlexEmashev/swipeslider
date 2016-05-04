#Image Slider With Swipe

##About

This is a tiny jQuery plugin that represents image slider (carousel). Slider supports mouse and touch inputs to slide through images. Also the slider supports HTML content.

![Demo picture](img/small_demo.gif)

[Demo page](http://alexemashev.github.io/swipeslider/)

##Features

- mouse and touch (swipe) support;
- next, previous buttons;
- bullets to change current slide;
- can work with images as well as HTML;
- various options (animation effect, timings, enable, disable certain properties);
- using css transition to change slides (so it should be video accelerated);
- responsiveness, can take up available space and shrink images to fit slider if needed;

##Installation
Add these two files to your page:

[swipeslider.js](http://alexemashev.github.io/swipeslider/dist/swipeslider.js)
[swipeslider.css](http://alexemashev.github.io/swipeslider/dist/swipeslider.css)

You'll also need to add [jQuery](http://jquery.com/) library if it's not already.

Within your HTML add markup for slides, something like that:

```JavaScript
<figure id="sample_slider" class="swipslider">
<ul class="sw-slides">
  <li class="sw-slide">
    <img src="img/lang_yie_ar_kung_fu.jpg" alt="Lang from Yie Ar Kung Fu">
  </li>
  <li class="sw-slide">
    <img src="img/summer_beach.jpg" alt="Summer beach concept">
  </li>
  <li class="sw-slide">
    <img src="img/borderlands_tiny_tina.jpg" alt="Tiny Tina from Borderlands 2">
  </li>
  <li class="sw-slide">
    <img src="img/redhead.jpg" alt="Redhead girl">
  </li>
</ul>
</figure>
```

Add following script to make things going:

```HTML
<script>
$(window).load(function() {
  $('#sample_slider').swipeslider();
});
</script>
```

Do not forget to add at least height to your slider via css.

##Customizability

###Plugin Settings

Plugin can be customized via JavaScript object. For example:

```JavaScript
$('#sample_slider').swipeslider({autoPlay: false, swipe: false});
```

| Property         | Default   | Description                                                                       |
|------------------|-----------|----------------------------------------------------------------------------------|
|sliderHeight|'60%'       |Slider height. Set the value in percents to make slider height proportionally depend of slider's width (useful in responsive design). Set it in pixels to force constant height of the slider.|
|transitionDuration|500       |Duration of slide transition animation (in msec.)|
|timingFunction    |'ease-out'|Slide transition effect(CSS easing functions).|
|autoPlay          |true      |Enable automatic transition between slides.|
|autoPlayTimeout   |3000      |Delay (msec.) between slide switching when autoPlay is true.|
|prevNextButtons   |true      |Show previous and next buttons.|
|bullets           |true      |Show bullets that indicate which slide is active and used as quick switch between slides.|
|swipe             |true      |Enable swipe function to switch between slides.|

###Style

The interface can be customized by overriding attributes of CSS classes. *You can use either css or scss file in dist directory.*

| Element | Description |
|--------|--------|
|.swipslider |Block that contains slider itself.|
|.sw-slides |Block that contains slides.|
|.sw-slide |Slide block, can contain either block with content or img element.|
|.sw-slide img |Image of slide.|
|.sw-content |Block that can be used instead of img element and can contain other HTML elements. It can be used as a slide with content.|
|.sw-next-prev  |Overall style of previous and next button.|
|.sw-prev  |Style for previous button (to override the content use ::after pseudo element).|
|.sw-next  |Style for next button (to override the content use ::after pseudo element).|
|.sw-bullet  |Bullets container.|
|.sw-bullet li  |Single bullet|
|.sw-bullet li.active  |Active bullet|

##Dependencies

- jQuery;

##License

The MIT public license.