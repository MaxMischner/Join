function getContactListCard(initials, name, email, id, color) {
    return `
            <li class="pointer" id="contact-li-${id}" onclick="clickContactCard('contact-li-${id}')" contactID="${id}">
                                    <div class="contact-logo" style="background: ${color}">
                                        ${initials}
                                    </div>
                                   
                                    <div class="contact-list-right">
                                        <div class="contact-name">${name}</div>
                                        <div class="contact-email">${email}</div>
                                    </div>
                                </li>
            `;
}

function getConactLetterContainer(letter, allCardHTML) {
    return `<div class="contact-container">
                            <div class="contact-letter">${letter}</div>
                            <div class="contact-underline"></div>
                            <ul>
                                ${allCardHTML}
                            </ul>
                        </div>`;
}

function getConactDetail(initials, name, email, phone, id, color) {
    return `<div class="contact-detail-header flex">
                            <div class="contact-detail-header-logo" style="background:${color}">
                                ${initials}
                            </div>
                            <div class="contact-detail-header-right">
                                <div class="contact-detail-name">${name}</div>
                                <div class="flex contact-detail-buttons">
                                    <button class="flex pointer contact-detail-edit" onclick="editContact('${id}')">
                                        
                                        <span>Edit</span>
                                    </button>
                                    <button class="flex pointer contact-detail-delete" onclick="deleteContact('${id}'">
                                        
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="contact-detail-info-text">
                            Contact Information
                        </div>
                        <div class="contact-detail-info-title">
                            Email
                        </div>
                        <div class="contact-detail-email">${email}</div>
                        <div class="contact-detail-info-title">
                            Phone
                        </div>
                        <div class="contact-detail-phone">${phone}</div>`;
}

function getEditContact(initals, name, email, phone, color) {
    return `<div class="edit-contact-container">
            <div class="edit-contact-header flex-column">
                <div class="edit-contact-title">Edit Contact</div>
                <div class="edit-contact-divider"></div>
                <div class="edit-contact-intitals"  style="background:${color}">${initals}</div>
            </div>
            <div class="edit-contact-form flex-column">
                <div class="edit-contact-field-div">
                    <input class="edit-contact-field" type="text" id="edit-contact-name" required value="${name}">
                    <img src="/asset/images/person.png" alt="">
                </div>
                <div class="edit-contact-field-div">
                    <input class="edit-contact-field" type="email" id="edit-contact-email" required value="${email}">
                    <img src="/asset/images/grey-mail.svg" alt="">
                </div>
                <div class="edit-contact-field-div">
                    <input class="edit-contact-field" type="text" id="edit-contact-phone" required value="${phone}">
                    <img src="/asset/images/phone.svg" alt="">
                </div>
            </div>
            <div class="edit-contact-bottom">
                <button class="edit-contact-bottom-clear pointer" onclick="clearEditContact()">Clear</button>
                <button class="edit-contact-bottom-save pointer" onclick="saveEditContact()">Save</button>
            </div>
        </div>`;
}