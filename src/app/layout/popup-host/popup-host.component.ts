import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PopupService } from 'src/app/services/popup.service';
import { PopupAtlas } from './popup-atlas';
import { AddRoomPopupComponent } from './popups/add-room-popup/add-room-popup.component';

@Component({
  selector: 'app-popup-host',
  templateUrl: './popup-host.component.html',
  styleUrls: ['./popup-host.component.css']
})
export class PopupHostComponent implements OnInit, OnDestroy {

  private subscribtion: Subscription = Subscription.EMPTY;

  constructor(
    public dialog: MatDialog,
    private popupService: PopupService
  ) { }

  ngOnInit(): void {
    this.subscribtion = this.popupService.getRequestedPopups()
      .subscribe(id => {
        for(let popup of PopupAtlas.popups) {
          if (id === popup.id) this.dialog.open(popup.component);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }
}
