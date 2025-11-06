/* calendar.js
   Responsible for rendering the calendar, selection, navigation, and emitting a custom event
   'calendarSelectionChanged' with detail { checkin, checkout } in ISO (YYYY-MM-DD) format.
*/

(function () {
    const calendarContainer = document.getElementById('calendar');
    if (!calendarContainer) return;
  
    // ---------- CONFIG ----------
    // Hard-coded busy ranges (full ISO dates)
    const busyRanges = [
      { start: '2025-10-12', end: '2025-10-18' },
      { start: '2025-10-25', end: '2025-10-31' }
      { start: '2025-12-20', end: '2026-01-04' }
    ];
  
    // selection state
    let selectedStart = null; // Date or null
    let selectedEnd = null;
  
    // dynamic month/year based on today
    const today = new Date();
    let currentMonth = today.getMonth(); // 0-11
    let currentYear = today.getFullYear();
  
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  
    const monthLabelEl = document.getElementById('monthLabel');
  
    // utils
    function parseISO(s) { return s ? new Date(s + 'T00:00:00') : null; }
    function formatISO(d) {
      if (!d) return '';
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }
  
    function isBusyDate(date) {
      return busyRanges.some(r => {
        const s = parseISO(r.start);
        const e = parseISO(r.end);
        return date >= s && date <= e;
      });
    }
  
    function checkConflict(startDate, endDate) {
      if (!startDate || !endDate) return false;
      return busyRanges.some(r => {
        const s = parseISO(r.start);
        const e = parseISO(r.end);
        // overlap if not (end < s OR start > e)
        return !(endDate < s || startDate > e);
      });
    }
  
    // emit selection to other modules
    function emitSelection() {
      const detail = {
        checkin: selectedStart ? formatISO(selectedStart) : '',
        checkout: selectedEnd ? formatISO(selectedEnd) : ''
      };
      const ev = new CustomEvent('calendarSelectionChanged', { detail });
      window.dispatchEvent(ev);
    }
  
    // render
    function renderCalendar() {
      // month label
      if (monthLabelEl) monthLabelEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  
      calendarContainer.innerHTML = '';
  
      // weekdays header
      const weekHeader = document.createElement('div');
      weekHeader.className = 'grid grid-cols-7 gap-2 text-sm font-semibold text-gray-600 mb-2';
      ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(w => {
        const cell = document.createElement('div');
        cell.className = 'text-center';
        cell.textContent = w;
        weekHeader.appendChild(cell);
      });
      calendarContainer.appendChild(weekHeader);
  
      // days grid
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-7 gap-2';
  
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();
  
      // leading empty cells
      for (let i=0;i<firstDay;i++){
        const empty = document.createElement('div');
        grid.appendChild(empty);
      }
  
      for (let d=1; d<=daysInMonth; d++){
        const dateObj = new Date(currentYear, currentMonth, d);
        const busy = isBusyDate(dateObj);
  
        const inRange = selectedStart && selectedEnd && dateObj >= selectedStart && dateObj <= selectedEnd;
        const singleSelected = selectedStart && !selectedEnd && dateObj.getTime() === selectedStart.getTime();
  
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'calendar-button min-h-[56px] flex items-center justify-center rounded text-sm font-medium focus:outline-none w-full';
        btn.dataset.day = d;
        btn.textContent = d;
  
        if (busy) {
          btn.classList.add('bg-red-500','text-white','border','border-red-600','disabled');
          btn.disabled = true;
        } else if (inRange || singleSelected) {
          btn.classList.add('bg-blue-600','text-white','border','border-blue-700');
          btn.addEventListener('click', onDayClick);
        } else {
          btn.classList.add('bg-green-200','text-green-800','hover:bg-green-300','border','border-green-300');
          btn.addEventListener('click', onDayClick);
        }
  
        grid.appendChild(btn);
      }
  
      calendarContainer.appendChild(grid);
    }
  
    // day click handler
    function onDayClick(e) {
      const day = Number(e.currentTarget.dataset.day);
      const clicked = new Date(currentYear, currentMonth, day);
  
      if (!selectedStart || (selectedStart && selectedEnd)) {
        selectedStart = clicked;
        selectedEnd = null;
      } else {
        if (clicked < selectedStart) {
          selectedEnd = selectedStart;
          selectedStart = clicked;
        } else if (clicked.getTime() === selectedStart.getTime()) {
          selectedStart = null;
          selectedEnd = null;
        } else {
          selectedEnd = clicked;
        }
      }
  
      if (selectedStart && selectedEnd) {
        if (checkConflict(selectedStart, selectedEnd)) {
          alert('The selected range includes booked dates. Please choose a different range.');
          selectedStart = null;
          selectedEnd = null;
        }
      }
  
      emitSelection();
      renderCalendar();
    }
  
    // left/right arrows (injected into wrapper)
    function createNav() {
      const wrapper = calendarContainer.parentNode;
      wrapper.style.position = 'relative';
  
      const left = document.createElement('button');
      left.innerHTML = '&#8592;';
      left.className = 'absolute left-2 top-8 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300';
      left.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        renderCalendar();
      });
  
      const right = document.createElement('button');
      right.innerHTML = '&#8594;';
      right.className = 'absolute right-2 top-8 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300';
      right.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar();
      });
  
      wrapper.appendChild(left);
      wrapper.appendChild(right);
    }
  
    // expose a small API (optional)
    window.chaletCalendar = {
      resetSelection() { selectedStart = null; selectedEnd = null; emitSelection(); renderCalendar(); },
      getSelection() { return { checkin: formatISO(selectedStart), checkout: formatISO(selectedEnd) }; }
    };
  
    createNav();
    renderCalendar();
  })();