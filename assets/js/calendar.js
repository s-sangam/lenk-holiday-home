// ==================== Calendar Script ====================

// --- Config ---
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedStart = null;
let selectedEnd = null;

// --- Hardcoded busy date ranges (update as needed) ---
const busyRanges = [
  { start: "2025-12-20", end: "2026-01-04" },
  { start: "2025-11-08", end: "2025-11-22" }
];

// --- DOM elements ---
const calendarEl = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");

// --- Utility functions ---
function isDateInRange(date, start, end) {
  return date >= start && date <= end;
}

function isDateBusy(date) {
  return busyRanges.some(range => {
    const start = new Date(range.start);
    const end = new Date(range.end);
    return isDateInRange(date, start, end);
  });
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function updateBookingInputs() {
  const formDisplay = document.getElementById("formDateDisplay");
  const formHidden = document.getElementById("formDate");

  if (selectedStart && selectedEnd) {
    const range = `${formatDate(selectedStart)} → ${formatDate(selectedEnd)}`;
    formDisplay.value = range;
    formHidden.value = range;
  } else if (selectedStart) {
    const start = formatDate(selectedStart);
    formDisplay.value = start;
    formHidden.value = start;
  } else {
    formDisplay.value = "";
    formHidden.value = "";
  }
}

// --- Calendar rendering ---
function renderCalendar() {
  calendarEl.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
  const todayDate = new Date();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Header
  monthLabel.innerHTML = `
    <div class="flex justify-between items-center mb-2">
      <button id="prevMonth" class="text-gray-500 hover:text-gray-700 text-xl font-bold" title="Previous month">❮</button>
      <div class="text-center font-semibold">${monthNames[currentMonth]} ${currentYear}</div>
      <button id="nextMonth" class="text-gray-500 hover:text-gray-700 text-xl font-bold" title="Next month">❯</button>
    </div>
  `;

  const grid = document.createElement("div");
  grid.className = "grid grid-cols-7 gap-1 text-center text-sm";

  // Weekday headers
  ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].forEach(day => {
    const el = document.createElement("div");
    el.className = "font-semibold text-gray-600";
    el.textContent = day;
    grid.appendChild(el);
  });

  // Padding for days before the first
  for (let i = 1; i < startDayOfWeek; i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  // Render days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(currentYear, currentMonth, day);
    const el = document.createElement("div");
    el.textContent = day;

    const isPast = date < new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
    const isBusyDay = isDateBusy(date);
    const isSelected =
      selectedStart && selectedEnd && date >= selectedStart && date <= selectedEnd;

    // Styling
    el.className =
      "p-2 rounded cursor-pointer transition " +
      (isBusyDay
        ? "bg-red-400 text-white cursor-not-allowed"
        : isPast
        ? "text-gray-300 cursor-not-allowed"
        : isSelected
        ? "bg-blue-600 text-white"
        : "hover:bg-blue-100");

    // Click handler
    if (!isPast && !isBusyDay) {
      el.addEventListener("click", () => {
        if (!selectedStart || (selectedStart && selectedEnd)) {
          selectedStart = date;
          selectedEnd = null;
        } else if (date > selectedStart) {
          // prevent selecting across busy dates
          let conflict = false;
          let d = new Date(selectedStart);
          while (d <= date) {
            if (isDateBusy(d)) {
              conflict = true;
              break;
            }
            d.setDate(d.getDate() + 1);
          }
          if (!conflict) selectedEnd = date;
        } else {
          selectedStart = date;
          selectedEnd = null;
        }
        renderCalendar();
        updateBookingInputs();
      });
    }

    grid.appendChild(el);
  }

  calendarEl.appendChild(grid);

  // --- Navigation controls ---
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");

  // Disable past month navigation
  if (currentYear < today.getFullYear() || (currentYear === today.getFullYear() && currentMonth <= today.getMonth())) {
    prevBtn.classList.add("opacity-30", "cursor-not-allowed");
  } else {
    prevBtn.addEventListener("click", () => {
      if (!(currentYear === today.getFullYear() && currentMonth === today.getMonth())) {
        if (currentMonth === 0) {
          currentMonth = 11;
          currentYear--;
        } else {
          currentMonth--;
        }
        renderCalendar();
      }
    });
  }

  nextBtn.addEventListener("click", () => {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
    renderCalendar();
  });
}

// --- Initialize ---
document.addEventListener("DOMContentLoaded", renderCalendar);