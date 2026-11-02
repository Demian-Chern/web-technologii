function createDishCard(dish, buttonText) {
	const card = document.createElement('div');
	card.className = 'dish';
	card.dataset.dish = dish.keyword;
	card.dataset.kind = dish.kind;

	card.innerHTML = `
		<img src="${dish.image}" alt="${dish.name}" class="dish__img">
		<p class="dish__price">${dish.price}₽</p>
		<p class="dish__name">${dish.name}</p>
		<p class="dish__weight">${dish.count}</p>
		<button type="button" class="dish__button">${buttonText}</button>
	`;

	return card;
}
