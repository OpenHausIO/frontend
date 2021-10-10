import { Component, Input, OnInit } from '@angular/core';
import { SidebarEntriesContainer, SidebarEntry } from './sidebar-entries.model';

@Component({
  selector: 'app-sidebar-entries',
  templateUrl: './sidebar-entries.component.html',
  styleUrls: ['./sidebar-entries.component.css']
})
export class SidebarEntriesComponent implements OnInit {

  @Input() route!: SidebarEntriesContainer;

  constructor() { }

  ngOnInit(): void {
  }

}
