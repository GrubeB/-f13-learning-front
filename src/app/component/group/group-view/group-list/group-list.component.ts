import { Component, Input } from '@angular/core';
import { Group } from '../../group.model';
import { GroupListItemComponent } from '../group-list-item/group-list-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'group-list',
  standalone: true,
  imports: [
    CommonModule,
    GroupListItemComponent,
  ],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss'
})
export class GroupListComponent {
  @Input() groups!: Group[];
  filtredGroups!:Group[];
}
