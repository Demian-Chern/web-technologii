// ЛР 9: страница «Заказы»: история заказов, просмотр, редактирование и удаление

const ORDERS_URL = `${API_URL}/labs/api/orders`;

// поля заказа с id блюд и подписи к ним в окнах просмотра и редактирования
const orderDishFields = [
	{ field: 'soup_id', label: 'Суп' },
	{ field: 'main_course_id', label: 'Главное блюдо' },
	{ field: 'salad_id', label: 'Салат или стартер' },
	{ field: 'drink_id', label: 'Напиток' },
	{ field: 'dessert_id', label: 'Десерт' }
];

// поля, которые разрешено менять в окне редактирования
const editableFields = ['full_name', 'email', 'phone', 'delivery_address', 'delivery_type', 'delivery_time', 'comment'];

const ASAP_TEXT = 'Как можно скорее (с 7:00 до 23:00)';

let orders = [];
// заказ, для которого сейчас открыто модальное окно
let currentOrder = null;

const editForm = document.querySelector('#edit-form');

// ЛР 9: общий запрос к API заказов; ошибку сервера превращает в исключение с его текстом
async function requestOrders(path = '', options = {}) {
	const response = await fetch(`${ORDERS_URL}${path}?api_key=${API_KEY}`, options);
	const body = await response.json().catch(() => null);

	if (!response.ok || body?.error) {
		throw new Error(body?.error ?? `Сервер ответил с кодом ${response.status}`);
	}

	return body;
}

function getErrorReason(error) {
	// fetch завершается с TypeError, если ответа от сервера нет
	return error instanceof TypeError ? 'Нет связи с сервером' : error.message;
}

// ---------- Данные заказа для отображения ----------

function getOrderDishes(order) {
	return orderDishFields
		.filter(({ field }) => order[field])
		.map(({ field, label }) => {
			const id = order[field];
			const dish = dishes.find(item => item.id === id);

			return { label, name: dish?.name ?? `Блюдо №${id}`, price: dish?.price ?? 0 };
		});
}

function getOrderCost(order) {
	return getOrderDishes(order).reduce((total, dish) => total + dish.price, 0);
}

function formatDate(value) {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return value ?? '';
	}

	return date.toLocaleString('ru-RU', {
		day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
	});
}

// сервер может вернуть время как «14:30:00», в интерфейсе нужно «14:30»
function formatTime(value) {
	return value ? String(value).slice(0, 5) : '';
}

function getDeliveryText(order) {
	return order.delivery_type === 'by_time' && order.delivery_time
		? formatTime(order.delivery_time)
		: ASAP_TEXT;
}

// ЛР 9: новые заказы сверху (сортировка по убыванию даты оформления)
function sortOrders() {
	orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at) || b.id - a.id);
}

// ---------- Список заказов ----------

function createCell(text, className) {
	const cell = document.createElement('td');
	cell.textContent = text;

	if (className) {
		cell.className = className;
	}

	return cell;
}

function createActionButton(action, icon, title) {
	const button = document.createElement('button');
	button.type = 'button';
	button.className = `orders__action orders__action--${action}`;
	button.dataset.action = action;
	button.title = title;
	button.setAttribute('aria-label', title);
	button.innerHTML = `<i class="bi ${icon}"></i>`;

	return button;
}

