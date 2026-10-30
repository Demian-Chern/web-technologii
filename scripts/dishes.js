// Категории: порядок вывода на странице и сообщение для пустой категории
const categories = [
	{ key: 'soup', emptyText: 'Блюдо не выбрано' },
	{ key: 'main', emptyText: 'Блюдо не выбрано' },
	{ key: 'salad', emptyText: 'Блюдо не выбрано' },
	{ key: 'drink', emptyText: 'Напиток не выбран' },
	{ key: 'dessert', emptyText: 'Десерт не выбран' }
];

// kind: fish / meat / veg (суп, главное, салат), cold / hot (напитки), small / medium / large (десерты)
const dishes = [
	// Супы: 2 рыбных, 2 мясных, 2 вегетарианских
	{ keyword: 'tom_yam', name: 'Том Ям с креветками', price: 365, category: 'soup', count: '350 мл', image: 'soup-2', kind: 'fish' },
	{ keyword: 'norwegian_soup', name: 'Норвежский суп с лососем и сливками', price: 270, category: 'soup', count: '350 мл', image: 'soup-3', kind: 'fish' },
	{ keyword: 'chicken_noodle', name: 'Куриный суп с лапшой', price: 180, category: 'soup', count: '330 мл', image: 'chicken', kind: 'meat' },
	{ keyword: 'ramen', name: 'Рамен с мясом и яйцом', price: 320, category: 'soup', count: '400 мл', image: 'ramen', kind: 'meat' },
	{ keyword: 'cheese_cream_soup', name: 'Крем-суп с сырными шариками', price: 190, category: 'soup', count: '300 мл', image: 'soup-1', kind: 'veg' },
	{ keyword: 'gazpacho', name: 'Гаспачо', price: 195, category: 'soup', count: '300 мл', image: 'gazpacho', kind: 'veg' },

	// Главные блюда: 2 рыбных, 2 мясных, 2 вегетарианских
	{ keyword: 'salmon_glaze', name: 'Лосось в пряной глазури', price: 420, category: 'main', count: '200 г', image: 'main-3', kind: 'fish' },
	{ keyword: 'shrimp_pasta', name: 'Паста с креветками', price: 390, category: 'main', count: '280 г', image: 'shrimppasta', kind: 'fish' },
	{ keyword: 'chicken_katsu', name: 'Куриное катсу с рисом и соусом карри', price: 340, category: 'main', count: '320 г', image: 'main-1', kind: 'meat' },
	{ keyword: 'spicy_wings', name: 'Острые куриные крылья', price: 290, category: 'main', count: '250 г', image: 'main-2', kind: 'meat' },
	{ keyword: 'potatoes_mushrooms', name: 'Жареная картошка с грибами', price: 150, category: 'main', count: '300 г', image: 'friedpotatoeswithmushrooms1', kind: 'veg' },
	{ keyword: 'veg_lasagna', name: 'Овощная лазанья', price: 385, category: 'main', count: '320 г', image: 'lasagna', kind: 'veg' },

	// Салаты и стартеры: 1 рыбный, 1 мясной, 4 вегетарианских
	{ keyword: 'tuna_salad', name: 'Салат с тунцом', price: 360, category: 'salad', count: '220 г', image: 'tunasalad', kind: 'fish' },
	{ keyword: 'caesar_chicken', name: 'Цезарь с курицей', price: 320, category: 'salad', count: '250 г', image: 'caesar', kind: 'meat' },
	{ keyword: 'caprese', name: 'Капрезе с моцареллой', price: 270, category: 'salad', count: '200 г', image: 'caprese', kind: 'veg' },
	{ keyword: 'egg_salad', name: 'Овощной салат с яйцом', price: 230, category: 'salad', count: '240 г', image: 'saladwithegg', kind: 'veg' },
	{ keyword: 'fries_sauce', name: 'Картофель фри с сырным соусом', price: 180, category: 'salad', count: '150 г', image: 'frenchfries1', kind: 'veg' },
	{ keyword: 'fries_ketchup', name: 'Картофель фри с кетчупом', price: 160, category: 'salad', count: '150 г', image: 'frenchfries2', kind: 'veg' },

	// Напитки: 3 холодных, 3 горячих
	{ keyword: 'berry_lemonade', name: 'Лимонад с ягодами и лаймом', price: 130, category: 'drink', count: '300 мл', image: 'drink-1', kind: 'cold' },
	{ keyword: 'orange_soda', name: 'Апельсиновая газировка', price: 100, category: 'drink', count: '330 мл', image: 'drink-2', kind: 'cold' },
	{ keyword: 'citrus_lemonade', name: 'Цитрусовый лимонад', price: 110, category: 'drink', count: '330 мл', image: 'drink-3', kind: 'cold' },
	{ keyword: 'cappuccino', name: 'Капучино', price: 140, category: 'drink', count: '250 мл', image: 'cappuccino', kind: 'hot' },
	{ keyword: 'black_tea', name: 'Чёрный чай', price: 90, category: 'drink', count: '300 мл', image: 'tea', kind: 'hot' },
	{ keyword: 'green_tea', name: 'Зелёный чай', price: 90, category: 'drink', count: '300 мл', image: 'greentea', kind: 'hot' },

	// Десерты: 3 маленьких, 2 средних, 1 большая порция
	{ keyword: 'baklava', name: 'Пахлава', price: 150, category: 'dessert', count: '100 г', image: 'baklava', kind: 'small' },
	{ keyword: 'cheesecake', name: 'Чизкейк', price: 210, category: 'dessert', count: '120 г', image: 'checheesecake', kind: 'small' },
	{ keyword: 'choco_cheesecake', name: 'Шоколадный чизкейк', price: 230, category: 'dessert', count: '130 г', image: 'chocolatecheesecake', kind: 'small' },
	{ keyword: 'chocolate_cake', name: 'Шоколадный торт', price: 260, category: 'dessert', count: '200 г', image: 'chocolatecake', kind: 'medium' },
	{ keyword: 'donuts_3', name: 'Пончики с глазурью (3 шт.)', price: 180, category: 'dessert', count: '210 г', image: 'donuts2', kind: 'medium' },
	{ keyword: 'donuts_6', name: 'Пончики ассорти (6 шт.)', price: 350, category: 'dessert', count: '420 г', image: 'donuts', kind: 'large' }
];
