class Month extends Calendar {
  constructor(year, month) {
    super(year);
    this.month = month;
  }

  getDaysInMonth() {
    const daysInMonth = [
      31,
      this.isLeapYear() ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    return daysInMonth[this.month - 1];
  }

  generateDates() {
    const daysInMonth = this.getDaysInMonth();
    const dates = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this.year, this.month - 1, day);
      dates.push({
        day: date.getDate(),
        month: this.month,
        year: this.year,
        dayOfWeek: date.getDay(),
      });
    }

    return dates;
  }

  generateHTML() {
    const monthNames = [
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
    const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    const dates = this.generateDates();

    let html = `<div class="calendar__month hide">
      <h4 class="calendar__month-title">${monthNames[this.month - 1]} ${
      this.year
    }</h4>
      <table class="calendar__days">
        <thead>
          <tr class="calendar__days-row">`;

    daysOfWeek.forEach((day) => {
      html += `<th class="calendar__days-header">${day}</th>`;
    });

    html += `</tr></thead><tbody><tr class="calendar__days-row">`;

    const firstDay = (dates[0].dayOfWeek + 6) % 7;
    for (let i = 0; i < firstDay; i++) {
      html += `<td class="calendar__day" ></td>`;
    }

    dates.forEach((date, index) => {
      html += `<td class="calendar__day" data-month="${date.month}" data-year="${date.year}">${date.day}</td>`;

      if ((firstDay + index + 1) % 7 === 0) {
        html += `</tr><tr class="calendar__days-row">`;
      }
    });

    html += `</tr></tbody></table></div>`;

    return html;
  }
}
