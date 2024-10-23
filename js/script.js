// Массив для хранения выбранных дат (формат {day, month, year})
let selectedDates = [];

generateCalendar(2024, 2025, ".calendar__table");

function generateCalendar(startYear, endYear, calendarContainer) {
  const calendarOutput = document.querySelector(calendarContainer);

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      calendarOutput.innerHTML += new Month(year, month).generateHTML();
    }
  }
}

function showRelevantMonths(collectionOfMonth, date, months) {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  count = currentMonth - 1;

  collectionOfMonth.forEach((item, index) => {
    const titlesOfMonths = document.querySelectorAll(".calendar__month-title");

    const monthTitle = titlesOfMonths[index].innerHTML;
    const [monthName, yearInTitle] = monthTitle.split(" ");
    const yearParsed = parseInt(yearInTitle, 10);

    const monthIndex = months.indexOf(monthName);

    const isCurrentMonth =
      yearParsed === currentYear && monthIndex === currentMonth;

    const isPreviousMonth =
      (monthIndex === currentMonth - 1 && yearParsed === currentYear) ||
      (currentMonth === 0 &&
        monthIndex === 11 &&
        yearParsed === currentYear - 1);

    const isNextMonth =
      (monthIndex === currentMonth + 1 && yearParsed === currentYear) ||
      (currentMonth === 11 &&
        monthIndex === 0 &&
        yearParsed === currentYear + 1);

    if (isCurrentMonth || isPreviousMonth || isNextMonth) {
      item.classList.remove("hide");
    }
  });
}

function hideAll(arr) {
  arr.forEach((item) => item.classList.add("hide"));
}

function showNextThreeMonth(arr) {
  hideAll(arr);

  if (count + 3 < arr.length - 3) {
    count += 3;
  } else {
    count = arr.length - 3;
  }

  for (let i = count; i < count + 3 && i < arr.length; i++) {
    arr[i].classList.remove("hide");
  }
}

function showPrevThreeMonth(arr) {
  hideAll(arr);

  if (count - 3 >= 0) {
    count -= 3;
  } else if (count > 0) {
    count = 0;
  }

  for (let i = count; i < count + 3 && i < arr.length; i++) {
    arr[i].classList.remove("hide");
  }
}

function setupMonthNavigation(calendarSelector, collectionOfMonth) {
  calendarSelector.addEventListener("click", (e) => {
    if (
      e.target.matches(".calendar__arrow--prev") ||
      e.target.matches(".calendar__arrow--prev svg") ||
      e.target.matches(".calendar__arrow--prev svg path")
    ) {
      showPrevThreeMonth(collectionOfMonth);
    }
    if (
      e.target.matches(".calendar__arrow--next") ||
      e.target.matches(".calendar__arrow--next svg") ||
      e.target.matches(".calendar__arrow--next svg path")
    ) {
      showNextThreeMonth(collectionOfMonth);
    }
  });
}

function disableHoverOnEmptyCells(cellSelector) {
  cellSelector.forEach((item) => {
    if (item.innerHTML.trim() === "") {
      item.classList.add("no-hover");
    }
  });
}

function createDateObject(day, month, year) {
  return new Date(year, month - 1, day);
}

function resetSelectedDates(cells) {
  selectedDates = [];
  cells.forEach((cell) => {
    cell.classList.remove("active");
    cell.classList.remove("active-cell");
  });
}

function highlightCellsBetween(cells, startDate, endDate) {
  cells.forEach((cell) => {
    const cellDay = parseInt(cell.innerHTML.trim(), 10);
    const cellMonth = parseInt(cell.dataset.month, 10);
    const cellYear = parseInt(cell.dataset.year, 10);

    if (!isNaN(cellDay)) {
      const cellDateObject = createDateObject(cellDay, cellMonth, cellYear);

      if (
        cellDateObject > startDate.dateObject &&
        cellDateObject < endDate.dateObject
      ) {
        cell.classList.add("active-cell");
      }
    }
  });
}

