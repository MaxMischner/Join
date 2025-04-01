const BASE_URL_CONTACT = 'https://join-61c56-default-rtdb.europe-west1.firebasedatabase.app/contacts';

let contacts = [];

async function initContactsPage() {
    await renderContactsList();
}

async function getAllContacts() {
    const response = await fetch(BASE_URL_CONTACT + ".json");
    const responseJSON = await response.json();
    if (!responseJSON) return [];

    const allContacts = [];
    for (let key in responseJSON) {
        const value = responseJSON[key];
        if (value && typeof value === 'object') {
            allContacts.push({ ...value, id: key });
        }
    }
    return allContacts;
}

async function renderContactsList() {
    const container = document.getElementById("contacts-list");
    container.innerHTML = "";
    contacts = await getAllContacts();

    contacts.sort((a, b) => a.name.localeCompare(b.name));

    const grouped = {};
    for (const contact of contacts) {
        const letter = contact.name[0].toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(contact);
    }

    for (const letter in grouped) {
        const groupLabel = document.createElement("div");
        groupLabel.className = "contact-letter";
        groupLabel.textContent = letter;
        container.appendChild(groupLabel);

        for (const contact of grouped[letter]) {
            const initials = getInitials(contact.name);
            const color = getRandomColor(initials);

            const entry = document.createElement("div");
            entry.className = "contact-entry";

            const circle = document.createElement("div");
            circle.className = "contact-circle";
            circle.style.backgroundColor = color;
            circle.textContent = initials;

            const info = document.createElement("div");
            info.className = "contact-info";
            info.innerHTML = `<b>${contact.name}</b><small>${contact.email}</small>`;

            entry.appendChild(circle);
            entry.appendChild(info);
            entry.addEventListener("click", () => showContactDetails(contact, initials, color));
            container.appendChild(entry);
        }
    }
}

function showContactDetails(contact, initials, color) {
    const detail = document.getElementById("contacts-detail");
    detail.innerHTML = `
        <div class="contact-detail-card">
            <div class="contact-detail-header" style="background-color: ${color};">
                <div class="contact-detail-initials">${initials}</div>
            </div>
            <div class="contact-detail-body">
                <h2>${contact.name}</h2>
                <p><b>Email:</b> <a href="mailto:${contact.email}">${contact.email}</a></p>
                <p><b>Telefon:</b> <a href="tel:${contact.phone}">${contact.phone}</a></p>
                <div class="contact-detail-actions">
                    <button onclick="editContact('${contact.id}')">✏️ Bearbeiten</button>
                    <button onclick="deleteAndRefresh('${contact.id}')">🗑️ Löschen</button>
                </div>
            </div>
        </div>
    `;
}

async function addNewContact(event) {
    event.preventDefault();
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const phone = document.getElementById("contact-phone").value.trim();
    if (!name || !email || !phone) return alert("Bitte alle Felder ausfüllen.");

    const newContact = { name, email, phone };
    await putContact(newContact);
    await renderContactsList();
    toggleAddContactForm();
    event.target.reset();
}

async function putContact(data, id = "") {
    const method = id ? "PUT" : "POST";
    const url = BASE_URL_CONTACT + (id ? `/${id}.json` : ".json");
    const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function deleteContact(id) {
    await fetch(`${BASE_URL_CONTACT}/${id}.json`, { method: "DELETE" });
}

async function deleteAndRefresh(id) {
    if (confirm("Möchtest du diesen Kontakt wirklich löschen?")) {
        await deleteContact(id);
        await renderContactsList();
        resetDetail();
    }
}

function resetDetail() {
    const detail = document.getElementById("contacts-detail");
    detail.innerHTML = `<h1>Contacts <span class="blue-line">|</span> <span class="subtext">Better with a team</span></h1>`;
}

function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return alert("Kontakt nicht gefunden!");

    const detail = document.getElementById("contacts-detail");
    const initials = getInitials(contact.name);
    const color = getRandomColor(initials);

    detail.innerHTML = `
        <form onsubmit="saveEditedContact(event, '${id}')">
            <div class="contact-detail-card">
                <div class="contact-detail-header" style="background-color: ${color};">
                    <div class="contact-detail-initials">${initials}</div>
                </div>
                <div class="contact-detail-body">
                    <input type="text" id="edit-name" value="${contact.name}" required />
                    <input type="email" id="edit-email" value="${contact.email}" required />
                    <input type="tel" id="edit-phone" value="${contact.phone}" required />
                    <div class="contact-detail-actions">
                        <button type="submit">💾 Speichern</button>
                        <button type="button" onclick="renderContactsList()">❌ Abbrechen</button>
                    </div>
                </div>
            </div>
        </form>
    `;
}

async function saveEditedContact(event, id) {
    event.preventDefault();
    const updatedContact = {
        name: document.getElementById("edit-name").value.trim(),
        email: document.getElementById("edit-email").value.trim(),
        phone: document.getElementById("edit-phone").value.trim(),
    };

    if (!updatedContact.name || !updatedContact.email || !updatedContact.phone) {
        return alert("Bitte alle Felder ausfüllen!");
    }

    await putContact(updatedContact, id);
    await renderContactsList();
    resetDetail();
}

function getInitials(name) {
    const parts = name.trim().split(" ");
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

function getRandomColor(initials) {
    const colors = ["#FFA726", "#29ABE2", "#7E57C2", "#66BB6A", "#EF5350", "#26C6DA", "#FF7043"];
    const index = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % colors.length;
    return colors[index];
}

function toggleAddContactForm() {
    const form = document.getElementById("add-contact-form");
    form.classList.toggle("d_none");
}
