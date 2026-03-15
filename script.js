document.addEventListener('DOMContentLoaded', () => {
  const guestsContainer = document.getElementById('guestsContainer');
  const addGuestBtn = document.getElementById('addGuestBtn');
  const form = document.getElementById('rsvpForm');
  const invitados =
    typeof INVITADOS !== 'undefined' && Array.isArray(INVITADOS)
      ? INVITADOS
      : [];
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

  const db = (() => {
    try {
      if (typeof firebase === 'undefined') return null;
      if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      return firebase.firestore();
    } catch {
      return null;
    }
  })();

  function normalizeText(value) {
    return (value || '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  }

  function findInvitationByName(value) {
    const term = normalizeText(value);
    if (!term || !invitations.length) return null;

    for (const inv of invitations) {
      if (normalizeText(inv.label) === term) return inv;
      if (Array.isArray(inv.members)) {
        for (const member of inv.members) {
          if (normalizeText(member) === term) return inv;
        }
      }
    }
    return null;
  }

  function findInvitationByLabel(value) {
    const term = normalizeText(value);
    if (!term || !invitations.length) return null;
    for (const inv of invitations) {
      if (normalizeText(inv.label) === term) return inv;
    }
    return null;
  }

  let isApplyingInvitation = false;

  function setupAutocomplete(input, onSelect) {
    if (!input || !invitados.length) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'position-relative w-100';

    const parent = input.parentElement;
    parent.replaceChild(wrapper, input);
    wrapper.appendChild(input);

    const list = document.createElement('div');
    list.className =
      'list-group position-absolute w-100 shadow-sm bg-white';
    list.style.zIndex = '1050';
    list.style.maxHeight = '240px';
    list.style.overflowY = 'auto';
    list.style.display = 'none';
    wrapper.appendChild(list);

    function hideList() {
      list.style.display = 'none';
      list.innerHTML = '';
    }

    function showMatches(value) {
      const term = value.trim().toLowerCase();
      if (!term) {
        hideList();
        return;
      }

      const matches = invitados
        .filter(
          (nombre) =>
            typeof nombre === 'string' &&
            nombre.toLowerCase().includes(term)
        )
        .slice(0, 10);

      if (!matches.length) {
        hideList();
        return;
      }

      list.innerHTML = '';
      matches.forEach((nombre) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'list-group-item list-group-item-action';
        item.textContent = nombre;
        item.addEventListener('click', () => {
          input.value = nombre;
          hideList();
          if (typeof onSelect === 'function') {
            onSelect(nombre, input);
          }
          input.focus();
        });
        list.appendChild(item);
      });

      list.style.display = 'block';
    }

    input.addEventListener('input', (e) => {
      showMatches(e.target.value);
    });

    input.addEventListener('focus', (e) => {
      if (e.target.value) {
        showMatches(e.target.value);
      }
    });

    input.addEventListener('blur', () => {
      setTimeout(() => {
        hideList();
        if (typeof onSelect === 'function') {
          onSelect(input.value, input);
        }
      }, 150);
    });

    input.addEventListener('change', () => {
      if (typeof onSelect === 'function') {
        onSelect(input.value, input);
      }
    });
  }

  let guestCount = 0;

  function ensureGuestCards(total) {
    if (!guestsContainer) return;

    while (guestsContainer.children.length < total) {
      const card = createGuestCard(guestsContainer.children.length);
      guestsContainer.appendChild(card);
    }
    while (guestsContainer.children.length > total) {
      guestsContainer.removeChild(guestsContainer.lastElementChild);
    }
    renumberGuests();
  }

  function applyInvitationToGuests(inv, options = {}) {
    if (!inv || !Array.isArray(inv.members) || !inv.members.length) return;
    if (!guestsContainer) return;

    const setContactName = options.setContactName === true;

    isApplyingInvitation = true;
    try {
      if (setContactName) {
        const contactNameInput = document.getElementById('contactName');
        if (contactNameInput) {
          contactNameInput.value = inv.label || '';
        }
      }

      ensureGuestCards(inv.members.length);

      Array.from(guestsContainer.children).forEach((card, idx) => {
        const nameInput = card.querySelector('input[id^="guestName_"]');
        if (nameInput) {
          nameInput.value = inv.members[idx] || '';
        }
      });
    } finally {
      isApplyingInvitation = false;
    }
  }

  function createGuestCard(index) {
    const card = document.createElement('div');
    card.className = 'guest-card';
    card.dataset.index = index.toString();

    card.innerHTML = `
      <div class="guest-header">
        <div class="guest-title">Persona ${index + 1}</div>
        <button type="button" class="guest-remove-btn" aria-label="Quitar persona">
          <span>✕</span><span>Quitar</span>
        </button>
      </div>
      <div class="guest-fields">
        <div class="form-group">
          <label for="guestName_${index}">Nombre completo</label>
          <input
            type="text"
            id="guestName_${index}"
            name="guestName_${index}"
            required
            placeholder="Nombre y apellido"
          />
        </div>
      </div>
    `;

    const removeBtn = card.querySelector('.guest-remove-btn');
    removeBtn.addEventListener('click', () => {
      if (guestsContainer.children.length > 1) {
        guestsContainer.removeChild(card);
        renumberGuests();
      }
    });

    const guestNameInput = card.querySelector(
      `#guestName_${index}`
    );
    setupAutocomplete(guestNameInput, (selected) => {
      if (isApplyingInvitation) return;
      const inv = findInvitationByName(selected);
      if (inv) applyInvitationToGuests(inv, { setContactName: false });
    });

    return card;
  }

  function renumberGuests() {
    Array.from(guestsContainer.children).forEach((card, idx) => {
      card.dataset.index = idx.toString();
      const title = card.querySelector('.guest-title');
      if (title) title.textContent = `Persona ${idx + 1}`;
    });
    guestCount = guestsContainer.children.length;
  }

  function addInitialGuest() {
    if (!guestsContainer) return;
    const card = createGuestCard(guestCount);
    guestsContainer.appendChild(card);
    guestCount++;
  }

  if (guestsContainer) {
    addInitialGuest();
  }

  const contactNameInput = document.getElementById('contactName');
  if (contactNameInput) {
    setupAutocomplete(contactNameInput, (selected) => {
      if (isApplyingInvitation) return;
      const inv = findInvitationByName(selected);
      if (!inv) return;
      const setContactName =
        normalizeText(selected) === normalizeText(inv.label);
      applyInvitationToGuests(inv, { setContactName });
    });
  }

  if (addGuestBtn) {
    addGuestBtn.addEventListener('click', () => {
      const card = createGuestCard(guestCount);
      guestsContainer.appendChild(card);
      guestCount++;
    });
  }

  function showError(input, message) {
    const name = input.getAttribute('name') || input.id;
    const errorEl = document.querySelector(`.error-msg[data-for="${name}"]`);
    if (errorEl) {
      errorEl.textContent = message;
    }
    input.classList.add('has-error');
  }

  function clearError(input) {
    const name = input.getAttribute('name') || input.id;
    const errorEl = document.querySelector(`.error-msg[data-for="${name}"]`);
    if (errorEl) {
      errorEl.textContent = '';
    }
    input.classList.remove('has-error');
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const requiredFields = ['contactName', 'phone', 'generalAttendance'];
      let hasErrors = false;

      requiredFields.forEach((fieldName) => {
        const input = document.getElementById(fieldName);
        if (!input) return;

        if (!input.value.trim()) {
          showError(input, 'Este campo es obligatorio');
          hasErrors = true;
        } else {
          clearError(input);
        }
      });

      const guestCards = Array.from(
        guestsContainer ? guestsContainer.children : []
      );
      if (guestCards.length === 0) {
        hasErrors = true;
      }

      for (const card of guestCards) {
        const nameInput = card.querySelector('input[id^="guestName_"]');

        if (nameInput && !nameInput.value.trim()) {
          nameInput.focus();
          hasErrors = true;
          break;
        }
      }

      if (hasErrors) {
        alert('Por favor revisa que todos los campos obligatorios estén completos.');
        return;
      }

      const formData = new FormData(form);
      const contactName = formData.get('contactName');
      const generalAttendance = formData.get('generalAttendance');
      const phone = formData.get('phone');
      const message = formData.get('message');

      const guestsSummary = guestCards
        .map((card, idx) => {
          const nameInput = card.querySelector('input[id^="guestName_"]');
          if (!nameInput) return null;
          const name = nameInput.value.trim();
          return `${idx + 1}. ${name}`;
        })
        .filter(Boolean)
        .join('\n');

      let emailBody = `Confirmación de asistencia - Boda Sebas & Marce\n\n`;
      emailBody += `Quien responde: ${contactName}\n`;
      emailBody += `Asistencia general: ${
        generalAttendance === 'si'
          ? 'Sí asistiremos'
          : generalAttendance === 'no'
          ? 'No podremos asistir'
          : 'Aún no estamos seguros'
      }\n`;
      emailBody += `Celular / WhatsApp: ${phone}\n`;
      emailBody += `\nPersonas incluidas en esta invitación:\n${guestsSummary}\n`;
      if (message) {
        emailBody += `\nComentarios adicionales:\n${message}\n`;
      }

      const invitation = findInvitationByLabel(contactName);
      const guests = guestCards
        .map((card) => {
          const nameInput = card.querySelector('input[id^="guestName_"]');
          return nameInput ? nameInput.value.trim() : '';
        })
        .filter(Boolean);

      if (db) {
        db.collection('rsvps')
          .add({
            invitationId: invitation ? invitation.id : null,
            invitationLabel: invitation ? invitation.label : null,
            contactName: (contactName || '').toString(),
            phone: (phone || '').toString(),
            generalAttendance: (generalAttendance || '').toString(),
            guests,
            message: (message || '').toString(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .catch(() => {});
      }

      const whatsappNumber = '573225020490';
      const text = encodeURIComponent(emailBody);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
});

