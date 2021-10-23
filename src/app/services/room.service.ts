import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { retry, share, switchMap } from 'rxjs/operators';
import { Room } from '../shared/room.model';

const INTERVAL: number = 60000; 

@Injectable({
  providedIn: 'root'
})

export class RoomService implements OnDestroy {
  private subscribtion: Subscription = Subscription.EMPTY;
  private rooms: Room[] = [];
  private roomsUpdated: BehaviorSubject<Room[]> = new BehaviorSubject<Room[]>([]);

  constructor(private http: HttpClient) {
    this.subToPollRooms();
  }

  public getRooms(): Observable<Room[]> {
    return this.roomsUpdated;
  }

  private subToPollRooms(): void {
    this.subscribtion = timer(0, INTERVAL).pipe(
      switchMap(() => this.http.get('http://localhost:8080/api/rooms', {
        params: { limit: 100, offset: 0 }
      })),
      retry(),
      share()
    ).subscribe(result => {
      let fetchedRooms = Object.entries(result);
      if (!this.roomsEqual(fetchedRooms)) {
        this.rooms = fetchedRooms.map(room => new Room(
          room[1]._id, 
          room[1].name,
          room[1].number,
          room[1].floor,
          room[1].icon,
          room[1].timestamps)
        )
        this.roomsUpdated.next(this.rooms);
      }
    });
  }

  private roomsEqual(fetchedRooms: [string, any][]): boolean {
    if (fetchedRooms.length !== this.rooms.length) {
      return false;
    }

    for (let i = 0; i < fetchedRooms.length; i++) {
      if (fetchedRooms[i][1]._id !== this.rooms[i]._id) {
        
        return false;
      }
    }

    return true;
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }
}
