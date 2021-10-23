import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupService } from 'src/app/services/popup.service';
import { RoomService } from 'src/app/services/room.service';
import { Room } from 'src/app/shared/room.model';

const ADD_ROOM_POPUP_ID: string = 'add_room_popup';

@Component({
  selector: 'app-room-overview',
  templateUrl: './room-overview.component.html',
  styleUrls: ['./room-overview.component.css']
})

export class RoomOverviewComponent implements OnInit, OnDestroy {

  private subscribtion: Subscription = Subscription.EMPTY;
  public rooms: Room[] = []

  constructor(
    private popupService: PopupService,
    private roomService: RoomService) { }

  ngOnInit(): void {
    this.subscribtion = this.roomService.getRooms()
      .subscribe(rooms => {
        this.rooms = rooms;
      }
    );
  }

  public onButtonClick(): void {
    this.popupService.requestPopup(ADD_ROOM_POPUP_ID);
    console.log('popup requested')
  }

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }
}
