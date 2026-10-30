// выбранные блюда: по одному на категорию
const selectedDishes = { soup: null, main: null, salad: null, drink: null, dessert: null };

function updateOrder() {
	const hasSelection = categories.some(({ key }) => selectedDishes[key]);
	let total = 0;

	document.querySelector('#order-empty').hidden = hasSelection;
	document.querySelector('#order-total').hidden = !hasSelection;

	categories.forEach(({ key, emptyText }) => {
		const dish = selectedDishes[key];
		const item = document.querySelector(`#order-${key}`);
		const input = document.querySelector(`#input-${key}`);

		// пока ничего не выбрано, названия категорий скрыты
		item.hidden = !hasSelection;
		item.querySelector('.order-summary__value').textContent = dish ? `${dish.name} ${dish.price}₽` : emptyText;
		input.value = dish ? dish.keyword : '';

		if (dish) {
			total += dish.price;
		}
	});

	document.querySelector('#order-total-value').textContent = `${total}₽`;
}

function selectDish(keyword) {
	const dish = dishes.find(item => item.keyword === keyword);
	selectedDishes[dish.category] = dish;

	// подсветка выбранной карточки в её категории
	document.querySelectorAll(`.menu__list[data-category="${dish.category}"] .dish`).forEach(card => {
		card.classList.toggle('dish--selected', card.dataset.dish === keyword);
	});

	updateOrder();
}

document.querySelectorAll('.menu__list').forEach(list => {
	list.addEventListener('click', event => {
		const card = event.target.closest('.dish');
		if (card) {
			selectDish(card.dataset.dish);
		}
	});
});

// «Сбросить» очищает и выбранные блюда, а не только поля формы
document.querySelector('.order-form').addEventListener('reset', () => {
	categories.forEach(({ key }) => {
		selectedDishes[key] = null;
	});

	document.querySelectorAll('.dish--selected').forEach(card => card.classList.remove('dish--selected'));

	updateOrder();
});

updateOrder();
