// Add polyfills
NodeList.prototype.forEach = Array.prototype.forEach;

// remove no-js class
document.documentElement.className = "js";

if(location.hash.match('editmode')){
  document.body.contentEditable = true;
}

// REQUEST ANIMATION FRAME POLYFILL
// ========
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                               || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame){
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

}());

// IOS AND ANDROID DETECTION
// ========
(function(){

  var ios = parseFloat(("" + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ""])[1]).replace("undefined", "3_2").replace("_", ".").replace("_", "")) || !1;
  window.isOldIOS = (ios && ios < 8);

  var android = navigator.userAgent.match(/android ([1-9]\.[0-9])/i);
  window.isOldAndroid = (android && parseFloat(android[1]) < 5);

})(); 

// MENU
// ========
(function(){

  // get menu elements
  var menu = document.querySelector('.nav');
  var menuBody = document.querySelector('.nav__body');
  var menuBodyInner = document.querySelector('.nav__body-inner');
  var menuTrigger = document.querySelector('.nav__trigger');
  var wrap = document.querySelector('.site-wrap');

  menuTrigger.onclick = function(e){

  	e.preventDefault();

  	if(menuBody.getAttribute('aria-hidden') === 'true'){

      menuTrigger.setAttribute('aria-expanded', 'true');
  		menuBody.setAttribute('aria-hidden', 'false');
      document.body.onclick = function(e){

        if(!menu.contains(e.target)){
          e.preventDefault();
          menuTrigger.removeAttribute('aria-expanded');
          menuBody.setAttribute('aria-hidden', 'true');
          document.body.onclick = null;

        }

      }
  	}

  	else {
      menuTrigger.removeAttribute('aria-expanded');
  		menuBody.setAttribute('aria-hidden', 'true');
  	}
  }

  menuBodyInner.ontouchstart = function(){

		var scrollTop = this.scrollTop;
		var scrollHeight = this.scrollHeight;
    var offsetHeight = this.offsetHeight;
    var contentHeight = scrollHeight - offsetHeight;
		
		if(scrollTop=== 0){
			this.scrollTop = 1;
		}

    if(contentHeight === scrollTop) {
    	this.scrollTop = (scrollTop-1);
    }
	}

})();

// ADVERT
// ========
(function(){

  // var paras = document.querySelectorAll('.article-body > p + p + p');
  // var advert = document.querySelector('.article-advert');
  // var length = paras.length%2 ? paras.length - 1 : paras.length;
  // var target = (paras[length/2]);
  // if(target){
  //   target.parentNode.insertBefore(advert, target.previousElementSibling);
  // }

})();


// VOTE
// ========
(function(){

  var vote = document.querySelector('.article-vote');

  if(!vote){
    return;
  }

  var score = vote.querySelector('[data-role="score"]');
  var buttons = vote.querySelectorAll('[data-role="vote-button"]');
  var title = vote.id;

  if(window.localStorage.getItem(title)){
    vote.setAttribute('aria-disabled', true);
    vote.setAttribute('data-voted', window.localStorage.getItem(title));
  }

  else {
    buttons.forEach(function(item){

      item.onclick = function(e){

        e.preventDefault();

        if(this.getAttribute('data-vote') === 'yes'){
          vote.setAttribute('data-voted', 'yes');
          window.localStorage.setItem(title, 'yes');
          ga('send', 'pageview', location.pathname + '?action=voteup');

        }

        else {
          vote.setAttribute('data-voted', 'no');
          window.localStorage.setItem(title, 'no');
          ga('send', 'pageview', location.pathname + '?action=votedown');

        }

        vote.setAttribute('aria-disabled', true);
        this.className += ' button--explode';
      }
    })
  }

  vote.style.visibility = "visible";

})();

// LAZY IMAGES
// ================
(function(){
  
  var android = !!navigator.userAgent.match(/android/i);
  var images = document.getElementsByClassName('lazy-load');

  function isInViewPort(image){

    var rect = image.getBoundingClientRect();

    // return true if the image is visible and in the viewport top and bottom
    // otherwise return false

    if(rect.width === 0){

      // element is not visible
      return false;
    }

    if(rect.bottom < 0){

      // out of viewport top
      return false;
    }

    // @note - use a fallback for window.innerHeight in IE8
    if((window.innerHeight - rect.top) < 0){

      // out of viewport bottom
      return false;
    }

    // if it passes all that, its visible
    return true;

  }


  function loadedImage(){
    this.className = this.className.replace(/\blazy-load\b/g, '');
  }

  function checkImages(){

    for(var i = -1;++i<images.length;){

      var image = images[i];

      if(isInViewPort(image)){
        image.addEventListener('load', loadedImage);
        image.addEventListener('error', loadedImage);

        if(window.isOldAndroid || window.isOldIOS){
          image.naturalWidth > 0 && loadedImage.call(image);
          image.readyState === 'complete' && loadedImage.call(image);
        }
      
        image.setAttribute('srcset', image.getAttribute('data-srcset'));
        image.setAttribute('src', image.src);
      }
    }
    
    requestAnimationFrame(function(){
      setTimeout(function(){
        checkImages();
      },100);
    });
  }

  checkImages();

})();

