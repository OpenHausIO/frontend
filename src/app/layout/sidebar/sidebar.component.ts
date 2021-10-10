import { Component, OnInit } from '@angular/core';
import { SidebarEntriesContainer, SidebarEntry } from './sidebar-entries/sidebar-entries.model';

const NAVIGATION_CONTAINER: SidebarEntriesContainer = new SidebarEntriesContainer('NAVIGATION', [
  new SidebarEntry('Dashboard', 'bi bi-house', '/dashboard')])
const SETTINGS_CONTAINER: SidebarEntriesContainer = new SidebarEntriesContainer('SETTINGS', [
  new SidebarEntry('Settings', 'bi bi-gear', '/settings'),
  new SidebarEntry('Appearance', 'bi bi-brush', '/appearance')])
  

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  public containers: SidebarEntriesContainer[] = [];

  constructor() {
    this.containers.push(NAVIGATION_CONTAINER);
    this.containers.push(this.getRooms());
    this.containers.push(this.getDevices());
    this.containers.push(SETTINGS_CONTAINER);
  }

  private getRooms(): SidebarEntriesContainer {
    return new SidebarEntriesContainer('ROOMS', [new SidebarEntry('Room Overview', 'bi bi-door-closed', '/rooms')])
  }

  private getDevices(): SidebarEntriesContainer {
    return new SidebarEntriesContainer('DEVICES', [new SidebarEntry('Device Overview', 'bi bi-cpu', '/devices')])
  }

  ngOnInit(): void {
  }
}
