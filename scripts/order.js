// ЛР 8: сохранение заказа в localStorage
// Текущий заказ, общий для страниц «Собрать ланч» и «Оформить заказ».
// В localStorage лежат только идентификаторы: { "soup": 4, "main": 8, "drink": 24 }

const ORDER_STORAGE_KEY = 'food-construct-order';

// выбранные блюда: по одному на категорию
const selectedDishes = { soup: null, main: null, salad: null, drink: null, dessert: null };

function readStoredIds() {
	try {
		return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY)) ?? {};
	} catch {
		return {};
	}
}

// вызывается после loadDishes: по идентификаторам находит данные блюд
function restoreOrder() {
	const ids = readStoredIds();

	categories.forEach(({ key }) => {
		selectedDishes[key] = dishes.find(dish => dish.id === ids[key] && dish.category === key) ?? null;
	});
}

function saveOrder() {
	const ids = {};

	categories.forEach(({ key }) => {
		if (selectedDishes[key]) {
			ids[key] = selectedDishes[key].id;
		}
	});

	localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(ids));
}

function clearOrder() {
	categories.forEach(({ key }) => {
		selectedDishes[key] = null;
	});

	localStorage.removeItem(ORDER_STORAGE_KEY);
}

function getOrderTotal() {
	return categories.reduce((total, { key }) => total + (selectedDishes[key]?.price ?? 0), 0);
}
