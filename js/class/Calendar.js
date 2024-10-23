class Calendar {
  constructor(year) {
    this.year = year;
  }

  isLeapYear() {
    return (
      (this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0
    );
  }
}
