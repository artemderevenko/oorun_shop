$(document).ready(function () {

	changeHeader()

	$(window).scroll(function () {
		changeHeader()
	});

	function changeHeader() {
		if ($(window).scrollTop() > 30) {
			$('.header').addClass('scroll')
			$('.header-info, .header-menu, .logo').addClass('scroll')
			if (!$('.logo-mini').hasClass('visible')) {
				$('.logo-mini').show(600)
			}
		}

		if ($(window).scrollTop() < 30) {
			$('.header').removeClass('scroll')
			$('.header-info, .header-menu, .logo').removeClass('scroll')
			if (!$('.logo-mini').hasClass('visible')) {
				$('.logo-mini').hide(600)
			}
		}
	}

	$('.toogle').on('click', function () {
		$(".header-menu").toggleClass("active")
		$(this).toggleClass('click')
		return false
	});

	$('.img-item').on('click', function () {
		const img = $(this).find('img')
		const newSrc = img.attr('data-src')
		$('#main-image').attr('src', newSrc)
		$('.img-item').removeClass('active')
		$(this).addClass('active')
	});

	$('#card-table').on('click', '.card-row .delete', function () {
		const id = $(this).attr('data-id')
		const cardEmptyBlock = document.getElementById('card-empty')
		const cardTableBlock = document.getElementById('card-table')
		const cardCountBlock = document.getElementById('card-count')

		fetch('card/remove/' + id, {
			method: 'delete'
		}).then(res => res.json())
			.then(card => {
				if (card && card.products && card.products.length) {
					const cardTableHtml = `
						<div class="card-header">
							<div class="name">Назва товару</div>
							<div class="count">Кількість</div>
							<div class="price">Ціна</div>
							<div class="options"></div>
						</div>

						${card.products.map(product => {
							return `
							<div class="card-row">
								<div class="name">${ product.title }</div>
								<div class="count">${ product.count }</div>
								<div class="price">${ product.price } UAH</div>
								<div class="options">
									<button type="submit" class="delete" data-id="${ product.id }">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
											<path
												d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" />
										</svg>
									</button>
								</div>
							</div>`
						}).join('')}

						<div class="total-info-wrapper">
							<div class="total-info">
								<div class="count-total total-info-row">
									<div class="label">Кількість товарів:</div>
									<div class="value">${ card.countTotal }</div>
								</div>
								<div class="sum-total total-info-row">
									<div class="label">Вартість замовлення:</div>
									<div class="value">${ card.priceTotal } UAH</div>
								</div>
								<div class="buttons-wrapper order">
									<button type="submit" class="button buy">
										<div class="transition button-content">
											Оформити замовлення
										</div>
									</button>
								</div>
							</div>
						</div>
					`
					cardTableBlock.innerHTML = cardTableHtml
					cardEmptyBlock.classList.add('hide')
					cardTableBlock.classList.remove('hide')
					cardCountBlock.innerHTML = `(${ card.countTotal })`
				} else {
					cardEmptyBlock.classList.remove('hide')
					cardTableBlock.classList.add('hide')
					cardCountBlock.innerHTML = `(0)`
				}
			})
	});

	$('#close-notify').on('click', function () {
		$('#notify').fadeOut(300)
	});
});