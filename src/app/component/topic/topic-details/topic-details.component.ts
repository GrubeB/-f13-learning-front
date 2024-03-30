import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Topic } from '../../../model/topic.model';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../../../service/topic.service';
import { take } from 'rxjs';

@Component({
  selector: 'topic-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './topic-details.component.html',
  styleUrl: './topic-details.component.scss'
})
export class TopicDetailsComponent implements OnInit {
  @Input() topicId!: string;

  topic?: Topic;

  constructor(
    private topicService: TopicService
  ) { }

  ngOnInit(): void {
    this.getTopic(this.topicId);
  }

  getTopic(id: string): void {
    this.topicService.get(id).pipe(take(1)).subscribe({
      next: data => {
        this.topic = data;
      },
      error: e => {
      }
    });
  }
}
