import { Injectable, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { faDoorClosed, faFilm, faHouseUser, faMobileAlt, faPlug } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Route } from '../shared/route.model';

const ROUTES: Route[] = [
  new Route('Dashboard', faHouseUser, '/dashboard'),
  new Route('Rooms', faDoorClosed, '/rooms'),
  new Route('Devices', faMobileAlt, '/devices'),
  new Route('Scenes', faFilm, '/scenes'),
  new Route('Plugins', faPlug, '/plugins')
];

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart)
        for (let route of ROUTES) {
          route.active = route.destination === event.url;
        }
    });
  }

  public getRoutes(): Route[] {
    return ROUTES;
  }
}
