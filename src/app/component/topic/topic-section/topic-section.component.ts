import { Component, Input, OnInit, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { CommonModule } from '@angular/common';
import { SwitchButtonComponent } from '../../../shared/component/switch-button/switch-button.component';
import { mergeDeep } from '../../../shared/utils/merge';
import { Topic } from '../topic.model';
import { TopicListComponent } from '../topic-list/topic-list.component';

@Component({
  selector: 'topic-section',
  standalone: true,
  imports: [
    CommonModule,
    SwitchButtonComponent,
    TopicListComponent,
  ],
  templateUrl: './topic-section.component.html',
  styleUrl: './topic-section.component.scss'
})
export class TopicSectionComponent implements OnInit{
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  @Input() items!: Topic[];

  ngOnInit(): void {
    this.contentHidden = this._config.contentHidden;
  }

  // HIDDE CONTENT
  contentHidden!: boolean;

 // CONFIG
  @Input() set config(config: any) {
    this._config = mergeDeep(this._config, config);
  }
  _config: Config = {
    contentHidden: false,
  }
}

class Config {
  contentHidden!: boolean;
}