// ── MODALS ──
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', e => {
    if (e.target === el) el.classList.remove('open');
  });
});


// ── SIDEBAR NAVIGATION ──
function setActive(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}


// ── TOASTS ──
function showToast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3100);
}


// ── NOTIFICATIONS ──
function markAllRead() {
  document.getElementById('notifBadge').style.display = 'none';
  closeModal('notif-modal');
  showToast('All notifications cleared.', 'success');
}


// ── DROPDOWNS ──
function toggleDropdown(id) {
  const dd = document.getElementById(id);
  document.querySelectorAll('.dropdown-menu-custom').forEach(d => {
    if (d.id !== id) d.classList.remove('open');
  });
  dd.classList.toggle('open');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown-wrap')) {
    document.querySelectorAll('.dropdown-menu-custom').forEach(d => d.classList.remove('open'));
  }
});

function selectPriority(btn, val) {
  document.querySelectorAll('#ddPriority button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('btnPriority').innerHTML = val + ' <i class="bi bi-chevron-down"></i>';
  document.getElementById('ddPriority').classList.remove('open');
  showToast('Priority filter: ' + val, 'info');
}

function selectDate(btn, val) {
  document.querySelectorAll('#ddDate button').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('btnDate').innerHTML = val + ' <i class="bi bi-chevron-down"></i>';
  document.getElementById('ddDate').classList.remove('open');
  showToast('Date filter: ' + val, 'info');
}


// ── EXPORT CSV ──
function exportCSV() {
  const rows = document.querySelectorAll('#mainTable tbody tr');
  let csv = 'Req ID,Submitted,Patient,Chart No,Priority,Status,TAT\n';
  rows.forEach(row => {
    const cells   = row.cells;
    const reqId   = cells[0].textContent.trim();
    const submitted = cells[1].textContent.trim();
    const patient = cells[2].querySelector('.patient-main').textContent.trim();
    const chartNo = cells[2].querySelector('.patient-sub').textContent.trim();
    const priority = cells[3].textContent.trim();
    const status  = cells[4].textContent.trim();
    const tat     = cells[5].textContent.trim();
    csv += `"${reqId}","${submitted}","${patient}","${chartNo}","${priority}","${status}","${tat}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'test-catalogue.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully', 'success');
}


// ── PRINT BATCH ──
function printBatch() {
  showToast('Sending to printer…', 'info');
  setTimeout(() => window.print(), 400);
}


// ── TABLE ROW ACTIONS ──
function getPatient(btn) {
  return btn.closest('tr').querySelector('.patient-main').textContent.trim();
}

function handleStart(btn) {
  const row = btn.closest('tr');
  row.cells[5].innerHTML = '<span class="tat-processing">Processing</span>';
  row.querySelector('.actions-wrap').innerHTML = `
    <button class="act-complete" onclick="handleComplete(this)">Complete</button>
    <button class="act-view" onclick="handleView(this)">View</button>
  `;
  showToast('Started: ' + getPatient(btn), 'success');
}

function handleComplete(btn) {
  const row = btn.closest('tr');
  row.cells[5].innerHTML = '<span class="tat-completed">Completed</span>';
  row.querySelector('.actions-wrap').innerHTML = `
    <button class="act-pdf" onclick="handlePdf(this)">PDF <i class="bi bi-download"></i></button>
  `;
  showToast('Completed: ' + getPatient(btn), 'success');
}

function handleView(btn) {
  showToast('Viewing record: ' + getPatient(btn), 'info');
}

function handlePdf(btn) {
  showToast('Downloading PDF for: ' + getPatient(btn), 'info');
}


// ── PAGINATION ──
const numPages = 3;
let currentPage = 1;

function changePage(btn, direction) {
  const pgBtns = document.querySelectorAll('.pg-btn');
  const numbered = Array.from(pgBtns).filter(b => !isNaN(parseInt(b.textContent)));

  if (direction !== undefined) {
    const next = currentPage + direction;
    if (next < 1 || next > numPages) return;
    currentPage = next;
  } else {
    currentPage = parseInt(btn.textContent);
  }

  numbered.forEach(b => b.classList.toggle('active', parseInt(b.textContent) === currentPage));
  document.getElementById('pageLabel').textContent = 'Showing ' + currentPage + ' of 12 tests';
  showToast('Page ' + currentPage, 'info');
}