import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { GlobalFeaturesService } from "src/app/services/global-features.service";
import { NasaSearchService } from "../../services/nasa.service";

@Component({
    selector: "[nasa-photo-body]",
    templateUrl: "photo-body.component.html",
    styleUrls: ["photo-body.component.scss"]
})
export class NasaPhotoBodyComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @Output() outputData = new EventEmitter();
    categoryMenuStatus: boolean | undefined;
    fullExplanation: boolean = false;
    datePickerStatus: boolean | undefined;
    explanation?: string = "";
    searchQuery: any[] = [];
    backgroundImage: string | undefined;
    result: any[] = [];
    videoURL: string | undefined;
    mediaType?: string;
    private unsubscribe$ = new Subject<void>();

    constructor(
        private _nasa: NasaSearchService,
        private _cd: ChangeDetectorRef,
        private _globalFeatures: GlobalFeaturesService
    ) {
    }

    ngOnInit(): void {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
    }

    ngAfterViewInit() {
        this._nasa.chosenMedia$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((currentVal: any) => {
                if (currentVal) {
                    this.explanation = currentVal.explanation;
                    this.backgroundImage = currentVal.url;
                    this.mediaType = currentVal.media_type;
                    this.mediaType === "video" ? this.createURL(currentVal) : "";
                    Object.keys(currentVal).length > 0
                        ? this.result.push(currentVal)
                        : "";
                }
            });

        this._nasa.dataPickerCurrentVal
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((currentVal) => {
                this.datePickerStatus = currentVal;
                this.shareData();
            });

        this._globalFeatures.categoryNavigationMenu$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((val) => {
                val ? (this.fullExplanation = false) : "";
            });

        this._cd.detectChanges();
    }

    createURL(val: any) {
        const url = val.url;
        const startStr = url.search("embed");
        const endStr = url.search("/?rel");
        this.videoURL = url.slice(startStr + 6, endStr - 1);
    }

    getUrl() {
        return "url('" + this.backgroundImage + "')";
    }

    shareData() {
        this.outputData.emit(this.result);
    }

    closeCalendar() {
        this._nasa.changeDatePickerVal(false);
    }

    showText() {
        this.fullExplanation = !this.fullExplanation;
        this._nasa.changeDatePickerVal(false);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
