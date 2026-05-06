function showToast(msg, duration = 2600) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast-msg';
  el.textContent = msg;
  container.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 250);
  }, duration);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => { if (e.target === el) el.classList.remove('open'); });
});

function setActive(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  const page = el.dataset.page;
  if (page && page !== 'Lab Requests') showToast(`Navigating to ${page}…`);
}

function markAllRead() {
  document.getElementById('notifBadge').style.display = 'none';
  closeModal('notif-modal');
  showToast('✓ All notifications cleared.');
}

document.getElementById('cancelSignout').addEventListener('click', () => closeModal('signout-modal'));
document.getElementById('confirmSignout').addEventListener('click', () => {
  closeModal('signout-modal');
  showToast('Signing out…');
  setTimeout(() => showToast('You have been signed out.'), 1400);
});

document.getElementById('headerSearch').addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && this.value.trim()) {
    showToast(`Searching for "${this.value.trim()}"…`);
  }
});

document.getElementById('doneBtn').addEventListener('click', function () {
  const btn = this;
  btn.disabled = true;
  btn.textContent = '✓ OK!';
  btn.style.background = '#5ea882';

  setTimeout(() => {
    btn.textContent = 'Done';
    btn.style.background = '';
    btn.disabled = false;
  }, 1800);
});