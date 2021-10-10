import { Component, OnInit } from '@angular/core';
import { SidebarEntriesContainer, SidebarEntry } from './sidebar-entries/sidebar-entries.model';

const NAVIGATION_ROUTE: SidebarEntriesContainer = new SidebarEntriesContainer('NAVIGATION', [
  new SidebarEntry('Dashboard', 'bi bi-house', 'test')])
const SETTINGS_ROUTE: SidebarEntriesContainer = new SidebarEntriesContainer('SETTINGS', [
  new SidebarEntry('Settings', 'bi bi-gear', 'test'),
  new SidebarEntry('Appearance', 'bi bi-brush', 'test')])
  

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  public routes: SidebarEntriesContainer[] = [];

  constructor() {
    this.routes.push(NAVIGATION_ROUTE);
    this.routes.push(this.getRooms());
    this.routes.push(this.getDevices());
    this.routes.push(SETTINGS_ROUTE);
  }

  private getRooms(): SidebarEntriesContainer {
    return new SidebarEntriesContainer('ROOMS', [new SidebarEntry('Room Overview', 'bi bi-door-closed', '')])
  }

  private getDevices(): SidebarEntriesContainer {
    return new SidebarEntriesContainer('DEVICES', [new SidebarEntry('Device Overview', 'bi bi-cpu', '')])
  }

  ngOnInit(): void {
  }

}
