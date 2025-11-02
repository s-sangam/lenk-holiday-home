const translations = {
    en: {
      nav_about: "About",
      nav_gallery: "Gallery",
      nav_availability: "Availability",
      nav_booking: "Booking",
      nav_contact: "Contact",
      section_gallery: "Gallery",
      section_about: "About the Property",
      section_availability: "Availability Calendar",
      section_booking: "Reservation Inquiry",
      section_contact: "Contact",
    },
    de: {
      nav_about: "Über",
      nav_gallery: "Galerie",
      nav_availability: "Verfügbarkeit",
      nav_booking: "Buchung",
      nav_contact: "Kontakt",
      section_gallery: "Galerie",
      section_about: "Über die Unterkunft",
      section_availability: "Verfügbarkeitskalender",
      section_booking: "Reservierungsanfrage",
      section_contact: "Kontakt",
    }
  };
  
  function setLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
    localStorage.setItem("lang", lang);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("lang") || "de";
    setLanguage(saved);
    document.getElementById("btn-de").addEventListener("click", () => setLanguage("de"));
    document.getElementById("btn-en").addEventListener("click", () => setLanguage("en"));
  });