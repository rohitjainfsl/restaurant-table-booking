const screen1 = document.querySelector("#screen1");
const screen2 = document.querySelector("#screen2");
const screen3 = document.querySelector("#screen3");
const screen4 = document.querySelector("#screen4");
const screen5 = document.querySelector("#screen5");
const startBtn = document.querySelector("#screen1 a");
const screen2Time = document.querySelector("#screen2 select");
const screen2date = document.querySelector("#screen2 #DaTe input");
const bookingForm = document.querySelector("#screen2 form");
const tables = document.querySelectorAll("#tableBooking button");
const screen3BookNow = screen3.querySelector("#bookNow");
const peopleCount = document.querySelector("#screen3 .well p");
const contactWell = document.querySelector("#screen4 .well p");
const contactForm = document.querySelector("#screen4 form");

const bookings =
  localStorage.getItem("bookings") === null
    ? []
    : JSON.parse(localStorage.getItem("bookings"));

let currentBooking = {};

startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showScreen(screen1, screen2);
});

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  initializeBooking();
  showScreen(screen2, screen3);

  peopleCount.innerText =
    currentBooking.people > 1
      ? currentBooking.people + " persons"
      : currentBooking.people + " person";

  const bookedTables = checkForBookedTables(
    currentBooking.date,
    currentBooking.time
  );
  console.log(bookedTables);
  if (bookedTables) disableBookedTables(bookedTables);
});

tables.forEach((table) => {
  table.addEventListener("click", () => {
    if (!table.disabled) {
      removeActive();
      table.classList.add("bg-blue-500", "text-white");
      const { date, time } = currentBooking;
      currentBooking.table = table.getAttribute("data-table-id");

      const updatedBooking = bookings.map((booking) =>
        booking.date === date && booking.time === time
          ? { ...booking, table: table.getAttribute("data-table-id") }
          : booking
      );

      localStorage.setItem("bookings", JSON.stringify(updatedBooking));
    }
  });
});

screen3BookNow.addEventListener("click", () => {
  showScreen(screen3, screen4);
  contactWell.innerHTML = `You are making a reservation for <strong>${currentBooking.people}</strong> people, on <strong>${currentBooking.date}</strong> at <strong>${currentBooking.time}</strong>`;
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const contactData = Object.fromEntries(formData);
  currentBooking = {
    ...currentBooking,
    name: contactData.name,
    number: contactData.number,
  };

  bookings.pop();
  bookings.push(currentBooking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  showScreen(screen4, screen5);
});

function removeActive() {
  tables.forEach((table) =>
    table.classList.remove("bg-blue-500", "text-white")
  );
}

function disableTable(table) {
  table.disabled = true;
  table.classList.add("opacity-50", "bg-blue-500");
}

function enableTable(table) {
  table.disabled = false;
  table.classList.remove("opacity-50", "bg-blue-500");
}

function disableBookedTables(bookedTables) {
  tables.forEach((table) =>
    bookedTables.includes(table.getAttribute("data-table-id"))
      ? disableTable(table)
      : enableTable(table)
  );
}

function initializeBooking() {
  const formData = new FormData(bookingForm);
  const currentBookingData = Object.fromEntries(formData);

  currentBooking = { ...currentBookingData };
  bookings.push(currentBooking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

function checkForBookedTables(date, time) {
  const bookedTables = [];
  if (bookings.length > 0) {
    bookings.forEach((booking) => {
      if (booking.date === date && booking.time === time && booking.table)
        bookedTables.push(booking.table);
    });
    if (bookedTables.length > 0) return bookedTables;
  }
  return null;
}

function showScreen(screenToHide, screenToShow) {
  screenToHide.classList.add("hidden");
  screenToShow.classList.remove("hidden");
}

function timeOptions() {
  for (let i = 11; i < 23; i++) {
    const option = document.createElement("option");
    option.value = i;
    if (i === 11) {
      option.innerText = i + "AM";
    } else if (i === 12) {
      option.innerText = i + "PM";
    } else {
      option.innerText = i - 12 + "PM";
    }
    screen2Time.append(option);
  }
}

timeOptions();
