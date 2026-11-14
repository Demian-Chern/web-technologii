// ЛР 10: форма обратной связи на лендинге.
// Проверка полей — встроенная валидация браузера со стилями Bootstrap (.was-validated),
// после успешной отправки форма очищается и показывается toast.

const feedbackForm = document.querySelector('#feedback-form');
const feedbackToast = bootstrap.Toast.getOrCreateInstance(document.querySelector('#feedback-toast'));

feedbackForm.addEventListener('submit', event => {
	event.preventDefault();

	if (!feedbackForm.checkValidity()) {
		feedbackForm.classList.add('was-validated');
		return;
	}

	feedbackForm.reset();
	feedbackForm.classList.remove('was-validated');
	feedbackToast.show();
});

// ЛР 10: на мобильных меню закрывается после перехода по пункту
document.querySelectorAll('#landing-nav .nav-link').forEach(link => {
	link.addEventListener('click', () => {
		bootstrap.Collapse.getInstance(document.querySelector('#landing-nav'))?.hide();
	});
});
