import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { TopicDetailsComponent } from '../topic-details/topic-details.component';

@Component({
  selector: 'app-topic-details-view',
  standalone: true,
  imports: [
    CommonModule,
    TopicDetailsComponent
  ],
  templateUrl: './topic-details-view.component.html',
  styleUrl: './topic-details-view.component.scss'
})
export class TopicDetailsViewComponent {
  topicId?: string;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.topicId = String(this.route.snapshot.paramMap.get('id'));
  }
  
  goBack(): void {
    this.location.back();
  }
}
