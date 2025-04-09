"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Extract contactId from URL parameters (defaulting to 1 if not provided)
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = parseInt(urlParams.get("contactId"), 10) || 1;
  
  // Retrieve contacts from localStorage or use dummy data
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [
    { id: 1, name: "John Doe", email: "johndoe@example.com", phone: "+1 555-1234" }
  ];
  
  let contact = contacts.find(c => c.id === contactId);
  if (!contact) {
    alert("Contact not found!");
    window.location.href = "contacts.html";
    return;
  }
  
  // Pre-fill the form with existing contact data
  document.getElementById("edit-name").value = contact.name;
  document.getElementById("edit-email").value = contact.email;
  document.getElementById("edit-phone").value = contact.phone || "";
  
  const editForm = document.getElementById("edit-contact-form");
  const cancelBtn = document.getElementById("cancel-edit-btn");
  
  // Save updated contact data on form submission
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    contact.name = document.getElementById("edit-name").value.trim();
    contact.email = document.getElementById("edit-email").value.trim();
    contact.phone = document.getElementById("edit-phone").value.trim();
    
    // Update localStorage
    localStorage.setItem("contacts", JSON.stringify(contacts));
    
    alert("Contact updated successfully!");
    window.location.href = "contact.html?contactId=" + contact.id;
  });
  
  // Cancel editing: Redirect back to the view page without saving changes
  cancelBtn.addEventListener("click", () => {
    window.location.href = "contact.html?contactId=" + contact.id;
  });
});
