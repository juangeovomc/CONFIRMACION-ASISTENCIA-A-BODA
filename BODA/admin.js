document.addEventListener('DOMContentLoaded', () => {
  const invitations =
    typeof INVITATIONS !== 'undefined' && Array.isArray(INVITATIONS)
      ? INVITATIONS
      : [];

  const firebaseConfig = {
    apiKey: 'AIzaSyCOrfpTw7ubA0AA7Q-LPy_Z7JWc21m42sU',
    authDomain: 'boda-sebas-marce.firebaseapp.com',
    projectId: 'boda-sebas-marce',
    storageBucket: 'boda-sebas-marce.firebasestorage.app',
    messagingSenderId: '1006656737070',
    appId: '1:1006656737070:web:614edc3f8e4daed39634bf',
  };

  const authView = document.getElementById('authView');
  const adminView = document.getElementById('adminView');
  const adminEmail = document.getElementById('adminEmail');
  const adminPassword = document.getElementById('adminPassword');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const authMsg = document.getElementById('authMsg');
  const adminMsg = document.getElementById('adminMsg');
  const tableBody = document.getElementById('rsvpTableBody');
  const searchInput = document.getElementById('searchInput');

  function normalizeText(value) {
    return (value || '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  }

  function setText(el, msg) {
    if (!el) return;
    el.textContent = msg || '';
  }

  function formatDate(ts) {
    if (!ts) return '';
    try {
      const date = ts.toDate ? ts.toDate() : new Date(ts);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleString('es-CO');
    } catch {
      return '';
    }
  }

  function statusInfo(status) {
    const value = (status || '').toString();
    if (value === 'si') {
      return { label: 'Sí', className: 'table-success', badge: 'bg-success' };
    }
    if (value === 'no') {
      return { label: 'No', className: 'table-danger', badge: 'bg-danger' };
    }
    if (value === 'tal-vez') {
      return {
        label: 'Tal vez',
        className: 'table-warning',
        badge: 'bg-warning text-dark',
      };
    }
    return {
      label: 'Pendiente',
      className: 'table-warning',
      badge: 'bg-warning text-dark',
    };
  }

  function buildInvitationIndex() {
    const byId = new Map();
    const byLabel = new Map();
    for (const inv of invitations) {
      if (!inv) continue;
      if (inv.id) byId.set(inv.id, inv);
      if (inv.label) byLabel.set(normalizeText(inv.label), inv);
    }
    return { byId, byLabel };
  }

  function applySearchFilter() {
    if (!tableBody) return;
    const term = normalizeText(searchInput ? searchInput.value : '');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    for (const row of rows) {
      if (!term) {
        row.style.display = '';
        continue;
      }
      const hay = normalizeText(row.getAttribute('data-search') || '');
      row.style.display = hay.includes(term) ? '' : 'none';
    }
  }

  function renderTable(rows) {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    for (const row of rows) {
      const tr = document.createElement('tr');
      const st = statusInfo(row.status);
      tr.className = st.className;

      const invitationCell = document.createElement('td');
      invitationCell.textContent = row.label;

      const statusCell = document.createElement('td');
      statusCell.innerHTML = `<span class="badge ${st.badge}">${st.label}</span>`;

      const phoneCell = document.createElement('td');
      phoneCell.textContent = row.phone || '';

      const guestsCell = document.createElement('td');
      guestsCell.textContent = (row.guests || []).join(', ');

      const dateCell = document.createElement('td');
      dateCell.textContent = row.updatedAtText || '';

      tr.appendChild(invitationCell);
      tr.appendChild(statusCell);
      tr.appendChild(phoneCell);
      tr.appendChild(guestsCell);
      tr.appendChild(dateCell);

      const searchable = [
        row.label,
        row.phone,
        ...(row.guests || []),
        row.status || '',
      ]
        .filter(Boolean)
        .join(' ');
      tr.setAttribute('data-search', searchable);

      tableBody.appendChild(tr);
    }

    applySearchFilter();
  }

  function computeRowsFromConfirmations(confirmations) {
    const { byId, byLabel } = buildInvitationIndex();

    const latestByKey = new Map();
    for (const c of confirmations) {
      const key = c.invitationId
        ? `id:${c.invitationId}`
        : c.invitationLabel
        ? `label:${normalizeText(c.invitationLabel)}`
        : c.contactName
        ? `contact:${normalizeText(c.contactName)}`
        : `doc:${c.id}`;

      const existing = latestByKey.get(key);
      const a = existing && existing.createdAtMs ? existing.createdAtMs : 0;
      const b = c.createdAtMs ? c.createdAtMs : 0;
      if (!existing || b >= a) {
        latestByKey.set(key, c);
      }
    }

    const pendingRows = [];
    for (const inv of invitations) {
      const key = inv.id ? `id:${inv.id}` : `label:${normalizeText(inv.label)}`;
      if (!latestByKey.has(key)) {
        pendingRows.push({
          label: inv.label,
          status: 'pendiente',
          phone: '',
          guests: Array.isArray(inv.members) ? inv.members : [],
          updatedAtText: '',
          sortRank: 2,
        });
      }
    }

    const confirmedRows = [];
    for (const c of latestByKey.values()) {
      let inv = null;
      if (c.invitationId && byId.has(c.invitationId)) {
        inv = byId.get(c.invitationId);
      } else if (c.invitationLabel && byLabel.has(normalizeText(c.invitationLabel))) {
        inv = byLabel.get(normalizeText(c.invitationLabel));
      }

      const label = inv && inv.label ? inv.label : c.invitationLabel || c.contactName || '(Sin etiqueta)';
      const guests = Array.isArray(c.guests) && c.guests.length ? c.guests : inv && Array.isArray(inv.members) ? inv.members : [];

      let sortRank = 1;
      if (c.generalAttendance === 'si') sortRank = 0;
      if (c.generalAttendance === 'no') sortRank = 0;

      confirmedRows.push({
        label,
        status: c.generalAttendance || 'pendiente',
        phone: c.phone || '',
        guests,
        updatedAtText: c.createdAtText || '',
        sortRank,
      });
    }

    const all = [...confirmedRows, ...pendingRows];
    all.sort((a, b) => {
      if (a.sortRank !== b.sortRank) return a.sortRank - b.sortRank;
      return normalizeText(a.label).localeCompare(normalizeText(b.label));
    });

    return all;
  }

  const firebaseState = (() => {
    try {
      if (typeof firebase === 'undefined') return { auth: null, db: null };
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      return { auth: firebase.auth(), db: firebase.firestore() };
    } catch {
      return { auth: null, db: null };
    }
  })();

  async function loadRsvps() {
    setText(adminMsg, 'Cargando...');
    if (!firebaseState.db) {
      setText(adminMsg, 'Firebase no está disponible.');
      return;
    }

    try {
      const snap = await firebaseState.db
        .collection('rsvps')
        .orderBy('createdAt', 'desc')
        .limit(500)
        .get();

      const confirmations = snap.docs.map((doc) => {
        const data = doc.data() || {};
        const createdAt = data.createdAt || null;
        const createdAtMs = createdAt && createdAt.toMillis ? createdAt.toMillis() : 0;
        return {
          id: doc.id,
          invitationId: data.invitationId || null,
          invitationLabel: data.invitationLabel || null,
          contactName: data.contactName || null,
          phone: data.phone || null,
          generalAttendance: data.generalAttendance || null,
          guests: Array.isArray(data.guests) ? data.guests : [],
          createdAt,
          createdAtMs,
          createdAtText: formatDate(createdAt),
        };
      });

      const rows = computeRowsFromConfirmations(confirmations);
      renderTable(rows);
      setText(adminMsg, `Registros cargados: ${confirmations.length}`);
    } catch (err) {
      setText(adminMsg, 'No se pudo cargar. Revisa reglas de Firestore y tu sesión.');
    }
  }

  function showAdmin(show) {
    if (authView) authView.style.display = show ? 'none' : '';
    if (adminView) adminView.style.display = show ? '' : 'none';
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      setText(authMsg, '');
      if (!firebaseState.auth) {
        setText(authMsg, 'Firebase Auth no está disponible.');
        return;
      }
      const email = (adminEmail && adminEmail.value ? adminEmail.value : '').trim();
      const password = adminPassword && adminPassword.value ? adminPassword.value : '';
      if (!email || !password) {
        setText(authMsg, 'Completa correo y contraseña.');
        return;
      }
      try {
        await firebaseState.auth.signInWithEmailAndPassword(email, password);
      } catch {
        setText(authMsg, 'No se pudo iniciar sesión.');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (!firebaseState.auth) return;
      await firebaseState.auth.signOut();
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadRsvps();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applySearchFilter();
    });
  }

  if (firebaseState.auth) {
    firebaseState.auth.onAuthStateChanged((user) => {
      if (user) {
        showAdmin(true);
        loadRsvps();
      } else {
        showAdmin(false);
      }
    });
  }
});
