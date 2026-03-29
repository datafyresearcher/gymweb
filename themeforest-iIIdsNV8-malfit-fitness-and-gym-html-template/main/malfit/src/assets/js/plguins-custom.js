"use strict";
document.addEventListener("DOMContentLoaded", function () {
    $(function ($) {
        const initializeAos = () => {
            if (window.__lrAosInitialized || typeof AOS === "undefined") {
                return;
            }

            window.__lrAosInitialized = true;
            AOS.init({
                once: true,
            });
        };

        // <========= Preloader Starts ============>
        $(window).on('load', function () {
            const $preloader = $('#preloader');

            if ($preloader.length) {
                setTimeout(function () {
                    $preloader.fadeOut('slow', function () {
                        $(this).remove();
                        initializeAos();
                    });
                }, 1500);
            } else {
                initializeAos();
            }
        });
        // <========= Preloader Ends ============>
        // <========= Aos Animation ============>
        $(document).ready(function () {
            $('.zoomin').attr({
                "data-aos": "zoom-in",
                "data-aos-duration": "1300"
            });
            $('.fadeup').attr({
                "data-aos": "fade-up",
                "data-aos-duration": "1200"
            });
            $('.fadedown').attr({
                "data-aos": "fade-down",
                "data-aos-duration": "1200"
            });
            $('.fadeleft').attr({
                "data-aos": "fade-left",
                "data-aos-duration": "1200"
            });
            $('.faderight').attr({
                "data-aos": "fade-right",
                "data-aos-duration": "1200"
            });
            $('.flipup').attr({
                "data-aos": "flip-up",
                "data-aos-duration": "1500"
            });
            $('.flipdown').attr({
                "data-aos": "flip-down",
                "data-aos-duration": "1500"
            });
            $('.flipleft').attr({
                "data-aos": "flip-left",
                "data-aos-duration": "1500"
            });
            $('.flipright').attr({
                "data-aos": "flip-right",
                "data-aos-duration": "1500"
            });
            initializeAos();
        });
        // <========= Aos Animation ============>
        // <========= PopUp video starts ============>
        $(function () {
            $('.playbtn').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: false
            });
        });
        // <========= PopUp video ends ============>
        // <========= Brand Sliders ============>
        let bradCarousel = document.querySelector('.brand-carousel');
        if (bradCarousel) {
            const swiper = new Swiper(bradCarousel, {
                loop: true,
                speed: 5000,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false,
                },
                freeMode: true,
                allowTouchMove: false,
                spaceBetween: 50,
                slidesPerView: 'auto',
            });
        }
        // <========= Brand Sliders ============>
        // <========= Brand Sliders ============>
        let bradCarouseltwo = document.querySelector('.brand-carouseltwo');
        if (bradCarouseltwo) {
            const swiper = new Swiper(bradCarouseltwo, {
                loop: true,
                speed: 5000,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false,
                },
                freeMode: true,
                allowTouchMove: false,
                spaceBetween: 50,
                slidesPerView: 'auto',
            });
        }
        // <========= Brand Sliders ============>
        // Testimonial Starts
        let bradCarouselShow = document.querySelector('.brad-carousel-show');
        if (bradCarouselShow) {
            const swiper = new Swiper(bradCarouselShow, {
                loop: true,
                speed: 1000,
                autoplay: {
                    delay: 2000,
                    disableOnInteraction: false,
                },
                spaceBetween: 24,
                slidesPerView: 1,
                breakpoints: {
                    1599: {
                        slidesPerView: 1,
                    },
                    1400: {
                        slidesPerView: 1,
                    },
                    1200: {
                        slidesPerView: 1,
                    },
                    992: {
                        slidesPerView: 1,
                    },
                    768: {
                        slidesPerView: 1,
                    },
                    578: {
                        slidesPerView: 1,
                    },
                    375: {
                        slidesPerView: 1,
                    },
                }
            });
        }
        // Testimonial Ends

        // <========= Testimonial Starts ============>
        let categoriesCarousel = document.querySelector('.testimonial_slider');
        let categoriesBtn = document.querySelector('.testimonial_slider_btn');
        if (categoriesCarousel) {
            const swiper = new Swiper(categoriesCarousel, {
                loop: true,
                // autoplay: {
                //     delay: 5000,
                //     disableOnInteraction: false,
                // },
                spaceBetween: 0,
                slidesPerView: 1,
                paginationClickable: true,
                navigation: {
                    nextEl: categoriesBtn.querySelector('.ara-next'),
                    prevEl: categoriesBtn.querySelector('.ara-prev'),
                },
            });
        }
        // <========= Testimonial Ends ============>
        // <========= Testimonial two Starts ============>
        let testimonialCarousel = document.querySelector('.testimonial_two');
        let testimonialBtn = document.querySelector('.testimonial_two_btn');
        if (testimonialCarousel) {
            const swiper = new Swiper(testimonialCarousel, {
                loop: true,
                speed: 1200,
                autoplay: {
                    delay: 8000,
                    disableOnInteraction: false,

                },
                spaceBetween: 0,
                slidesPerView: 1,
                paginationClickable: true,
                navigation: {
                    nextEl: testimonialBtn.querySelector('.ara-next'),
                    prevEl: testimonialBtn.querySelector('.ara-prev'),
                },
                pagination: {
                    el: ".swiper-pagination",
                },
            });
        }
        // <========= Testimonial two Ends ============>
        var swiper = new Swiper(".mySwiper", {
            slidesPerView: 5,
            freeMode: false,
            watchSlidesProgress: false,
            spaceBetween: 20,
            breakpoints: {
                1599: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
                1400: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
                1200: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
                578: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
                375: {
                    slidesPerView: 5,
                    spaceBetween: 20,
                },
            },
        });
        var swiper2 = new Swiper(".mySwiper2", {
            loop: true,
            speed: 500,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            spaceBetween: 0,
            thumbs: {
                swiper: swiper,
            },
        });

        // <========= Odometer Init  ============>
        let windowHeight = $(window).height();
        $('.odometer').children().each(function () {
            if ($(this).isInViewport({ "tolerance": windowHeight, "toleranceForLast": windowHeight, "debug": false })) {
                var section = $(this).closest(".counters");
                section.find(".odometer").each(function () {
                    $(this).html($(this).attr("data-odometer-final"));
                });
            }
        });

        $(document).ready(function () {
            $(".odometer").each(function () {
                var $odometerElement = $(this);
                var elementValue = Number($odometerElement.attr("data-counter-value"));

                var od = new Odometer({
                    el: $odometerElement[0],
                    value: 0,
                    format: "",
                    theme: "digital"
                });

                var observer = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            od.update(elementValue);
                            observer.unobserve(entry.target);
                        }
                    });
                });

                observer.observe($odometerElement.parent()[0]);
            });
        });
        // <========= Tab Starts ============>
        $(".tablinks .nav-links").each(function () {
            var targetTab = $(this).closest(".singletab");
            targetTab.find(".tablinks .nav-links").each(function () {
                var navBtn = targetTab.find(".tablinks .nav-links");
                navBtn.click(function () {
                    navBtn.removeClass('active');
                    $(this).addClass('active');
                    var indexNum = $(this).closest("li").index();
                    var tabcontent = targetTab.find(".tabcontents .tabitem");
                    $(tabcontent).removeClass('active');
                    $(tabcontent).eq(indexNum).addClass('active');
                });
            });
        });
        // <========= Tab Ends ============>
        // <========= custom Accordion ============>
        $('.accordion-single .header-area').on('click', function () {
            if ($(this).closest(".accordion-single").hasClass("active")) {
                $(this).closest(".accordion-single").removeClass("active");
                $(this).next(".content-area").slideUp();
            } else {
                $(".accordion-single").removeClass("active");
                $(this).closest(".accordion-single").addClass("active");
                $(".content-area").not($(this).next(".content-area")).slideUp();
                $(this).next(".content-area").slideToggle();
            }
        });
        // <========= Nice Select Starts ============>
        // $('select').niceSelect();
        // <========= Nice Select Ends ============>


    });
});
