// проверка состава ланча при отправке формы.
// Допустимые комбо (десерт можно добавить к любому):
// суп + главное + салат + напиток, суп + главное + напиток,
// суп + салат + напиток, главное + салат + напиток, главное + напиток.
// Если выбор не подходит ни под одно комбо, возвращает текст уведомления, иначе null.
function getOrderError() {
	const { soup, main, salad, drink, dessert } = selectedDishes;

	if (!soup && !main && !salad && !drink && !dessert) {
		return 'Ничего не выбрано. Выберите блюда для заказа';
	}

	// без учёта напитка комбо собрано, если есть главное блюдо или суп с салатом
	if (main || (soup && salad)) {
		return drink ? null : 'Выберите напиток';
	}

	if (soup) {
		return 'Выберите главное блюдо/салат/стартер';
	}

	if (salad) {
		return 'Выберите суп или главное блюдо';
	}

	// выбраны только напиток и/или десерт
	return 'Выберите главное блюдо';
}

function closeNotification() {
	document.querySelector('.notification-overlay')?.remove();
	document.querySelector('.notification')?.remove();
}

// уведомление создаётся заново при каждой неудачной попытке отправки
function showNotification(text) {
	closeNotification();

	const overlay = document.createElement('div');
	overlay.className = 'notification-overlay';

	const notification = document.createElement('div');
	notification.className = 'notification';

	const message = document.createElement('p');
	message.className = 'notification__text';
	message.textContent = text;

	const button = document.createElement('button');
	button.type = 'button';
	button.className = 'notification__button';
	button.textContent = 'Окей \u{1F44C}';
	button.addEventListener('click', closeNotification);

	notification.append(message, button);
	document.body.append(overlay, notification);
}
