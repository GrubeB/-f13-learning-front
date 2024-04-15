import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { OutsideClickDirective } from '../../../shared/directive/outside-click.directive';
import { CommonModule } from '@angular/common';
import { TopicProgressService } from '../topic-progress.service';
import { Progress, ProgressType } from '../progress.model';
import { ProgressQueryService } from '../progress-query.service';
import { DomainObjectType } from '../../voting/vote.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractProgressService } from '../abstract-progress.service';

@Component({
  selector: 'progress-setter',
  standalone: true,
  imports: [
    OutsideClickDirective,
    CommonModule,
  ],
  templateUrl: './progress-setter.component.html',
  styleUrl: './progress-setter.component.scss'
})
export class ProgressSetComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  queryService = inject(ProgressQueryService);

  @Input() modelId!: string;
  @Input() progressService!: AbstractProgressService;
  _domainObjectType!: DomainObjectType;
  @Input() set domainObjectType(string: string) {
    this._domainObjectType = DomainObjectType[string as keyof typeof DomainObjectType];
  }
  @Input() allowTypes: ProgressType[] = [
    ProgressType.IN_PROGRESS,
    ProgressType.DONE,
    ProgressType.PLAN_TO_LEARN,
    ProgressType.ON_HOLD,
    ProgressType.DROPPED,
  ];
  @Input() visable: boolean = false;
  @Output() visableChange = new EventEmitter<boolean>();


  ngOnInit(): void {
    this.getProgress();
  }

  hideMenu() {
    this.logger.debug(ProgressSetComponent.name, " hideMenu()");
    this.visable = false;
    this.visableChange.emit(this.visable);
  }
  showMenu() {
    this.logger.debug(ProgressSetComponent.name, " showMenu()");
    this.visable = true;
    this.visableChange.emit(this.visable);
  }

  setProgress(string: string) {
    this.logger.debug(ProgressSetComponent.name, " setProgress()");
    let type = ProgressType[string as keyof typeof ProgressType]
    if (type) {
      this.progressService.setProgress(this.modelId, type);
    }
    this.hideMenu();
  }

  getColor(typeString?: string) {
    let type;
    if (typeString && typeString.length > 0) {
      type = ProgressType[typeString as keyof typeof ProgressType];
    }
    if (type == null && this.progress) {
      type = this.progress.type;
    }
    if (type) {
      switch (type) {
        case ProgressType.IN_PROGRESS: return "text-teal-50";
        case ProgressType.DONE: return "text-green-50";
        case ProgressType.PLAN_TO_LEARN: return "text-blue-50";
        case ProgressType.ON_HOLD: return "text-orange-50";
        case ProgressType.DROPPED: return "text-red-50";
      }
    }
    return "";
  }
  getDisplayText(typeString?: string) {
    let type;
    if (typeString && typeString.length > 0) {
      type = ProgressType[typeString as keyof typeof ProgressType];
    }
    if (type == null && this.progress) {
      type = this.progress.type;
    }
    if (type) {
      switch (type) {
        case ProgressType.IN_PROGRESS: return "In progress";
        case ProgressType.DONE: return "Done";
        case ProgressType.PLAN_TO_LEARN: return "Plan to learn";
        case ProgressType.ON_HOLD: return "On hold";
        case ProgressType.DROPPED: return "Dropped";
      }
    }
    return "Pending";
  }

  // VOTING
  progress?: Progress;
  getProgress() {
    this.logger.debug(ProgressSetComponent.name, "getProgress()");
    this.queryService.getByDomainObject(this._domainObjectType, this.modelId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => {
        this.progress = data;
      },
    });
  }
}
