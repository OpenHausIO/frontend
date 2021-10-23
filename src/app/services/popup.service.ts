import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  
  private readonly popupRequested: Subject<string> = new Subject<string>();

  constructor() { }

  requestPopup(id: string) {
    this.popupRequested.next(id);
  }

  getRequestedPopups(): Observable<string> {
    return this.popupRequested.asObservable();
  }
}
