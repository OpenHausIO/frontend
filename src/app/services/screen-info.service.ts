import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ScreenAspect {
  Landscape = 'Landscape',
  Portrait = 'Portrait'
};

export enum ScreenSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large'
}

@Injectable({
  providedIn: 'root'
})
export class ScreenInfoService
{
  screenAspect: BehaviorSubject<ScreenAspect> = new BehaviorSubject<ScreenAspect>(ScreenAspect.Landscape);
  screenSize: BehaviorSubject<ScreenSize> = new BehaviorSubject<ScreenSize>(ScreenSize.Small);

  constructor() {
    this.updateScreenInfo();
  }

  public updateScreenInfo(): void {
    if (window.innerWidth > window.innerHeight) {
      this.screenAspect.next(ScreenAspect.Landscape);
    } else {
      this.screenAspect.next(ScreenAspect.Portrait);
    }

    let min = Math.min(window.innerWidth, window.innerHeight);

    if (min < 720) {
      this.screenSize.next(ScreenSize.Small);
    } else if (min < 1080) {
      this.screenSize.next(ScreenSize.Medium);
    } else {
      this.screenSize.next(ScreenSize.Large);
    }
  }

  public getScreenAspect(): Observable<ScreenAspect> {
    return this.screenAspect.asObservable();
  }

  public getScreenSize(): Observable<ScreenSize> {
    return this.screenSize.asObservable();
  }
}
