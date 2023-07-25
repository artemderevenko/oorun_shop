$(document).ready(function () {

	changeHeader();

	// показ/скрытие меню 
	$('.toogle').on('click', function () {
		$(".header-menu").toggleClass("active");
		$(this).toggleClass('click');
		return false;
	});

	$(".buy").click(function (e) {
		var href = $(this).attr("href"),
			offsetTop = href === "#" ? 0 : $(href).offset().top - 60;
		$('html, body').stop().animate({
			scrollTop: offsetTop
		}, 600);
		e.preventDefault();
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

	$(window).scroll(function () {
		changeHeader();
	});

	$('.close-product').click(function () {
		var id = $(this).data("id");
		var offsetTop = $('#' + id).offset().top - 110;
		$('html, body').stop().animate({
			scrollTop: offsetTop
		}, 500);
		$('#' + id).removeClass('active');
		$('#' + id + ' .products-wrapper').show();
		$('#' + id + ' .product-detail').hide();
		var imgList = $(this).parent().parent().parent().parent().find('.img-list').filter(':first');
		var firstItem = $(imgList).children('.img-item').filter(':first');

		var srcImg = $(firstItem).find('img').filter(':first').attr('src');
		var img = $(this).parent().parent().parent().parent().find('.img-product').filter(':first').children('img').filter(':first');

		setTimeout(function () {
			$(imgList).children('.img-item').removeClass('active');
			$(firstItem).addClass('active');
			$(img).attr('src', srcImg);
		}, 400);

	});

	$('.show-product').click(function () {
		var id = $(this).data("id");
		var offsetTop = $('#' + id).offset().top - 110;
		$('html, body').stop().animate({
			scrollTop: offsetTop
		}, 500);
		$('#' + id).addClass('active');
		$('#' + id + ' .products-wrapper').hide();
		$('#' + id + ' .product-detail').fadeToggle(500);
	});

	//скрипт показа галереи товара
	$('.img-item img').on('click', function () {
		var thisImg = $(this).attr('src');
		var activeItem = $(this).parent().parent();
		var img = $(activeItem).parent().siblings('.img-product').children('img').filter(':first');
		$(img).attr('src', thisImg);
		$(activeItem).parent().children('.img-item').removeClass('active');
		$(activeItem).addClass('active');
	});

	//E-mail Ajax Send
	$("#contact-form").submit(function () {
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php",
			data: th.serialize()
		}).done(function () {
			$('#notify').fadeIn(300);
			th.trigger("reset");

			setTimeout(function () {
				$('#notify').fadeOut(300);
			}, 8000);
		});

		return false;
	});

	$('#close-notify').on('click', function () {
		$('#notify').fadeOut(300);
	});
});