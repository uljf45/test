var  baseSwiper = null;
var guessTimer = null;

function inClientView (obj) {
	var $$ = window.Dom7;
	var clientHeight = document.documentElement.clientHeight;
	var bottomHeight = $$(".bottom-fixed").height();
	var topHeight = $$(".top-fixed").height();
	var top =  obj.getBoundingClientRect().top;
	var bottom =  obj.getBoundingClientRect().bottom;
	if( top<=clientHeight - bottomHeight && top>= topHeight ) return true;
	if( bottom <= clientHeight - bottomHeight && bottom >= topHeight  ) return true;
	return false;
}



function testGuessitem(swiper) {
	clearTimeout(guessTimer);
	guessTimer =setTimeout(function () {
		 var $$ = window.Dom7;
		var top =  document.getElementById('guessitem').getBoundingClientRect().top;
		var clientHeight = document.documentElement.clientHeight;
		var bottomHeight = $$(".bottom-fixed").height();
		var items = document.getElementById('guessitem').getElementsByTagName('section')[0].children;
		var temp = null;
		if(items.length > 0 && top<= clientHeight - bottomHeight){
			for (var i = 0; i < items.length; i++) {
				if( inClientView(items[i])  ){
					temp = items[i].getElementsByClassName('lazy');
					if(temp.length>0 && temp[0].dataset.background != ""){
						temp[0].style.backgroundImage = "url(https:"+ temp[0].dataset.background+")";
						temp[0].dataset.background = "";
					}
				}
			}
		};
		if(items.length==0 && top<= clientHeight - bottomHeight   ) {
			$$.getJSON('/js/guessitem.js', function (json) { 	 
				var str = '';			       
				var len = 0;
				for (var i = 0; i < json.data.section.length; i++) {
					if(json.data.section[i].template == 'single_titem'){
						len++;
						var items = json.data.section[i].items;
						str += ''+ 
						'<div style="float:left;" class="single_titem">'+
						'<div class="single_titem_wrap vertical-view">'+
						'<div data-background="'+items[0].imageUrl[0].imgUrl+'" class="lazy"></div>'+
						'<p>'+items[0].title[0].valueDesc+'</p>'+
						'<span>'+items[0].title[1].valueDesc+''+items[0].title[2].valueDesc+'</span>'+
						'</div>'+
						'</div>';
						if(len == 50) break;
					}
				}
				$$('#guessitem .loading').remove();
				$$('#guessitem section').html(str);
				swiper.updateSlidesSize();
			});
		} 
	}, 500);
	
}

setTimeout(function () {
	var swiper = new Swiper('.swiper-container', {
		direction: 'vertical',
		slidesPerView: 'auto',
		freeMode: true,
		// lazyLoading : true,
		// preloadImages:false,
		onTransitionEnd:function (swiper) {

			testGuessitem(swiper);
		},
		onTouchEnd: function (swiper) {
			testGuessitem(swiper);
		} ,
	});		  
	baseSwiper = swiper;

	var swiperBanner = new Swiper('.swiper-container2', {
		pagination: '.swiper-pagination',
		slidesPerView: 1,
		paginationClickable: true,
		speed:500,
		autoplay: 2000,
		autoplayDisableOnInteraction:false,
		loop: true
	});
	var swiperBanner = new Swiper('.swiper-container3', {
		pagination: '.swiper-pagination',
		slidesPerView: 1,
		paginationClickable: true,
		speed:500,
		loop: true,
	});
}, 30);

document.getElementById("gotop").addEventListener('click', function () {
	var $ = window.Dom7;
	$('.scroll-content').transition(500); 
	$('.scroll-content').transform( 'translate3D(0,0,0)' );		
	
});



function Counter (obj , enddate) {
	 var endDate = new Date();
 	 endDate.setSeconds(0);
 	 endDate.setMinutes(0);
 	 endDate.setHours(endDate.getHours()+1);
 	 this.endDate = Object.prototype.toString(endDate)=="[object Date]" ? enddate:endDate;
	 this.counter = obj;
	 // var counter = document.getElementsByClassName('counter')[0];
 	 // var endDate = new Date( counter.dataset.enddate);
 	 this.spans = this.counter.getElementsByTagName('span');
 	 this.countTimer = null;
}
Counter.prototype.start = function () {
	 clearInterval(this.countTimer);
	 var This = this;
	 this.countTimer = setInterval(function () {
		 var times = This.endDate.getTime() - new Date().getTime();
	 	 times = times/1000;
	 	 for (var i = 0; i < This.spans.length; i++) {
	 	 	if(This.spans[i].getAttribute('role') == 'h'){ This.spans[i].innerHTML = padLeftBy0(Math.floor( times/3600), 2) ; }
	 	 	if(This.spans[i].getAttribute('role') == 'm'){This.spans[i].innerHTML = padLeftBy0(Math.floor( times%3600/60) ,2); }
	 	 	if(This.spans[i].getAttribute('role') == 's'){ This.spans[i].innerHTML =  padLeftBy0(Math.floor(times%3600%60),2) ; }
	 	 } 	 	  
	 },1000/60);
}

function padLeftBy0 (num, n) {
	 var len = num.toString().length;
	 while (len<n) {
	 	num = '0' + num;
	 	len++;
	 }
	 return num;
}

var counter = new Counter( document.getElementsByClassName('counter')[0] );
counter.start();

var imgTimer = null;
 imgTimer = setInterval(function () {
	 var $ = window.Dom7;	 
	 var translateY  = $.getTranslate($('.scroll-content')[0],'y') ;
	 var clientHeight = document.documentElement.clientHeight;
	 if(translateY < -clientHeight ){ document.getElementById("gotop").style.display = 'block'; }
	 else{ document.getElementById("gotop").style.display = 'none';  }

	 if($('.swiper-lazy').length == 0) { 
	 	// clearInterval(imgTimer); 
	 	return;
	 }
	 $('.swiper-lazy').each(function() {
	 	if(inClientView(this) && $(this).dataset('src')){
	 		this.src = $(this).dataset('src').src;
	 		console.log($(this).dataset('src').src);
	 		$(this).removeClass('swiper-lazy');
	 	}
	 }); 
}, 1000/60);



!function(){
	var $ = window.Dom7;
	var index = 0;
	var len = $('.headline ul li').length;
	setInterval(function () {
		index++;
		if(index ==len) index = 0;
		$('.headline ul').transform('translate3d(0, -'+index+'00%, 0)' );
	}, 1800);
}();
