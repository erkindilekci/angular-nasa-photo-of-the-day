import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { NasaSearchService } from "../../services/nasa.service";

@Component({
    selector: "[app-calendar]",
    templateUrl: "./date-picker.component.html",
    styleUrls: ["./date-picker.component.scss"]
})
export class CalendarComponent implements OnInit, OnDestroy {
    calendarVisible: boolean = false;
    d: any = new Date();
    weekdays: readonly string[] = ["S", "M", "T", "W", "T", "F", "S"];
    months: readonly string[] = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    years: readonly number[] = [
        1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007,
        2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
        2020, 2021, 2022, 2023
    ];
    year: any = this.d.getFullYear();
    monthIndex: any = this.d.getMonth();
    currentDay: any = this.d.getDate();
    monthsMenu: boolean = false;
    yearsMenu: boolean = false;
    selectedDate: number = 0;
    currentDate: any = 1;
    daySpan: any[] = [];
    firstDay: any;
    lastDay: any;
    private unsubscribe$ = new Subject<void>();

    constructor(private _nasa: NasaSearchService) {
    }

    ngOnInit() {
        this.firstLastDays();
        this.updateServiceDate();
        this._nasa.dataPickerCurrentVal
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((currentVal) => {
                this.calendarVisible = currentVal;
            });
    }

    calculateStartEndDate(firstDayOfMonth: number, lastDayOfMonth: number) {
        this.daySpan = [];
        let dayIndex = 1,
            emptyCells = 0;
        for (let i = 0; i < 42; i++) {
            if (firstDayOfMonth > i) emptyCells++;
            this.daySpan.push({
                value:
                    i >= firstDayOfMonth && i < emptyCells + lastDayOfMonth
                        ? dayIndex++
                        : null
            });
        }
    }

    onResize($event: any) {
        this._nasa.changeDatePickerVal(false);
        this.calendarVisible = false;
    }

    firstLastDays() {
        this.firstDay = new Date(this.year, this.monthIndex, 1);
        this.lastDay = new Date(this.year, this.monthIndex + 1, 0);
        this.calculateStartEndDate(this.firstDay.getDay(), this.lastDay.getDate());
    }

    selectYear(i: number) {
        this.year = i;
        this.firstLastDays();
        this.checkForFutureDate(this.year, this.monthIndex, this.currentDay);
    }

    selectMonth(i: number) {
        this.monthIndex = i;
        this.firstLastDays();
        this.checkForFutureDate(this.year, this.monthIndex + 1, this.currentDay);
    }

    selectDay(i: number) {
        this.currentDay = i;
        this.currentDay = this.currentDay.value;
        this.checkForFutureDate(this.year, this.monthIndex, this.currentDay);
        this._nasa.changeDatePickerVal(true);
    }

    updateServiceDate() {
        const date = new Date(
            `${this.year}-${this.monthIndex + 1}-${this.currentDay}`
        );
        const timestamp = date.getTime();
        this._nasa.fetchData(timestamp);
    }

    openCalendar() {
        this.calendarVisible = true;
        this._nasa.changeDatePickerVal(true);
    }

    closeCalendar() {
        this.calendarVisible = false;
    }

    showMonths() {
        this.monthsMenu = !this.monthsMenu;
        this.yearsMenu = false;
    }

    showYears() {
        this.yearsMenu = !this.yearsMenu;
        this.monthsMenu = false;
    }

    checkForFutureDate(y: number, m: number, d: number) {
        this.selectedDate = new Date(y, m, d).getTime();
        this.currentDate = new Date().getTime();
        if (this.currentDate > this.selectedDate) {
            this.updateServiceDate();
        }
    }

    getValue() {
        let returnValue;
        if (this.currentDate === "") {
            returnValue = "Calendar Inactive";
        }
        if (this.currentDate > this.selectedDate) {
            returnValue =
                this.months[this.monthIndex] + " " + this.currentDay + ", " + this.year;
        }
        if (this.currentDate < this.selectedDate) {
            returnValue = "Future Date";
        }
        return returnValue;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
