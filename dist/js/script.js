"use strict"

const isMobile = { 
    Android: function() { 
         return navigator.userAgent.match(/Android/i); 
        },
    BlackBerry: function() {  
         return navigator.userAgent.match(/BlackBerry/i); 
        },
    iOS: function() {
         return navigator.userAgent.match(/iPhone|iPad|iPod/i); 
        },
    Opera: function() {
         return navigator.userAgent.match(/Opera Mini/i); 
        },
    Windows: function() {
         return navigator.userAgent.match(/IEMobile/i); 
        },
    any: function() {
     return (
           isMobile.Android() ||
           isMobile.BlackBerry() ||
           isMobile.iOS() ||
           isMobile.Opera() ||
           isMobile.Windows()); 
    } 
};

// Меню бургера при клике 

const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
    iconMenu.addEventListener("click", function(e) {
        document.body.classList.toggle('_lock');
        iconMenu.classList.toggle('_active');
        menuBody.classList.toggle('_active');
    });
}


// Прокрутка при клике

const menuLinks = document.querySelectorAll('.menu__link[data-goto]');
    if(menuLinks.length > 0) {
        menuLinks.forEach(menuLink =>{
            menuLink.addEventListener("click", onMenuLinkClick);
        });

        function onMenuLinkClick(e) {
            const menuLink = e.target;
            if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)){
                const gotoBlock = document.querySelector(menuLink.dataset.goto);
                const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

                if(iconMenu.classList.contains('_active')) {
                    document.body.classList.remove('_lock');
                    iconMenu.classList.remove('_active');
                    menuBody.classList.remove('_active');
                }

                // Сама прокрутка
                window.scrollTo({
                    top: gotoBlockValue,
                    behavior: 'smooth'
                });
                e.preventDefault();
            }
        }
    }




    $(function(){
        $(".color_wrap ul li").each(function(item) {
            var color = $(this).attr("data-color");
            $(this).css("backgroundColor", color);
            
        }) 
    
        $(".color_wrap ul li").each(function(item) {
            $(this).click(function(){
                $(this).parents(".product_item")
                .find(".color_wrap ul li").removeClass("active");
                $(this).addClass("active");
                
                var imgsrc = $(this).attr("data-src");
                $(this).parents(".product__content").find("img").attr("src", imgsrc);
            })
        })
    })

    
$(document).ready(function(){
    $(".reviews__slider").owlCarousel({
      items:1,
      loop:true,
      nav:true,
      dots:true,
      // autoplay:true,
      autoplaySpeed:1000,
      smartSpeed:1500,
  });
  });
let element = document.querySelector('.consultation__surnum');
let maskOptions = {
  mask: '+7(000)000-00-00',
  lazy:false
}

let mask = new IMask(element, maskOptions);