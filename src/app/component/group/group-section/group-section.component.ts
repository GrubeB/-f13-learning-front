import { Component, Input, OnInit, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { CommonModule } from '@angular/common';
import { SwitchButtonComponent } from '../../../shared/component/switch-button/switch-button.component';
import { mergeDeep } from '../../../shared/utils/merge';
import { GroupListComponent } from '../group-list/group-list.component';
import { Group } from '../group.model';

@Component({
  selector: 'group-section',
  standalone: true,
  imports: [
    CommonModule,
    SwitchButtonComponent,
    GroupListComponent,
  ],
  templateUrl: './group-section.component.html',
  styleUrl: './group-section.component.scss'
})
export class GroupSectionComponent implements OnInit {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  @Input() items!: Group[];

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