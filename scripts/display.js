function createDishCard(dish) {
	const card = document.createElement('div');
	card.className = 'dish';
	card.dataset.dish = dish.keyword;
	card.dataset.kind = dish.kind;

	card.innerHTML = `
		<img src="${dish.image}" alt="${dish.name}" class="dish__img">
		<p class="dish__price">${dish.price}₽</p>
		<p class="dish__name">${dish.name}</p>
		<p class="dish__weight">${dish.count}</p>
		<button type="button" class="dish__button">Добавить</button>
	`;

	return card;
}

function displayDishes() {
	// сортировка по названию в алфавитном порядке перед отображением
	const sortedDishes = [...dishes].sort((a, b) => a.name.localeCompare(b.name, 'ru'));

	categories.forEach(({ key }) => {
		const list = document.querySelector(`.menu__list[data-category="${key}"]`);

		sortedDishes
			.filter(dish => dish.category === key)
			.forEach(dish => list.append(createDishCard(dish)));
	});
}

// запускаем после подключения всех скриптов: при ошибке нужен showNotification из validation.js
document.addEventListener('DOMContentLoaded', loadDishes);