// ЛР 9: таблица заказов: №, дата, состав, стоимость, время доставки, кнопки действий
function renderOrders() {
	const message = document.querySelector('#orders-message');
	const table = document.querySelector('#orders-table');

	if (!orders.length) {
		table.hidden = true;
		message.hidden = false;
		message.innerHTML = 'Заказов пока нет. Собрать ланч можно на странице '
			+ '<a href="lunch.html">Собрать ланч</a>.';
		return;
	}

	const rows = orders.map((order, index) => {
		const row = document.createElement('tr');
		row.dataset.id = order.id;

		const actions = document.createElement('td');
		const box = document.createElement('div');
		box.className = 'orders__actions';
		box.append(
			createActionButton('view', 'bi-eye', 'Подробнее'),
			createActionButton('edit', 'bi-pencil-square', 'Редактирование'),
			createActionButton('delete', 'bi-trash', 'Удаление')
		);
		actions.append(box);

		row.append(
			createCell(index + 1),
			createCell(formatDate(order.created_at), 'orders__nowrap'),
			createCell(getOrderDishes(order).map(dish => dish.name).join(', ')),
			createCell(`${getOrderCost(order)}₽`, 'orders__nowrap'),
			createCell(getDeliveryText(order)),
			actions
		);

		return row;
	});

	document.querySelector('#orders-list').replaceChildren(...rows);
	message.hidden = true;
	table.hidden = false;
}

// ЛР 9: GET-запрос всех заказов пользователя
async function loadOrders() {
	try {
		orders = await requestOrders();
		sortOrders();
		renderOrders();
	} catch (error) {
		console.error('Не удалось загрузить заказы:', error);
		document.querySelector('#orders-message').textContent = 'Не удалось загрузить заказы. Обновите страницу.';
		showNotification(`Не удалось загрузить заказы. ${getErrorReason(error)}`);
	}
}

// ---------- Модальные окна ----------

function openModal(modal) {
	modal.hidden = false;
	document.body.classList.add('modal-open');
}

function closeModal(modal) {
	modal.hidden = true;
	currentOrder = null;

	if (!document.querySelector('.modal:not([hidden])')) {
		document.body.classList.remove('modal-open');
	}
}

// состав заказа и стоимость — одинаковые в окнах просмотра и редактирования
function fillOrderDishes(modal, order) {
	const items = getOrderDishes(order).flatMap(({ label, name, price }) => {
		const term = document.createElement('dt');
		term.textContent = label;

		const value = document.createElement('dd');
		value.textContent = `${name} (${price}₽)`;

		return [term, value];
	});

	modal.querySelector('[data-field="dishes"]').replaceChildren(...items);
	modal.querySelector('[data-field="total"]').textContent = `${getOrderCost(order)}₽`;
	modal.querySelector('[data-field="created_at"]').textContent = formatDate(order.created_at);
}

// ЛР 9: окно «Подробнее» с полной информацией о заказе
function openViewModal(order) {
	const modal = document.querySelector('#view-modal');
	const values = {
		full_name: order.full_name,
		delivery_address: order.delivery_address,
		delivery_time: getDeliveryText(order),
		phone: order.phone,
		email: order.email,
		comment: order.comment || 'Без комментария'
	};

	Object.entries(values).forEach(([field, value]) => {
		modal.querySelector(`[data-field="${field}"]`).textContent = value ?? '';
	});

	fillOrderDishes(modal, order);
	openModal(modal);
}

// ЛР 9: окно редактирования: поля формы заполняются значениями заказа
function openEditModal(order) {
	const modal = document.querySelector('#edit-modal');
	const { elements } = editForm;

	editForm.reset();
	elements.full_name.value = order.full_name ?? '';
	elements.email.value = order.email ?? '';
	elements.phone.value = order.phone ?? '';
	elements.delivery_address.value = order.delivery_address ?? '';
	elements.delivery_type.value = order.delivery_type === 'by_time' ? 'by_time' : 'now';
	elements.delivery_time.value = formatTime(order.delivery_time);
	elements.comment.value = order.comment ?? '';

	fillOrderDishes(modal, order);
	openModal(modal);
}

// ЛР 9: окно подтверждения удаления
function openDeleteModal() {
	openModal(document.querySelector('#delete-modal'));
}

// ЛР 9: «крестик», «Ок» и «Отмена» закрывают окно, как и клик по затемнению вокруг него
document.querySelectorAll('.modal').forEach(modal => {
	modal.addEventListener('click', event => {
		if (event.target === modal || event.target.closest('[data-close]')) {
			closeModal(modal);
		}
	});
});

