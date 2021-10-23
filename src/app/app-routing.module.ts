import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppearanceComponent } from './layout/content/appearance/appearance.component';
import { DashboardComponent } from './layout/content/dashboard/dashboard.component';
import { DeviceOverviewComponent } from './layout/content/device-overview/device-overview.component';
import { RoomOverviewComponent } from './layout/content/room-overview/room-overview.component';
import { RoomComponent } from './layout/content/room/room.component';
import { SettingsComponent } from './layout/content/settings/settings.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'rooms', component: RoomOverviewComponent },
  { path: 'rooms/:id', component: RoomComponent },
  { path: 'devices', component: DeviceOverviewComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'appearance', component: AppearanceComponent },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
