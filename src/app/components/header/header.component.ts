import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { GlobalFeaturesService } from "../../services/global-features.service";
import { NasaSearchService } from "../../services/nasa.service";

@Component({
    selector: "nasa-pod-header",
    templateUrl: "header.component.html",
    styleUrls: ["header.component.scss"]
})
export class NasaHeaderComponent implements AfterViewInit, OnDestroy {
    windowWidth!: number;
    currentDate: any;
    months: any[] = [
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
    year!: number;
    month!: number;
    day!: number;
    title?: string;
    fullDate: any = null;
    private unsubscribe$ = new Subject<void>();

    constructor(
        private _searchService: NasaSearchService,
        private _globalFeatures: GlobalFeaturesService,
        private _cd: ChangeDetectorRef
    ) {
    }

    ngAfterViewInit() {
        this._searchService.chosenDateValue$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((currentVal) => {
                this.currentDate = currentVal;
                this.year = this.currentDate.year;
                this.month = this.currentDate.month;
                this.day = this.currentDate.day;
            });

        this._searchService.chosenMedia$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((currentVal: any) => {
                // Null Check
                currentVal ? (this.title = currentVal.title) : "";
            });

        this._globalFeatures.currentWidth$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((currentVal) => {
                this.windowWidth = currentVal;
            });
        this._cd.detectChanges();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
