"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Auslesen der Kontakt-ID aus den URL-Parametern
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = parseInt(urlParams.get("contactId"), 10);
  
  // Kontakte aus localStorage laden (bei Bedarf Dummy-Daten)
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  const contact = contacts.find(c => c.id === contactId);
  
  if (!contact) {
    alert("Kontakt nicht gefunden!");
    window.location.href = "contacts.html";
    return;
  }
  
  // Vorbefüllen der Formularfelder mit den vorhandenen Kontaktinformationen
  document.getElementById("edit-name").value = contact.name;
  document.getElementById("edit-email").value = contact.email;
  document.getElementById("edit-phone").value = contact.phone || "";
  
  const editForm = document.getElementById("edit-contact-form");
  const cancelBtn = document.getElementById("cancel-edit");
  
  // Formular absenden: Kontakt aktualisieren
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Neue Werte erfassen
    contact.name = document.getElementById("edit-name").value.trim();
    contact.email = document.getElementById("edit-email").value.trim();
    contact.phone = document.getElementById("edit-phone").value.trim();
    
    // Aktualisiere die Kontakte im localStorage
    localStorage.setItem("contacts", JSON.stringify(contacts));
    
    alert("Kontakt erfolgreich aktualisiert!");
    window.location.href = "contact.html?contactId=" + contact.id;
  });
  
  // Abbrechen: Keine Änderungen, zurück zur Detailansicht
  cancelBtn.addEventListener("click", () => {
    window.location.href = "contact.html?contactId=" + contact.id;
  });
});