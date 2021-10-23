import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation.service';
import { ScreenInfoService, ScreenSize } from 'src/app/services/screen-info.service';
import { Route } from 'src/app/shared/route.model';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public screenSize: ScreenSize = ScreenSize.Small;
  public routes: Route[] = [];
  public icon = faBars;

  private subsribtion: Subscription = Subscription.EMPTY;

  constructor(
    private screenInfoService: ScreenInfoService,
    private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.subsribtion = this.screenInfoService.getScreenSize()
      .subscribe(screenSize => {
        this.screenSize = screenSize;
      }
    );

    this.routes = this.navigationService.getRoutes();
  }

  ngOnDestroy(): void {
    this.subsribtion.unsubscribe();
  }
}
