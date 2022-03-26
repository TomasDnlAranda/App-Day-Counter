const form = document.getElementById('form');
const template = document.getElementById('templateEvents').content;
const renderTemplate = document.getElementById('renderTemplate');
const alertEvent = document.querySelector('.container-alert');
const alertDate = document.querySelector('.container-alert-date');

let events = [];

form.addEventListener('submit', (e) => {
	alertEvent.style.display = 'none';
	alertDate.style.display = 'none';

	e.preventDefault();

	const data = new FormData(form);
	const [eventText, date] = [...data.values()];

	if (!eventText.trim()) return alertValidation(alertEvent);

	if (!date.trim()) return alertValidation(alertDate);

	if (dateDiff(date) < 0) return alertValidation(alertDate);

	handleEvent(eventText, date);

	form.reset();
});

const handleEvent = (text, date) => {
	const event = {
		id: (Math.random() * 100).toString(36).slice(3),
		text: text,
		date: date,
	};

	events.push(event);

	renderEvents();
};

const dateDiff = (date) => {
	const targetDate = new Date(date);
	const today = new Date();
	const difference = targetDate.getTime() - today.getTime();
	const days = Math.ceil(difference / (1000 * 3600 * 24));
	return days;
};

const renderEvents = () => {
	localStorage.setItem('events', JSON.stringify(events));
	renderTemplate.textContent = '';
	const fragment = document.createDocumentFragment();

	events.forEach((item) => {
		const { id, text, date } = item;
		const clone = template.cloneNode(true);
		clone.querySelector('.number').textContent = dateDiff(date);
		clone.querySelector('.date').textContent = date;
		clone.querySelector('.event').textContent = text;
		clone.querySelector('.delete').dataset.id = id;
		fragment.appendChild(clone);
	});

	renderTemplate.appendChild(fragment);
};

const alertValidation = (alert) => (alert.style.display = 'block');

document.addEventListener('click', (e) => {
	if (e.target.matches('.delete')) {
		const id = e.target.dataset.id;
		events.forEach((item) => {
			if (item.id === id) {
				events = events.filter((item) => item.id !== id);
				renderEvents();
			}
		});
	}
});

document.addEventListener('DOMContentLoaded', (e) => {
	if (localStorage.getItem('events')) {
		events = JSON.parse(localStorage.getItem('events'));
		renderEvents();
	}
});
