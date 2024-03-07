import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WindowRef } from '../windowRef';

@Injectable({
    providedIn: 'root'
})
export class GlobalFeaturesService {
    someWidth: number = window.innerWidth;
    categoryNavigationMenu$ = new BehaviorSubject<boolean>(false);
    private winWidthSource = new BehaviorSubject(this.someWidth);
    currentWidth$ = this.winWidthSource.asObservable();

    constructor(private _windowRef: WindowRef) {
    }

    changeWidth(newValue: number) {
        this.winWidthSource.next(newValue);
        return newValue;
    }
}
