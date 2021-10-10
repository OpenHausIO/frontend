import { Component, Input, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SidebarEntriesContainer, SidebarEntry } from './sidebar-entries.model';

@Component({
  selector: 'app-sidebar-entries',
  templateUrl: './sidebar-entries.component.html',
  styleUrls: ['./sidebar-entries.component.css']
})

export class SidebarEntriesComponent implements OnInit {

  @Input() container!: SidebarEntriesContainer;

  constructor(private router: Router) { 
    router.events.subscribe(event => {
      if (event instanceof NavigationStart)
        for (let entry of this.container.entries) {
          if (entry.destination === event.url) {
            entry.active = true;
          } else {
            entry.active = false;
          }
        }
    })
  }

  ngOnInit(): void {
  }

}
