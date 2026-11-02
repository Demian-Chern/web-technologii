// Страница «Оформить заказ»: состав заказа и отправка формы

const orderForm = document.querySelector('.order-form');

function updateOrderPage() {
	const selected = categories.filter(({ key }) => selectedDishes[key]);

	document.querySelector('#order-empty').hidden = selected.length > 0;
	document.querySelector('#order-dishes').replaceChildren(
		...selected.map(({ key }) => createDishCard(selectedDishes[key], 'Удалить'))
	);

	categories.forEach(({ key, emptyText }) => {
		const dish = selectedDishes[key];
		const item = document.querySelector(`#order-${key}`);

		item.querySelector('.order-summary__name').textContent = dish ? dish.name : emptyText;
		item.querySelector('.order-summary__price').textContent = dish ? `${dish.price}₽` : '';
	});

	document.querySelector('#order-total-value').textContent = `${getOrderTotal()}₽`;
}

function buildOrderData() {
	const data = Object.fromEntries(new FormData(orderForm));

	data.subscribe = orderForm.elements.subscribe.checked ? 1 : 0;

	if (data.delivery_type === 'now') {
		delete data.delivery_time;
	}

	categories.forEach(({ key, apiField }) => {
		if (selectedDishes[key]) {
			data[apiField] = selectedDishes[key].id;
		}
	});

	return data;
}

async function sendOrder(data) {
	const response = await fetch(`${API_URL}/labs/api/orders?api_key=${API_KEY}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});

	if (!response.ok) {
		const body = await response.json().catch(() => null);
		throw new Error(body?.error ?? `Сервер ответил с кодом ${response.status}`);
	}
}

document.querySelector('#order-dishes').addEventListener('click', event => {
	const button = event.target.closest('.dish__button');
	if (!button) {
		return;
	}

	const dish = dishes.find(item => item.keyword === button.closest('.dish').dataset.dish);

	selectedDishes[dish.category] = null;
	saveOrder();
	updateOrderPage();
});

orderForm.addEventListener('submit', async event => {
	event.preventDefault();

	const error = getOrderError();
	if (error) {
		showNotification(error);
		return;
	}

	const data = buildOrderData();
	if (data.delivery_type === 'by_time' && !data.delivery_time) {
		showNotification('Укажите время доставки');
		return;
	}

	// сервер может отвечать долго: блокируем кнопку, чтобы заказ не отправили дважды
	const submitButton = orderForm.querySelector('[type="submit"]');
	submitButton.disabled = true;

	try {
		await sendOrder(data);

		clearOrder();
		updateOrderPage();
		orderForm.reset();
		showNotification('Заказ успешно оформлен');
	} catch (sendError) {
		console.error('Не удалось оформить заказ:', sendError);

		// fetch завершается с TypeError, если ответа от сервера нет
		const reason = sendError instanceof TypeError ? 'Нет связи с сервером' : sendError.message;
		showNotification(`Не удалось оформить заказ. ${reason}`);
	} finally {
		submitButton.disabled = false;
	}
});

document.addEventListener('DOMContentLoaded', async () => {
	if (await loadDishes()) {
		restoreOrder();
		updateOrderPage();
	}
});

// кнопка «Назад» может вернуть страницу из кэша браузера: заказ мог измениться на другой странице
window.addEventListener('pageshow', event => {
	if (event.persisted && dishes.length) {
		restoreOrder();
		updateOrderPage();
	}
});
