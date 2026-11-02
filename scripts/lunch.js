// Страница «Собрать ланч»: меню и панель перехода к оформлению заказа

function displayDishes() {
	// сортировка по названию в алфавитном порядке перед отображением
	const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name, 'ru'));

	categories.forEach(({ key }) => {
		const list = document.querySelector(`.menu__list[data-category="${key}"]`);

		sortedDishes
			.filter(dish => dish.category === key)
			.forEach(dish => list.append(createDishCard(dish, 'Добавить')));
	});
}

function updateLunchPage() {
	// подсветка выбранных карточек
	categories.forEach(({ key }) => {
		document.querySelectorAll(`.menu__list[data-category="${key}"] .dish`).forEach(card => {
			card.classList.toggle('dish--selected', card.dataset.dish === selectedDishes[key]?.keyword);
		});
	});

	const link = document.querySelector('#order-panel-link');

	document.querySelector('#order-panel').hidden = !categories.some(({ key }) => selectedDishes[key]);
	document.querySelector('#order-panel-total').textContent = `${getOrderTotal()}₽`;

	// ссылка без href недоступна: по ней нельзя перейти ни мышью, ни с клавиатуры
	if (getOrderError()) {
		link.removeAttribute('href');
	} else {
		link.href = 'order.html';
	}
}

function selectDish(keyword) {
	const dish = dishes.find(item => item.keyword === keyword);

	selectedDishes[dish.category] = dish;
	saveOrder();
	updateLunchPage();
}

document.querySelectorAll('.menu__list').forEach(list => {
	list.addEventListener('click', event => {
		const card = event.target.closest('.dish');
		if (card) {
			selectDish(card.dataset.dish);
		}
	});
});

document.addEventListener('DOMContentLoaded', async () => {
	if (await loadDishes()) {
		displayDishes();
		restoreOrder();
		updateLunchPage();
	}
});

// кнопка «Назад» может вернуть страницу из кэша браузера: заказ мог измениться на другой странице
window.addEventListener('pageshow', event => {
	if (event.persisted && dishes.length) {
		restoreOrder();
		updateLunchPage();
	}
});
