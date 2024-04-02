import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../../service/event-bus.service';
import { DeleteTopicEvent, ShowTopicItemContextMenuEvent } from '../../topic-module.event';
import { CommonModule } from '@angular/common';
import { OutsideClickDirective } from '../../../../../shared/directive/outside-click.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'topic-list-item-context-menu',
  standalone: true,
  imports: [
    CommonModule,
    OutsideClickDirective,
    RouterLink,
  ],
  templateUrl: './topic-list-item-context-menu.component.html',
})
export class TopicListItemContextMenuComponent implements AfterViewInit {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  topicId?: string;
  menuVisable: boolean = false;
  @ViewChild('container') container!: ElementRef;

  constructor(private elementRef: ElementRef) {
    this.eventBus.listen(ShowTopicItemContextMenuEvent.name, (event: ShowTopicItemContextMenuEvent) => {
      this.topicId = event.topicId;
      let width = this.container.nativeElement.offsetWidth;
      this.showMenu(event.posX - width, event.posY);
    })
  }

  ngAfterViewInit(): void {
    this.hideMenu();
  }

  showMenu(x: number, y: number) {
    this.logger.debug(TopicListItemContextMenuComponent.name, " showMenu()");
    this.container.nativeElement.style.left = `${x + 10}px`;
    this.container.nativeElement.style.top = `${y - 10}px`;
    this.menuVisable = true;
  }

  hideMenu() {
    this.logger.debug(TopicListItemContextMenuComponent.name, " hideMenu()");
    this.container.nativeElement.style.left = `-10000px`;
    this.container.nativeElement.style.top = `-10000px`;
    this.menuVisable = false;
  }
  
  emitDeleteTopicEvent() {
    if (this.topicId) {
      this.logger.debug(TopicListItemContextMenuComponent.name, " emitDeleteTopicEvent()");
      this.eventBus.emit(DeleteTopicEvent.name, new DeleteTopicEvent(this.topicId));
      this.hideMenu();
    }
  }
}