// GA
// ================
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

if(!location.hostname.match(/localhost|192.168/)){
  
  ga('create', 'UA-61416169-1', 'auto');

  if(location.pathname.length < 2){
    ga('send', 'pageview', '/index.html');
  }

  else {
    ga('send', 'pageview');
  }
};


// SHARE
// =======
(function(){

  var share = document.querySelector('.share__button');
  var sharePanel = document.querySelector('.share__panel');

  if(!share){
    return;
  }

  share.onclick = function(e){

    e.preventDefault();

    var state = share.getAttribute('aria-expanded');
    
    if(state === "true"){
      share.setAttribute('aria-expanded', 'false');
      sharePanel.setAttribute('aria-hidden', 'true');
    }

    else {
      share.setAttribute('aria-expanded', 'true');
      sharePanel.setAttribute('aria-hidden', 'false');
    }

    document.body.addEventListener('click', function(e){
      if(!share.contains(e.target)){
        share.setAttribute('aria-expanded', 'false');
        sharePanel.setAttribute('aria-hidden', 'true');
      }
    });

  }

})();

// REMOVE OUTLINE ON MOUSE FOCUS
// =======
(function(){

  var noFocus = false;

  document.onmousemove = function(){
    if(!noFocus){
      document.documentElement.className += ' no-focus';
      noFocus = true;
    }
  }

  document.onkeydown = function(){
    if(noFocus){
      document.documentElement.className = document.documentElement.className.replace(/\b no-focus\b/g, '');
      noFocus = false;
    }
  }


})();

// BACK TO TOP
// ========

(function(){

  function scroll(top){

    var isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;
    if(isSmoothScrollSupported){
      window.scrollTo({
        top: top,
        'behavior': 'smooth'
      })
    }

    else {
      window.scrollTo(0, top);
    }
  }

  var top = document.querySelector('.footer__top');
  var commentButton = document.querySelector('.comment-button');
  var commentDiv = document.getElementById('comments');

  top.onclick = function(e){
    e.preventDefault();
    scroll(0);
  }


  function check(){

    if(window.pageYOffset > 500){
      top.style.opacity = 1;
    }

    else {
      top.style.opacity = 0;
    }

    setTimeout(function(){
      requestAnimationFrame(check);
    }, 250);
  }

  check();

  if(!commentButton){
    return;
  }

  commentButton.onclick = function(e){
    e.preventDefault();
    var top = commentDiv.getBoundingClientRect().top + window.pageYOffset;
    scroll(top);
  }

})();

