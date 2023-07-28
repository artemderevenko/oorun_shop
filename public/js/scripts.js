$(document).ready(function () {

	changeHeader();

	$(window).scroll(function () {
		changeHeader();
	});

	function changeHeader() {
		if ($(window).scrollTop() > 30) {
			$('.header').addClass('scroll');
			$('.header-info, .header-menu, .logo').addClass('scroll');
			if (!$('.logo-mini').hasClass('visible')) {
				$('.logo-mini').show(600);
			}
		}

		if ($(window).scrollTop() < 30) {
			$('.header').removeClass('scroll');
			$('.header-info, .header-menu, .logo').removeClass('scroll');
			if (!$('.logo-mini').hasClass('visible')) {
				$('.logo-mini').hide(600);
			}
		}
	}

	$('.toogle').on('click', function () {
		$(".header-menu").toggleClass("active");
		$(this).toggleClass('click');
		return false;
	});

	$('.img-item').on('click', function () {
		const img = $(this).find('img');
		const newSrc = img.attr('data-src');
		$('#main-image').attr('src', newSrc);
		$('.img-item').removeClass('active');
		$(this).addClass('active');
	});

	$('#close-notify').on('click', function () {
		$('#notify').fadeOut(300);
	});
});