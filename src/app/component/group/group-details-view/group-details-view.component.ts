import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupDetailsComponent } from '../group-details/group-details.component';

@Component({
  selector: 'group-details-view',
  standalone: true,
  imports: [
    CommonModule,
    GroupDetailsComponent,
  ],
  templateUrl: './group-details-view.component.html',
  styleUrl: './group-details-view.component.scss'
})
export class GroupDetailsViewComponent {
  route = inject(ActivatedRoute);
  location = inject(Location);

  groupId?: string;

  ngOnInit(): void {
    this.groupId = String(this.route.snapshot.paramMap.get('id'));
  }

  goBack(): void {
    this.location.back();
  }
}
