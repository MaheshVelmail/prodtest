import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from 'app/shared/models/nav-item';
import { NavService } from 'app/shared/services/nav.service';
import * as $ from "jquery";

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})

export class MenuListItemComponent {
  expanded: boolean=false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(public navService: NavService,
              public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
     this.router.navigate([item.route]);
     $('.mat-list-item').removeClass('active1');
    $('div:contains('+item.displayName+')').closest('a').addClass('active1')
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }
}
