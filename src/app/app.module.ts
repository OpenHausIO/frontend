import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { ContentComponent } from './layout/content/content.component';
import { DashboardComponent } from './layout/content/dashboard/dashboard.component';
import { RoomOverviewComponent } from './layout/content/room-overview/room-overview.component';
import { DeviceOverviewComponent } from './layout/content/device-overview/device-overview.component';
import { SettingsComponent } from './layout/content/settings/settings.component';
import { AppearanceComponent } from './layout/content/appearance/appearance.component';
import { RoomComponent } from './layout/content/room/room.component';
import { PopupHostComponent } from './layout/popup-host/popup-host.component';
import { AddDevicePopupComponent } from './layout/popup-host/popups/add-device-popup/add-device-popup.component';
import { AddRoomPopupComponent } from './layout/popup-host/popups/add-room-popup/add-room-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconContainerComponent } from './shared/icon-container/icon-container.component'

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ContentComponent,
    DashboardComponent,
    RoomOverviewComponent,
    DeviceOverviewComponent,
    SettingsComponent,
    AppearanceComponent,
    RoomComponent,
    PopupHostComponent,
    AddDevicePopupComponent,
    AddRoomPopupComponent,
    NavbarComponent,
    IconContainerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
