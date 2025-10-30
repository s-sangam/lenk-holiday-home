/* booking.js
   Handles booking form date updates, Google Forms submission flow and UI notifications.
*/

(function () {
    const bookingForm = document.getElementById('bookingForm');
    const formDateHidden = document.getElementById('formDate');
    const formDateDisplay = document.getElementById('formDateDisplay');
    const thankYou = document.getElementById('thank-you-message');
    const newRequestBtn = document.getElementById('newRequestBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const hiddenIframe = document.getElementById('hidden_iframe');
  
    // update form fields when calendar selection changes
    window.addEventListener('calendarSelectionChanged', (e) => {
      const { checkin, checkout } = e.detail || {};
      if (checkin && checkout) {
        formDateHidden.value = `${checkin} → ${checkout}`;
        formDateDisplay.value = `${checkin} → ${checkout}`;
      } else if (checkin) {
        formDateHidden.value = checkin;
        formDateDisplay.value = checkin;
      } else {
        formDateHidden.value = '';
        formDateDisplay.value = '';
      }
    });
  
    // Called by calendar.js on direct API too (optional)
    window.updateBookingInputs = function (checkin, checkout) {
      if (checkin && checkout) {
        formDateHidden.value = `${checkin} → ${checkout}`;
        formDateDisplay.value = `${checkin} → ${checkout}`;
      } else if (checkin) {
        formDateHidden.value = checkin;
        formDateDisplay.value = checkin;
      } else {
        formDateHidden.value = '';
        formDateDisplay.value = '';
      }
    };
  
    function showThankYou() {
      if (thankYou) thankYou.classList.remove('hidden');
    }
    function hideThankYou() {
      if (thankYou) thankYou.classList.add('hidden');
    }
  
    // when Google Forms returns (iframe loads), show message
    if (hiddenIframe) {
      hiddenIframe.addEventListener('load', function () {
        // When target iframe loads after submit, show thank you
        showThankYou();
        // keep booking form hidden? we keep it visible but user gets message
      });
    }
  
    if (bookingForm) {
      bookingForm.addEventListener('submit', function (e) {
        // Note: we let native submission continue to google forms by not preventing default
        // Ensure hidden date field is populated (if user selected on calendar, event should have set it)
        // If not set, we set it from window.chaletCalendar API (if available)
        if (formDateHidden && !formDateHidden.value && window.chaletCalendar) {
          const sel = window.chaletCalendar.getSelection();
          if (sel && sel.checkin) formDateHidden.value = sel.checkin + (sel.checkout ? ` → ${sel.checkout}` : '');
          formDateDisplay.value = formDateHidden.value;
        }
  
        // Small UX: show a confirmation quickly (we also show after iframe loads)
        setTimeout(() => showThankYou(), 800);
  
        // Allow form to submit and target the hidden iframe.
        // No e.preventDefault() here.
      });
    }
  
    if (newRequestBtn) {
      newRequestBtn.addEventListener('click', function () {
        hideThankYou();
        if (bookingForm) bookingForm.reset();
        formDateHidden.value = '';
        formDateDisplay.value = '';
        if (window.chaletCalendar) window.chaletCalendar.resetSelection();
      });
    }
  
    if (clearFormBtn) {
      clearFormBtn.addEventListener('click', function () {
        if (bookingForm) bookingForm.reset();
        formDateHidden.value = '';
        formDateDisplay.value = '';
      });
    }
  })();