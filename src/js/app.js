const form = document.getElementById('form');
const template = document.getElementById('templateEvents').content;
const renderTemplate = document.getElementById('renderTemplate');

let events = [];

form.addEventListener('submit', (e) => {
	e.preventDefault();

	const data = new FormData(form);
	const [eventText, date] = [...data.values()];

	if (!eventText.trim() || !date.trim()) return;

	if (dateDiff(date) < 0) return;

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
	return days + 1;
};

const renderEvents = () => {
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
