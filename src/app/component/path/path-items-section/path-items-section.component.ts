import { Component, Input, OnInit, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { CommonModule } from '@angular/common';
import { SwitchButtonComponent } from '../../../shared/component/switch-button/switch-button.component';
import { mergeDeep } from '../../../shared/utils/merge';
import { PathTwoColumnDisplayComponent } from '../path-two-column-display/path-two-column-display.component';
import { Path } from '../path.model';

@Component({
  selector: 'path-items-section',
  standalone: true,
  imports: [
    CommonModule,
    SwitchButtonComponent,
    PathTwoColumnDisplayComponent,
  ],
  templateUrl: './path-items-section.component.html',
  styleUrl: './path-items-section.component.scss'
})
export class PathItemsSectionComponent implements OnInit {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  @Input() model!: Path;

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