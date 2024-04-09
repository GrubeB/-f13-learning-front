import { Component, Input } from '@angular/core';
import { Group } from '../../group.model';

@Component({
  selector: 'group-list',
  standalone: true,
  imports: [],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss'
})
export class GroupListComponent {
  @Input() groups!: Group[];
  filtredGroups!:Group[];
}
