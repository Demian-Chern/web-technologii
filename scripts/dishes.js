const API_URL = 'https://web-basics-api-gagashaggy.msk1.amvera.tech';
const API_KEY = '866a9480-db18-3e3e-86bd-9712e78b466c';

// Категории: порядок вывода на странице и сообщение для пустой категории
const categories = [
	{ key: 'soup', emptyText: 'Блюдо не выбрано' },
	{ key: 'main', emptyText: 'Блюдо не выбрано' },
	{ key: 'salad', emptyText: 'Блюдо не выбрано' },
	{ key: 'drink', emptyText: 'Напиток не выбран' },
	{ key: 'dessert', emptyText: 'Десерт не выбран' }
];

// API называет главные блюда 'main-course', а на странице категория называется 'main'
const apiCategories = { 'main-course': 'main' };

// На сервере есть не все изображения, поэтому карточки используют локальные файлы
const localImages = {
	gazpacho: 'gazpacho',
	mushroom_soup: 'mushroom_soup',
	norwegian_soup: 'norwegian_soup',
	ramen: 'ramen',
	tom_yum: 'tomyum',
	chicken_soup: 'chicken',

	fried_potatoes_with_mushrooms: 'friedpotatoeswithmushrooms1',
	lasagna: 'lasagna',
	chicken_cutlets_with_puree: 'chickencutletsandmashedpotatoes',
	fish_cutlet_with_rice: 'fishrice',
	margherita_pizza: 'pizza',
	shrimp_pasta: 'shrimppasta',

	korean_salad: 'saladwithegg',
	caesar_chicken: 'caesar',
	caprese: 'caprese',
	tuna_salad: 'tunasalad',
	fries_caesar: 'frenchfries1',
	fries_ketchup: 'frenchfries2',

	orange_juice: 'orangejuice',
	apple_juice: 'applejuice',
	carrot_juice: 'carrotjuice',
	cappuccino: 'cappuccino',
	green_tea: 'greentea',
	black_tea: 'tea',

	baklava: 'baklava',
	cheesecake: 'checheesecake',
	chocolate_cheesecake: 'chocolatecheesecake',
	chocolate_cake: 'chocolatecake',
	donuts3: 'donuts2',
	donuts6: 'donuts'
};

// kind: fish / meat / veg (суп, главное, салат), cold / hot (напитки), small / medium / large (десерты)
let dishes = [];

function getDishImage(dish) {
	const localImage = localImages[dish.keyword];

	return localImage
		? `images/${localImage}.jpg`
		: `${API_URL}/labs/api/${dish.image}?api_key=${API_KEY}`;
}

async function loadDishes() {
	try {
		const response = await fetch(`${API_URL}/labs/api/dishes/default?api_key=${API_KEY}`);

		if (!response.ok) {
			throw new Error(`Сервер ответил с кодом ${response.status}`);
		}

		const data = await response.json();

		dishes = data.map(dish => ({
			...dish,
			category: apiCategories[dish.category] ?? dish.category,
			image: getDishImage(dish)
		}));

		displayDishes();
	} catch (error) {
		console.error('Не удалось загрузить блюда:', error);
		showNotification('Не удалось загрузить блюда. Обновите страницу');
	}
}
