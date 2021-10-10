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
import { SidebarEntriesComponent } from './layout/sidebar/sidebar-entries/sidebar-entries.component';
import { ContentComponent } from './layout/content/content.component';
import { DashboardComponent } from './layout/content/dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { RoomOverviewComponent } from './layout/content/room-overview/room-overview.component';
import { DeviceOverviewComponent } from './layout/content/device-overview/device-overview.component';
import { SettingsComponent } from './layout/content/settings/settings.component';
import { AppearanceComponent } from './layout/content/appearance/appearance.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SidebarEntriesComponent,
    ContentComponent,
    DashboardComponent,
    RoomOverviewComponent,
    DeviceOverviewComponent,
    SettingsComponent,
    AppearanceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
