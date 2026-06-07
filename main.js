// Booking state
const state = {
  service: null,
  price: null,
  barber: null,
  date: null,
  time: null,
  name: null
};

// Switch between steps
function showStep(n) {
  document.querySelectorAll('.booking-step').forEach(function (el) {
    el.classList.add('hidden');
  });
  document.querySelectorAll('.step-indicator').forEach(function (el) {
    el.classList.remove('active', 'done');
  });

  document.getElementById('booking-step-' + n).classList.remove('hidden');

  for (var i = 1; i < n; i++) {
    document.getElementById('step-ind-' + i).classList.add('done');
  }
  document.getElementById('step-ind-' + n).classList.add('active');
}

// Check if we can enable the confirm button
function checkStep2Ready() {
  var ok = state.barber && state.date && state.time
    && state.name && state.name.trim().length > 1;
  document.getElementById('step2-next').disabled = !ok;
}

// Fill in the confirmation summary
function fillConfirmation() {
  var el = document.getElementById('confirm-details');
  var d = new Date(state.date + 'T12:00:00');
  var dateStr = d.toLocaleDateString('fr-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  el.innerHTML = [
    confirmRow('Client', state.name),
    confirmRow('Service', state.service),
    confirmRow('Barbier', state.barber),
    confirmRow('Date', dateStr),
    confirmRow('Heure', state.time),
    confirmRow('Prix', state.price + ' $')
  ].join('');
}

function confirmRow(label, value) {
  return '<div class="confirm-row">'
    + '<span class="conf-label">' + label + '</span>'
    + '<span class="conf-val">' + escapeHtml(value) + '</span>'
    + '</div>';
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Reset everything back to step 1
function resetForm() {
  state.service = null;
  state.price = null;
  state.barber = null;
  state.time = null;
  state.name = null;

  document.querySelectorAll('.svc-btn').forEach(function (b) { b.classList.remove('selected'); });
  document.querySelectorAll('.barber-option').forEach(function (b) { b.classList.remove('selected'); });
  document.querySelectorAll('.time-btn').forEach(function (b) { b.classList.remove('selected'); });
  document.getElementById('booking-name').value = '';
  document.getElementById('step1-next').disabled = true;
  document.getElementById('step2-next').disabled = true;

  var today = new Date();
  var todayStr = today.getFullYear() + '-'
    + String(today.getMonth() + 1).padStart(2, '0') + '-'
    + String(today.getDate()).padStart(2, '0');
  document.getElementById('booking-date').value = todayStr;
  state.date = todayStr;

  showStep(1);
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Set today as the default/min date
const dateInput = document.getElementById('booking-date');
const today = new Date();
const todayStr = today.getFullYear() + '-'
  + String(today.getMonth() + 1).padStart(2, '0') + '-'
  + String(today.getDate()).padStart(2, '0');
dateInput.min = todayStr;
dateInput.value = todayStr;
state.date = todayStr;

// Step 1 — service selection
document.querySelectorAll('.svc-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.svc-btn').forEach(function (b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
    state.service = btn.dataset.svc;
    state.price = btn.dataset.price;
    document.getElementById('step1-next').disabled = false;
  });
});

document.getElementById('step1-next').addEventListener('click', function () {
  showStep(2);
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Step 2 — barber, date, time, name
document.querySelectorAll('.barber-option').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.barber-option').forEach(function (b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
    state.barber = btn.dataset.barber;
    checkStep2Ready();
  });
});

document.querySelectorAll('.time-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.time-btn').forEach(function (b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
    state.time = btn.dataset.time;
    checkStep2Ready();
  });
});

dateInput.addEventListener('change', function () {
  state.date = this.value;
  checkStep2Ready();
});

document.getElementById('booking-name').addEventListener('input', function () {
  state.name = this.value;
  checkStep2Ready();
});

document.getElementById('step2-back').addEventListener('click', function () {
  showStep(1);
});

document.getElementById('step2-next').addEventListener('click', function () {
  fillConfirmation();
  showStep(3);
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Step 3 — reset
document.getElementById('confirm-reset').addEventListener('click', function () {
  resetForm();
});

// Clicking "Réserver" on a service card pre-selects that service in the form
document.querySelectorAll('.service-link').forEach(function (link) {
  link.addEventListener('click', function () {
    var card = link.closest('[data-service]');
    if (!card) return;
    document.querySelectorAll('.svc-btn').forEach(function (btn) {
      if (btn.dataset.svc === card.dataset.service) btn.click();
    });
  });
});
