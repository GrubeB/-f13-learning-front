import { Component, Input } from '@angular/core';

@Component({
  selector: 'path-two-column-display-topic',
  standalone: true,
  imports: [],
  templateUrl: './path-two-column-display-topic.component.html',
  styleUrl: './path-two-column-display-topic.component.scss'
})
export class PathTwoColumnDisplayTopicComponent {
  @Input() model!: any;
}
