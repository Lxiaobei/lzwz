/**
 *
 * @authors chan.yisen (aihuacyc@gmail.com)
 * @date    2017-08-28 09:25:51
 * @version $Id$
 */

$(function(){
	var $header = $("header"),
		$banner = $("#banner"),
		$win = $(window),
		$hb = $("html,body"),
		$ic = $("#index-content"),
		$w768 = $("#w768");
		$w759=$("#w759");
	var ts = {
		SetHeader: function(){
			var $menu = $("#menu,#menu1");
			var $close = $("#close,#close-1");
			var $navList = $("ul.nav-list"),
				$navLi = $navList.find(">li"),
				$navA = $navLi.find(">a");
			$("ul.stock-list").slick({
				dots: false,
				arrows: false,
				vertical: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 2000,
			});
			if($banner.length){
				$("#header").addClass("trans");
				$("#menu1").click(function(e){
					e.stopPropagation();
					var $navWrap = $(this).parents("header").find(".nav-wrap");
					var $navH = $navWrap.outerHeight(true);
	                var $scol_navH = $(this).parents(".banner-header").offset().top - $(document).scrollTop();


					if($navWrap.is(":visible")){
						$navWrap.slideUp("easeOutQuart");
					}else{
						$navWrap.slideDown("easeOutQuart");  
						if( $scol_navH < $navH){
			        	    $("html,body").animate({scrollTop: $(document).scrollTop() - $navH}, 1000);
						}
					}
				});

				$(window).scroll(function(){
					if($(this).scrollTop() > $win.height()){
						$("#header").removeClass("trans");
					}else{
						$("#header").addClass("trans");
					}
				});
			}else{
				/*$("#menu").click(function(){
					var $navWrap = $(this).parents("header").find(".nav-wrap");
					if($navWrap.is(":visible")){
						$navWrap.slideUp("easeOutQuart");
					}else{
						console.log("hover");
						$navWrap.slideDown("easeOutQuart");

					}
				});*/

			}

			$("#menu").click(function(){
				var $navWrap = $(this).parents("header").find(".nav-wrap");
				if($navWrap.is(":visible")){
					$navWrap.slideUp("easeOutQuart");
				}else{
					// console.log("hover");
					$navWrap.slideDown("easeOutQuart");
				}
			});



			$close.on("click", function(){
				var $navWrap = $(this).parents("header").find(".nav-wrap");
				$navWrap.slideUp();
			});
			$(".nav-wrap").hover(function(){
				// code
			},function(){
				$(".nav-wrap").slideUp();
			});
			if($w768.is(":visible")){
				//$("ul.stock-list").slick("unslick");
				$navA.on("click", function(e){
					console.log("c");
					if($(this).next().length){
						e.preventDefault();
						if($(this).next().is(":visible")){
							$(this).next().slideUp();
						}else{
							$(this).parent("li").siblings().find("dl").slideUp();
							$(this).next().slideDown();
						}
					}
				});
			}
			$(".lang-menu").on("click", function(e){
				e.stopPropagation();
				$(this).addClass("active");
				$(this).parents("header").find(".lang-box").toggle();

				if($(this).parents("header").find(".lang-box").is(":hidden")){
					$(this).removeClass("active");
				}
			});
			$("a.search-menu").on("click", function(){
				$(this).toggleClass("active");
				$(this).next(".s-form-wrap").toggle();
			});

			if($w759.is(":hidden")){

				$(".lang-menu").on("click", function(e){
					e.stopPropagation();
					$(".stock-menu").removeClass("active");
					$(".head-right-ph").find(".stock-box").removeClass("show");
				});

				$(".stock-menu").on("click", function(){
					$(this).toggleClass("active");

					$(this).parents("header").find(".stock-box").toggleClass("show");
					$(".lang-menu").removeClass("active");
					$(".head-right-ph").find(".lang-box").hide();


				});


			}
		},
		SetPhone: function(){},
		SetBanner: function(){
			var $winH = $win.height();
			var time = null;
			var i = 0;
			$banner.height($winH);
			$win.resize(function(){
				$winH = $(this).height();
				$banner.height($winH);
			});
			// $banner.on("mousewheel", function(e){
			// 	console.log(e.target);
			// 	clearTimeout(time);
			// 	if(i < 5){
			// 		e.preventDefault();
			// 	}
			// 	time = setTimeout(function(){
			// 		i += 1;
			// 	}, 500);
			// });
			// shake
			var $parallObj = $(".parallax-objects");
			if($parallObj.length){
				$parallObj.parallax();
			}
			// auto scroll
			var $pList = $banner.find(".p-list");
			$pList.slick({
				dots: false,
				arrows: false,
				vertical: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed:6000,
			});
		},
		SetAutoHeight: function(){
			var $indexBrandList = $ic.find("ul.index-brand-list");
			$indexBrandList.find("li").matchHeight();
		},
		SetBrand: function(){
			var $brandList = $("ul.brand-list"),
			    $brand_li = $brandList.find(".inner-li"),
			 	$bTop = $brandList.find(".b-top"),
			 	$pInfo = $brandList.find(".p-info"),
			 	$bClose = $brandList.find(".b-close a");

			$brand_li.hover(function(e){
			 	e.stopPropagation();
			 	$pInfo.fadeOut(300);
			 	$(this).find($pInfo).fadeIn(300);
			 },function(){
			 	$(this).find($pInfo).fadeOut(300);
			 });
			/* $bTop.on("mouseover", function(e){
			 	e.stopPropagation();
			 	$pInfo.fadeOut(300);
			 	$(this).next().fadeToggle(300);
			 });*/
			 $bClose.on("mouseover", function(){
			 	$pInfo.slideUp();
			 });
		}
	}
	// document ready
	ts.SetHeader();
	ts.SetBanner();
	ts.SetAutoHeight();
	ts.SetBrand();

	var $ib = $(".index-brand"),
		$ileft = $ib.find("i.i-left"),
		$iright = $ib.find("i.i-right"),
		mi = 50,
		stime = null;
	$(window).scroll(function(){
		clearTimeout(stime);
		if(isScrolledIntoView("#a1")){
			$("#a1").addClass("active");
		}
		if(isScrolledIntoView("#a2")){
			$("#a2").addClass("active");
		}
		if(isScrolledIntoView("#a3")){
			$("#a3").addClass("active");
		}
		if(isScrolledIntoView("#a4")){
			$("#a4").addClass("active");
		}
		if(isScrolledIntoView("#a5")){
			$("#a5").addClass("active");
		}
		if(isScrolledIntoView("#a6")){
			$("#a6").addClass("active");
		}
		if(isScrolledIntoView("#a7")){
			$("#a7").addClass("active");
		}
		if(isScrolledIntoView("#a8")){
			$("#a8").addClass("active");
		}
		if(isScrolledIntoView("#a9")){
			$("#a9").addClass("active");
		}
		if(isScrolledIntoView("#a10")){
			$("#a10").addClass("active");

			stime = setTimeout(function(){
				mi = mi -5;
				if(mi<0) mi = 0;
				// console.log(mi);
				$ileft.animate({marginRight:mi}, 200);
				$iright.animate({marginLeft: mi},200);
			}, 40);
		}
		if(isScrolledIntoView("#a11")){
			$("#a11").addClass("active");
		}
		if(isScrolledIntoView("#a12")){
			$("#a12").addClass("active");
		}
		if(isScrolledIntoView("#a13")){
			$("#a13").addClass("active");
		}
		if(isScrolledIntoView("#a14")){
			$("#a14").addClass("active");
		}
		if(isScrolledIntoView("#a15")){
			$("#a15").addClass("active");
		}
		if(isScrolledIntoView("#a16")){
			$("#a16").addClass("active");
		}
	});
	function isScrolledIntoView(elem) {
		var docViewTop = $(window).scrollTop();  //瑙嗙獥婊氬姩鐨勯珮搴�
		var docViewBottom = docViewTop + $(window).height();  //瑙嗙獥搴曢儴璺濈鏂囨。椤堕儴鐨勮窛绂�
		var elemTop = $(elem).length ? $(elem).offset().top+150 : 0;  //鍏冪礌椤堕儴璺濈鏂囨。椤堕儴鐨勮窛绂�
		var elemBottom = elemTop + $(elem).height();  //鍏冪礌搴曢儴璺濈鏂囨。椤堕儴鐨勮窛绂�
		return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));  //鍒ゆ柇鍏冪礌鏄惁鍦ㄥ綋鍓嶈绐楋紝鏄殑璇濊繑鍥瀟rue锛屽惁鍒欒繑鍥瀎alse
     }
	//鍏嶈矗澹版槑
	var $disc = $("#disc");
	$disc.click(function(){
		window.open('include/disclaimer.php','disclaimer','status=yes,scrollbars=no,width=550,height=500');
	});
});


$(function(){
    var $w768 = $("#w768");
    $(window).resize(function(){
	
	if($w768.is(":visible")){
		$("ul.choose-year li.year-btn").click(function(){
		   $(this).find("ul.choose-box").toggle();
	   })
	}else{
		$("ul.choose-year li.year-btn").hover(function(){
		$(this).find("ul.choose-box").show();
		},function(){
			$(this).find("ul.choose-box").hide();
		})
	}


   }); 
   $(window).resize(); 
	
})


$(function(){
	var $href = window.location.href;
	var $str=$href.split("/");
	var $temp=$str[$str.length-1];
	var $str_1 = $temp.split("#");
	var $temp_1 = "#" + $str_1[$str_1.length-1];
	var $stemp = $($temp_1).length > 0 ? $($temp_1).offset().top : 0;


    $("html, body").animate({
       scrollTop: ($stemp - $(document).scrollTop()) - $("#header").height() + "px"
    }, {
        duration: 500,
        easing: "swing"
    });
    return false;

    //console.log($(document).scrollTop());
    //console.log($($temp_1).offset().top);

   
})