// SEARCH
// ========
(function(){

  var tile = '<div class="grid__item"><a style="background-color: #{tilebg}" href="#{url}" class="tile transition"><div class="tile__image"><img src="#{tile-img}" alt="#{head1}" class="tile__image-target"></div><div class="tile__body"><h2>#{head1}</h2><h3>#{head2}</h3></div><div class="score"></div></a></div>';
  var searchbox = document.querySelector('.search');
  var searchinput = document.querySelector('.search__input');
  var searchareas = document.querySelectorAll('[data-role="search-results"]');

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  function showResults(show){
    if(show){
      searchareas[1].style.display = 'block';
      searchareas[0].style.display = 'none';
      searchbox.querySelector('a').style.visibility = 'visible';
    }

    else {
      searchareas[1].style.display = 'none';
      searchareas[0].style.display = 'block';
      searchbox.querySelector('a').style.visibility = 'hidden';
    }
  }

  function getResults(term){

    var results = '';
    var matches = 0;
    var regex = new RegExp('^' + term, 'i');

    window.searchlookup.forEach(function(story){

      if(matches < 12){

        var match = '';

        for(var i = -1;++i<story.tags.length;){
          var tag = story.tags[i];
          if(tag.match(regex)){
            match = tile.replace(/#{head1}/g, story.head1).replace(/#{head2}/g, story.head2).replace(/#{tile-img}/g, story.tile).replace(/#{tilebg}/, story.tilebg).replace(/#{url}/, story.url);
            matches ++;
            break;
          }
        }

        results += match;

      }

    });

    return results;

  }


  if(searchbox && window.searchlookup){

    searchbox.insertAdjacentHTML('beforeend', "<a href='#' class='search__clear'></a>");
    searchbox.className += ' search--active';

    searchinput.onkeyup = debounce(function(e){

      if(e.keyCode === 13){
        searchinput.blur();
        return;
      }

      if(searchinput.value.length < 1){
        showResults(false);
      }

      else {
        showResults(true);
        searchareas[1].innerHTML = getResults(searchinput.value);

      }
    }, 100);

    searchbox.querySelector('a').onclick = function(e){
      e.preventDefault();
      searchinput.value = '';
      showResults(false);
    }
  }

})();


// FASTCLICK
// ========
(function(){function e(a,b){function c(a,b){return function(){return a.apply(b,arguments)}}var d;b=b||{};this.trackingClick=!1;this.trackingClickStart=0;this.targetElement=null;this.lastTouchIdentifier=this.touchStartY=this.touchStartX=0;this.touchBoundary=b.touchBoundary||10;this.layer=a;this.tapDelay=b.tapDelay||200;this.tapTimeout=b.tapTimeout||700;if(!e.notNeeded(a)){for(var f="onMouse onClick onTouchStart onTouchMove onTouchEnd onTouchCancel".split(" "),h=0,k=f.length;h<k;h++)this[f[h]]=c(this[f[h]],
this);g&&(a.addEventListener("mouseover",this.onMouse,!0),a.addEventListener("mousedown",this.onMouse,!0),a.addEventListener("mouseup",this.onMouse,!0));a.addEventListener("click",this.onClick,!0);a.addEventListener("touchstart",this.onTouchStart,!1);a.addEventListener("touchmove",this.onTouchMove,!1);a.addEventListener("touchend",this.onTouchEnd,!1);a.addEventListener("touchcancel",this.onTouchCancel,!1);Event.prototype.stopImmediatePropagation||(a.removeEventListener=function(b,c,d){var e=Node.prototype.removeEventListener;
"click"===b?e.call(a,b,c.hijacked||c,d):e.call(a,b,c,d)},a.addEventListener=function(b,c,d){var e=Node.prototype.addEventListener;"click"===b?e.call(a,b,c.hijacked||(c.hijacked=function(a){a.propagationStopped||c(a)}),d):e.call(a,b,c,d)});"function"===typeof a.onclick&&(d=a.onclick,a.addEventListener("click",function(a){d(a)},!1),a.onclick=null)}}var k=0<=navigator.userAgent.indexOf("Windows Phone"),g=0<navigator.userAgent.indexOf("Android")&&!k,f=/iP(ad|hone|od)/.test(navigator.userAgent)&&!k,l=
f&&/OS 4_\d(_\d)?/.test(navigator.userAgent),m=f&&/OS [6-7]_\d/.test(navigator.userAgent),n=0<navigator.userAgent.indexOf("BB10");e.prototype.needsClick=function(a){switch(a.nodeName.toLowerCase()){case "button":case "select":case "textarea":if(a.disabled)return!0;break;case "input":if(f&&"file"===a.type||a.disabled)return!0;break;case "label":case "iframe":case "video":return!0}return/\bneedsclick\b/.test(a.className)};e.prototype.needsFocus=function(a){switch(a.nodeName.toLowerCase()){case "textarea":return!0;
case "select":return!g;case "input":switch(a.type){case "button":case "checkbox":case "file":case "image":case "radio":case "submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}};e.prototype.sendClick=function(a,b){var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur();d=b.changedTouches[0];c=document.createEvent("MouseEvents");c.initMouseEvent(this.determineEventType(a),!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,
!1,!1,!1,!1,0,null);c.forwardedTouchEvent=!0;a.dispatchEvent(c)};e.prototype.determineEventType=function(a){return g&&"select"===a.tagName.toLowerCase()?"mousedown":"click"};e.prototype.focus=function(a){var b;f&&a.setSelectionRange&&0!==a.type.indexOf("date")&&"time"!==a.type&&"month"!==a.type?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()};e.prototype.updateScrollParent=function(a){var b,c;b=a.fastClickScrollParent;if(!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c;a.fastClickScrollParent=
c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)};e.prototype.getTargetElementFromEventTarget=function(a){return a.nodeType===Node.TEXT_NODE?a.parentNode:a};e.prototype.onTouchStart=function(a){var b,c,d;if(1<a.targetTouches.length)return!0;b=this.getTargetElementFromEventTarget(a.target);c=a.targetTouches[0];if(f){d=window.getSelection();if(d.rangeCount&&!d.isCollapsed)return!0;if(!l){if(c.identifier&&c.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;
this.lastTouchIdentifier=c.identifier;this.updateScrollParent(b)}}this.trackingClick=!0;this.trackingClickStart=a.timeStamp;this.targetElement=b;this.touchStartX=c.pageX;this.touchStartY=c.pageY;a.timeStamp-this.lastClickTime<this.tapDelay&&a.preventDefault();return!0};e.prototype.touchHasMoved=function(a){a=a.changedTouches[0];var b=this.touchBoundary;return Math.abs(a.pageX-this.touchStartX)>b||Math.abs(a.pageY-this.touchStartY)>b?!0:!1};e.prototype.onTouchMove=function(a){if(!this.trackingClick)return!0;
if(this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))this.trackingClick=!1,this.targetElement=null;return!0};e.prototype.findControl=function(a){return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")};e.prototype.onTouchEnd=function(a){var b,c,d=this.targetElement;if(!this.trackingClick)return!0;if(a.timeStamp-this.lastClickTime<
this.tapDelay)return this.cancelNextClick=!0;if(a.timeStamp-this.trackingClickStart>this.tapTimeout)return!0;this.cancelNextClick=!1;this.lastClickTime=a.timeStamp;b=this.trackingClickStart;this.trackingClick=!1;this.trackingClickStart=0;m&&(c=a.changedTouches[0],d=document.elementFromPoint(c.pageX-window.pageXOffset,c.pageY-window.pageYOffset)||d,d.fastClickScrollParent=this.targetElement.fastClickScrollParent);c=d.tagName.toLowerCase();if("label"===c){if(b=this.findControl(d)){this.focus(d);if(g)return!1;
d=b}}else if(this.needsFocus(d)){if(100<a.timeStamp-b||f&&window.top!==window&&"input"===c)return this.targetElement=null,!1;this.focus(d);this.sendClick(d,a);f&&"select"===c||(this.targetElement=null,a.preventDefault());return!1}if(f&&!l&&(b=d.fastClickScrollParent)&&b.fastClickLastScrollTop!==b.scrollTop)return!0;this.needsClick(d)||(a.preventDefault(),this.sendClick(d,a));return!1};e.prototype.onTouchCancel=function(){this.trackingClick=!1;this.targetElement=null};e.prototype.onMouse=function(a){return this.targetElement&&
!a.forwardedTouchEvent&&a.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0};e.prototype.onClick=function(a){if(this.trackingClick)return this.targetElement=null,this.trackingClick=!1,!0;if("submit"===a.target.type&&0===a.detail)return!0;a=this.onMouse(a);a||(this.targetElement=null);return a};e.prototype.destroy=function(){var a=this.layer;g&&(a.removeEventListener("mouseover",
this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0));a.removeEventListener("click",this.onClick,!0);a.removeEventListener("touchstart",this.onTouchStart,!1);a.removeEventListener("touchmove",this.onTouchMove,!1);a.removeEventListener("touchend",this.onTouchEnd,!1);a.removeEventListener("touchcancel",this.onTouchCancel,!1)};e.notNeeded=function(a){var b,c;if("undefined"===typeof window.ontouchstart)return!0;if(c=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||
[,0])[1])if(g){if((b=document.querySelector("meta[name=viewport]"))&&(-1!==b.content.indexOf("user-scalable=no")||31<c&&document.documentElement.scrollWidth<=window.outerWidth))return!0}else return!0;return n&&(b=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),10<=b[1]&&3<=b[2]&&(b=document.querySelector("meta[name=viewport]"))&&(-1!==b.content.indexOf("user-scalable=no")||document.documentElement.scrollWidth<=window.outerWidth))||"none"===a.style.msTouchAction||"manipulation"===a.style.touchAction||
27<=+(/Firefox\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]&&(b=document.querySelector("meta[name=viewport]"))&&(-1!==b.content.indexOf("user-scalable=no")||document.documentElement.scrollWidth<=window.outerWidth)?!0:"none"===a.style.touchAction||"manipulation"===a.style.touchAction?!0:!1};e.attach=function(a,b){return new e(a,b)};"function"===typeof define&&"object"===typeof define.amd&&define.amd?define(function(){return e}):"undefined"!==typeof module&&module.exports?(module.exports=e.attach,
module.exports.FastClick=e):window.FastClick=e})();

//attach
FastClick.attach(document.body);

