import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { first, take } from 'rxjs';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { Category } from '../../category/category.model';
import { CategoryQueryService } from '../../category/category-query.service';
import { MultiSelectComponent } from '../../../shared/component/multi-select/multi-select.component';
import { Topic } from '../../topic/topic.model';
import { TopicQueryService } from '../../topic/topic-query.service';
import { GroupService } from '../../group/group.service';
import { GroupQueryService } from '../../group/group-query.service';
import { CreatePathCommand, CreatePathItemCommand, ItemEntityType, ItemType, Path, UpdatePathCommand, UpdatePathItemCommand } from '../path.model';
import { Group } from '../../group/group.model';
import { CreatePathEvent, PathCreatedEvent, PathUpdateddEvent, UpdatePathEvent } from '../path-module.event';
import { PathQueryService } from '../path-query.service';
import { Config as TieredSelectComponentConfig, TieredSelectComponent, TieredSelectValue } from '../../../shared/component/tiered-select/tiered-select.component';
import { PathService } from '../path.service';

@Component({
  selector: 'path-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectComponent,
    TieredSelectComponent,
  ],
  templateUrl: './path-form.component.html',
  styleUrl: './path-form.component.scss'
})
export class PathFormComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);

  pathService = inject(PathService);
  pathQueryService = inject(PathQueryService);
  groupQueryService = inject(GroupQueryService);
  categoryQueryService = inject(CategoryQueryService);
  topicQueryService = inject(TopicQueryService);

  message?: string;

  isEditForm: boolean = false;
  editModel?: Path;

  allCategories: Category[] = [];
  allTopics: Topic[] = [];
  allGroups: Group[] = [];

  formGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    content: new FormControl('', [
    ]),
    categories: new FormControl<Category[]>([]),
    items: new FormArray<FormControl>([]),
  });

  constructor() {
    this.eventBus.listen(CreatePathEvent.name, (event: CreatePathEvent) => {
      this.fillForm();
    });

    this.eventBus.listen(UpdatePathEvent.name, (event: UpdatePathEvent) => {
      this.pathQueryService.get(event.modelId).pipe(take(1)).subscribe({
        next: data => this.fillForm(data)
      });
    });
  }

  ngOnInit(): void {
    this.categoryQueryService.getAll().pipe(first()).subscribe({
      next: data => {
        this.allCategories = data.content;
      }
    });
    this.groupQueryService.getAll().pipe(first()).subscribe({
      next: data => {
        this.allGroups = data.content;
      }
    });
    this.topicQueryService.getAll().pipe(first()).subscribe({
      next: data => {
        this.allTopics = data.content;
      }
    });
  }

  fillForm(path?: Path) {
    this.logger.debug(PathFormComponent.name, " fillForm()", path)
    this.formGroup.reset();
    this.message = '';
    this.formGroup.controls.items.clear();
    if (!path) {
      this.isEditForm = false;
      this.editModel = undefined;
      this.formGroup.setValue({
        name: "",
        content: "",
        categories: [],
        items: []
      });
    } else {
      this.isEditForm = true;
      this.editModel = path;
      let items = [
        ...this.editModel.topics.map(topicItem => new TieredSelectValue('Topic', topicItem.entity)),
        ...this.editModel.groups.map(groupItem => new TieredSelectValue('Group', groupItem.entity))
      ];
      this.formGroup.controls.items.clear();
      this.addItemControl(items.length);
      this.formGroup.setValue({
        name: this.editModel.name,
        content: this.editModel.content,
        categories: this.editModel.categories,
        items: items,
      });
    }
  }

  addItemControl(numberOfControllers: number = 1) {
    for (let index = 0; index < numberOfControllers; index++) {
      this.formGroup.controls.items.push(new FormControl(''));
    }
  }
  removeItemControl(index: number) {
    this.formGroup.controls.items.removeAt(index);
  }
  submit() {
    this.logger.debug(PathFormComponent.name, "submit", this.formGroup.value);
    if (this.formGroup.valid) {
      this.isEditForm ? this.update() : this.create();
    }
  }
  create() {
    let command = new CreatePathCommand();
    command.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
    command.content = this.formGroup.value.content ? this.formGroup.value.content as string : '';
    command.categoryIds = this.formGroup.value.categories?.map(e => e['id']) as string[] ?? [];
    let items = [];
    if (this.formGroup.value.items) {
      let nextNumber = 0;
      for (let index = 0; index < this.formGroup.value.items.length; index++) {
        let item = this.formGroup.value.items[index] as TieredSelectValue;
        if (item) {
          let itemCommand = new CreatePathItemCommand();
          itemCommand.number = nextNumber;
          nextNumber = nextNumber + 1;
          itemCommand.type = ItemType.MANDATORY;
          itemCommand.entityType = item.groupId === 'Topic' ? ItemEntityType.TOPIC : ItemEntityType.GROUP;
          itemCommand.entityId = item.item['id'];
          items.push(itemCommand);
        }
      }
    }
    command.items = items;
    this.logger.debug(PathFormComponent.name, " create() ", command);
    this.pathService.create(command)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(PathFormComponent.name, " path created ", response.id);
          this.eventBus.emit(PathCreatedEvent.name, new PathCreatedEvent(response.id));
          this.fillForm();
        },
        error: e => {
          this.logger.debug(PathFormComponent.name, " error occurred while creating path ", e);
          this.message = e.message;
        }
      });
  }
  update() {
    let command = new UpdatePathCommand();
    command.pathId = this.editModel?.id ?? (() => { throw new Error("Edit model ID is null or undefined."); })();
    command.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
    command.content = this.formGroup.value.content ? this.formGroup.value.content as string : '';
    command.categoryIds = this.formGroup.value.categories?.map(e => e['id']) as string[] ?? [];
    let items = [];
    if (this.formGroup.value.items) {
      let nextNumber = 0;
      for (let index = 0; index < this.formGroup.value.items.length; index++) {
        let item = this.formGroup.value.items[index] as TieredSelectValue;
        if (item) {
          let itemCommand = new UpdatePathItemCommand();
          itemCommand.number = nextNumber;
          nextNumber = nextNumber + 1;
          itemCommand.type = ItemType.MANDATORY;
          itemCommand.entityType = item.groupId === 'Topic' ? ItemEntityType.TOPIC : ItemEntityType.GROUP;
          itemCommand.entityId = item.item['id'];
          items.push(itemCommand);
        }
      }
    }
    command.items = items;
    this.logger.debug(PathFormComponent.name, " update() ", command);
    this.pathService.update(command)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(PathFormComponent.name, " path updated ", command.pathId);
          this.eventBus.emit(PathUpdateddEvent.name, new PathUpdateddEvent(command.pathId));
          this.fillForm();
        },
        error: e => {
          this.logger.debug(PathFormComponent.name, " error occurred while updating path ", e);
          this.message = e.message;
        }
      });
  }
}
