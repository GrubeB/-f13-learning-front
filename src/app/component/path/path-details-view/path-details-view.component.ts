import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { PathDetailsComponent } from '../path-details/path-details.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'path-details-view',
  standalone: true,
  imports: [
    CommonModule,
    PathDetailsComponent,
  ],
  templateUrl: './path-details-view.component.html',
  styleUrl: './path-details-view.component.scss'
})
export class PathDetailsViewComponent {
  route = inject(ActivatedRoute);
  location = inject(Location);

  modelId?: string;

  ngOnInit(): void {
    this.modelId = String(this.route.snapshot.paramMap.get('id'));
  }

  goBack(): void {
    this.location.back();
  }
}