document.addEventListener('keydown', event => {
	// пока открыто уведомление, Escape не должен закрывать окно под ним
	if (event.key === 'Escape' && !document.querySelector('.notification')) {
		document.querySelectorAll('.modal:not([hidden])').forEach(closeModal);
	}
});

document.querySelector('#orders-list').addEventListener('click', event => {
	const button = event.target.closest('[data-action]');
	if (!button) {
		return;
	}

	const id = Number(button.closest('tr').dataset.id);
	currentOrder = orders.find(order => order.id === id);

	const handlers = { view: openViewModal, edit: openEditModal, delete: openDeleteModal };
	handlers[button.dataset.action](currentOrder);
});

// ---------- Редактирование ----------

// ЛР 9: в PUT-запрос попадают только изменившиеся поля
function buildChanges(order) {
	const data = Object.fromEntries(new FormData(editForm));
	const changes = {};

	editableFields.forEach(field => {
		const oldValue = field === 'delivery_time' ? formatTime(order[field]) : (order[field] ?? '');

		if (data[field] !== undefined && data[field] !== oldValue) {
			changes[field] = data[field];
		}
	});

	if (data.delivery_type === 'now') {
		delete changes.delivery_time;
	} else if (changes.delivery_type) {
		// при переходе на доставку ко времени время нужно передать, даже если оно не менялось
		changes.delivery_time = data.delivery_time;
	}

	return changes;
}

editForm.addEventListener('submit', async event => {
	event.preventDefault();

	const order = currentOrder;
	const { elements } = editForm;

	if (elements.delivery_type.value === 'by_time' && !elements.delivery_time.value) {
		showNotification('Укажите время доставки');
		return;
	}

	const changes = buildChanges(order);
	const modal = document.querySelector('#edit-modal');

	if (!Object.keys(changes).length) {
		closeModal(modal);
		showNotification('Изменений нет');
		return;
	}

	// сервер может отвечать долго: блокируем кнопку, чтобы запрос не ушёл дважды
	const submitButton = editForm.querySelector('[type="submit"]');
	submitButton.disabled = true;

	try {
		const updated = await requestOrders(`/${order.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(changes)
		});

		// ЛР 9: обновляем заказ в списке данными из ответа сервера
		const index = orders.findIndex(item => item.id === order.id);
		orders[index] = { ...order, ...changes, ...updated };
		if (changes.delivery_type === 'now' && !updated?.delivery_time) {
			orders[index].delivery_time = null;
		}

		sortOrders();
		renderOrders();
		closeModal(modal);
		showNotification('Заказ успешно изменён');
	} catch (error) {
		console.error('Не удалось изменить заказ:', error);
		showNotification(`Не удалось изменить заказ. ${getErrorReason(error)}`);
	} finally {
		submitButton.disabled = false;
	}
});

// ---------- Удаление ----------

document.querySelector('#delete-confirm').addEventListener('click', async event => {
	const button = event.currentTarget;
	const order = currentOrder;
	button.disabled = true;

	try {
		// ЛР 9: DELETE-запрос; при успехе заказ убирается из списка
		await requestOrders(`/${order.id}`, { method: 'DELETE' });

		orders = orders.filter(item => item.id !== order.id);
		renderOrders();
		closeModal(document.querySelector('#delete-modal'));
		showNotification('Заказ успешно удалён');
	} catch (error) {
		console.error('Не удалось удалить заказ:', error);
		showNotification(`Не удалось удалить заказ. ${getErrorReason(error)}`);
	} finally {
		button.disabled = false;
	}
});

// ЛР 9: блюда нужны для названий и цен, поэтому сначала загружаем их, затем заказы
document.addEventListener('DOMContentLoaded', async () => {
	await loadDishes();
	await loadOrders();
});
