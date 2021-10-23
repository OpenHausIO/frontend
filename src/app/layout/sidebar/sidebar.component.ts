import { Component, OnDestroy, OnInit } from '@angular/core';
import { faAngleDoubleLeft, faAngleDoubleRight, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavigationService } from 'src/app/services/navigation.service';
import { Route } from 'src/app/shared/route.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit, OnDestroy {

  public collapsed: boolean = false;
  public routes: Route[] = [];
  public expandIcon = faAngleDoubleLeft;
  public userIcon = faUser;

  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.routes = this.navigationService.getRoutes();
  }

  ngOnDestroy(): void {
  }

  onCollapse(): void {
    this.collapsed = !this.collapsed;
    this.expandIcon = this.collapsed ? faAngleDoubleRight : faAngleDoubleLeft;
  }
}
