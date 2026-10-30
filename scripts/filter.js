// фильтры блюд: клик по кнопке показывает только блюда с нужным kind,
// повторный клик по активной кнопке снимает фильтр.
// Блюда только скрываются (hidden), поэтому выбор в форме заказа не сбрасывается.
document.querySelectorAll('.menu__filters').forEach(box => {
	box.addEventListener('click', event => {
		const button = event.target.closest('.filter__button');
		if (!button) {
			return;
		}

		const wasActive = button.classList.contains('active');
		box.querySelectorAll('.filter__button').forEach(btn => btn.classList.remove('active'));

		if (!wasActive) {
			button.classList.add('active');
		}

		const kind = wasActive ? null : button.dataset.kind;
		const category = box.dataset.category;

		document.querySelectorAll(`.menu__list[data-category="${category}"] .dish`).forEach(card => {
			card.hidden = kind !== null && card.dataset.kind !== kind;
		});
	});
});
