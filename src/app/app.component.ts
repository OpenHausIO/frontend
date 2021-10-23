import { Component, HostListener, OnInit } from '@angular/core';
import { ScreenInfoService, ScreenAspect, ScreenSize } from './services/screen-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'open-haus-io-frontend';
  screenAspect: ScreenAspect = ScreenAspect.Landscape;
  screenSize: ScreenSize = ScreenSize.Large;

  constructor (private screenInfoService: ScreenInfoService) { }

  ngOnInit(): void {
    this.screenInfoService.getScreenAspect().subscribe(screenAspect => {
      this.screenAspect = screenAspect;
    })
    this.screenInfoService.getScreenSize().subscribe(screenSize => {
      this.screenSize = screenSize;
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenInfoService.updateScreenInfo();
  }
}