(function () {
  const collectionOfMonth = document.querySelectorAll(".calendar__month");

  if (!collectionOfMonth.length) {
    console.error("Месяцы в календаре не найдены");
    return;
  }

  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  let count;
  const date = new Date();
  showRelevantMonths(collectionOfMonth, date, months);

  const calendar = document.querySelector(".calendar");
  setupMonthNavigation(calendar, collectionOfMonth);

  const cells = document.querySelectorAll(".calendar__day");
  disableHoverOnEmptyCells(cells);

  calendar.addEventListener("click", (e) => {
    const cell = e.target;

    if (cell.matches(".calendar__day") && cell.innerHTML.trim() !== "") {
      const selectedDay = parseInt(cell.innerHTML.trim(), 10);
      const selectedMonth = parseInt(cell.dataset.month, 10);
      const selectedYear = parseInt(cell.dataset.year, 10);

      const selectedDate = {
        day: selectedDay,
        month: selectedMonth,
        year: selectedYear,
        dateObject: createDateObject(selectedDay, selectedMonth, selectedYear),
      };

      if (selectedDates.length === 2) {
        resetSelectedDates(cells);
      }

      const dateIndex = selectedDates.findIndex(
        (date) =>
          date.day === selectedDay &&
          date.month === selectedMonth &&
          date.year === selectedYear
      );

      if (dateIndex > -1) {
        cell.classList.remove("active");
        selectedDates.splice(dateIndex, 1);
      } else {
        cell.classList.add("active");
        selectedDates.push(selectedDate);
      }

      if (selectedDates.length === 2) {
        selectedDates.sort(
          (a, b) => a.dateObject.getTime() - b.dateObject.getTime()
        );

        const [startDate, endDate] = selectedDates;
        console.log(
          `Период: с ${startDate.day}/${startDate.month}/${startDate.year} по ${endDate.day}/${endDate.month}/${endDate.year}`
        );

        highlightCellsBetween(cells, startDate, endDate);
      }

      if (selectedDates.length === 1) {
        const selectedDate = selectedDates[0];
        console.log(
          `Выбрана дата: ${selectedDate.day}/${selectedDate.month}/${selectedDate.year}`
        );
      }
    }
  });

  const buttonApply = document.querySelector(".calendar__button--apply");
  const buttonCancel = document.querySelector(".calendar__button--cancel");

  const options = document.querySelectorAll(".calendar__options-item");

  options.forEach((item) => {
    item.addEventListener("click", () => {
      options.forEach((li) => li.classList.remove("active"));
      item.classList.add("active");

      buttonApply.onclick = () => {
        const currentDay = date.getDate();
        const currentMonth = date.getMonth() + 1;
        const currentYear = date.getFullYear();

        const selectedDate = {
          day: currentDay,
          month: currentMonth,
          year: currentYear,
          dateObject: createDateObject(currentDay, currentMonth, currentYear),
        };

        resetSelectedDates(cells);

        cells.forEach((cell) => {
          const cellDay = parseInt(cell.innerHTML.trim(), 10);
          const cellMonth = parseInt(cell.dataset.month, 10);
          const cellYear = parseInt(cell.dataset.year, 10);
          const cellDateObject = createDateObject(cellDay, cellMonth, cellYear);

          switch (item.dataset.period) {
            case "today":
              if (
                cellDateObject.getTime() === selectedDate.dateObject.getTime()
              ) {
                cell.classList.add("active");
                selectedDates.push(selectedDate);

                console.log(
                  `Выбрана дата: ${selectedDates[0].day}/${selectedDates[0].month}/${selectedDates[0].year}`
                );
              }

              break;

            case "yesterday":
              const yesterday = new Date(
                currentYear,
                currentMonth - 1,
                currentDay - 1
              );
              if (cellDateObject.getTime() === yesterday.getTime()) {
                cell.classList.add("active");
                selectedDates.push({
                  day: yesterday.getDate(),
                  month: yesterday.getMonth() + 1,
                  year: yesterday.getFullYear(),
                  dateObject: yesterday,
                });
                console.log(
                  `Выбрана дата: ${selectedDates[0].day}/${selectedDates[0].month}/${selectedDates[0].year}`
                );
              }
              break;

            case "week":
              const weekStart = new Date(
                currentYear,
                currentMonth - 1,
                currentDay - 6
              );

              if (
                cellDateObject >= weekStart &&
                cellDateObject <= selectedDate.dateObject
              ) {
                cell.classList.add("active-cell");

                if (weekStart.getTime() === cellDateObject.getTime()) {
                  cell.classList.add("active");

                  const dateAlreadyExists = selectedDates.some(
                    (date) => date.dateObject.getTime() === weekStart.getTime()
                  );
                  if (!dateAlreadyExists) {
                    selectedDates.push({
                      day: weekStart.getDate(),
                      month: weekStart.getMonth() + 1,
                      year: weekStart.getFullYear(),
                      dateObject: weekStart,
                    });
                  }
                }

                if (
                  cellDateObject.getTime() === selectedDate.dateObject.getTime()
                ) {
                  cell.classList.add("active");

                  const dateAlreadyExists = selectedDates.some(
                    (date) =>
                      date.dateObject.getTime() ===
                      selectedDate.dateObject.getTime()
                  );
                  if (!dateAlreadyExists) {
                    selectedDates.push(selectedDate);
                  }
                }

                if (selectedDates.length === 2) {
                  const [startDate, endDate] = selectedDates;
                  console.log(
                    `Период: с ${startDate.day}/${startDate.month}/${startDate.year} по ${endDate.day}/${endDate.month}/${endDate.year}`
                  );
                }
              }
              break;

            case "month":
              const monthStart = new Date(
                currentYear,
                currentMonth - 1,
                currentDay - 29
              );

              if (
                cellDateObject >= monthStart &&
                cellDateObject <= selectedDate.dateObject
              ) {
                cell.classList.add("active-cell");

                if (monthStart.getTime() === cellDateObject.getTime()) {
                  cell.classList.add("active");

                  const dateAlreadyExists = selectedDates.some(
                    (date) => date.dateObject.getTime() === monthStart.getTime()
                  );
                  if (!dateAlreadyExists) {
                    selectedDates.push({
                      day: monthStart.getDate(),
                      month: monthStart.getMonth() + 1,
                      year: monthStart.getFullYear(),
                      dateObject: monthStart,
                    });
                  }
                }

                if (
                  cellDateObject.getTime() === selectedDate.dateObject.getTime()
                ) {
                  cell.classList.add("active");

                  const dateAlreadyExists = selectedDates.some(
                    (date) =>
                      date.dateObject.getTime() ===
                      selectedDate.dateObject.getTime()
                  );
                  if (!dateAlreadyExists) {
                    selectedDates.push(selectedDate);
                  }
                }

                if (selectedDates.length === 2) {
                  const [startDate, endDate] = selectedDates;
                  console.log(
                    `Период: с ${startDate.day}/${startDate.month}/${startDate.year} по ${endDate.day}/${endDate.month}/${endDate.year}`
                  );
                }
              }
              break;

            case "threeMonth":
              const threeMonthsAgo = new Date(
                currentYear,
                currentMonth - 1,
                currentDay - 89
              );
              if (
                cellDateObject >= threeMonthsAgo &&
                cellDateObject <= selectedDate.dateObject
              ) {
                cell.classList.add("active-cell");

                if (threeMonthsAgo.getTime() === cellDateObject.getTime()) {
                  cell.classList.add("active");

                  const dateAlreadyExists = selectedDates.some(
                    (date) =>
                      date.dateObject.getTime() === threeMonthsAgo.getTime()
                  );
                  if (!dateAlreadyExists) {
                    selectedDates.push({
                      day: threeMonthsAgo.getDate(),
                      month: threeMonthsAgo.getMonth() + 1,
                      year: threeMonthsAgo.getFullYear(),
                      dateObject: threeMonthsAgo,
                    });
                  }
                }

                if (
                  cellDateObject.getTime() === selectedDate.dateObject.getTime()
                ) {
                  cell.classList.add("active");

                  const dateAlreadyExists = selectedDates.some(
                    (date) =>
                      date.dateObject.getTime() ===
                      selectedDate.dateObject.getTime()
                  );
                  if (!dateAlreadyExists) {
                    selectedDates.push(selectedDate);
                  }
                }

                if (selectedDates.length === 2) {
                  const [startDate, endDate] = selectedDates;
                  console.log(
                    `Период: с ${startDate.day}/${startDate.month}/${startDate.year} по ${endDate.day}/${endDate.month}/${endDate.year}`
                  );
                }
              }
              break;

            case "beginningOfWork":
              /* Здесь логика на период с начала работы */
              break;
          }
        });
      };

      buttonCancel.addEventListener("click", () => {
        resetSelectedDates(cells);
        options.forEach((li) => li.classList.remove("active"));
      });
    });
  });
})();
