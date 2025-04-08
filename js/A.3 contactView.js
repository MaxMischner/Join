"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Extract contactId from URL parameters; default to 1 if not provided.
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = parseInt(urlParams.get("contactId"), 10) || 1;
  
  // Retrieve contacts from localStorage or use dummy data.
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [
    { id: 1, name: "John Doe", email: "johndoe@example.com", phone: "+1 555-1234" }
  ];
  
  const contact = contacts.find(c => c.id === contactId);
  if (!contact) {
    alert("Contact not found!");
    window.location.href = "contacts.html";
    return;
  }
  
  // Populate the view with contact data.
  document.getElementById("contact-name").textContent = contact.name;
  document.getElementById("contact-email").textContent = contact.email;
  document.getElementById("contact-phone").textContent = contact.phone;
  
  // Edit Contact button: redirect to editContact page with the contactId.
  document.getElementById("edit-contact-btn").addEventListener("click", () => {
    window.location.href = "editContact.html?contactId=" + contact.id;
  });
  
  // Delete Contact button: prompt confirmation and delete the contact.
  document.getElementById("delete-contact-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this contact?")) {
      contacts = contacts.filter(c => c.id !== contact.id);
      localStorage.setItem("contacts", JSON.stringify(contacts));
      alert("Contact deleted.");
      window.location.href = "contacts.html";
    }
  });
});