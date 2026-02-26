// додавання бібліотеки flatpickr для вибору дати та часу
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

// додавання бібліотеки iziToast для відображення сповіщень
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector("[data-start]");
startBtn.disabled = true;
const input = document.querySelector("#datetime-picker");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");


let userSelectedDate = null;

flatpickr("#datetime-picker", {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,

    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (selectedDate <= new Date()) {
            startBtn.disabled = true;

            iziToast.error({
                message: "Please choose a date in the future",
                position: "topRight",
            });

            return;
        }

        userSelectedDate = selectedDate;
        startBtn.disabled = false;
    },
});

startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    input.disabled = true;

    const timerId = setInterval(() => {
        const timeLeft = userSelectedDate - Date.now();
        console.log(timeLeft);

        
        if (timeLeft <= 0) {
        clearInterval(timerId);
        input.disabled = false;
        
        iziToast.success({
            message: "Timer has finished!",
            position: "topRight",
        });
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";

            return;
        }

        const time = convertMs(timeLeft);
        console.log(time);

        daysEl.textContent = String(time.days).padStart(2, "0");
        hoursEl.textContent = String(time.hours).padStart(2, "0");
        minutesEl.textContent = String(time.minutes).padStart(2, "0");
        secondsEl.textContent = String(time.seconds).padStart(2, "0");

    }, 1000)

    
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}