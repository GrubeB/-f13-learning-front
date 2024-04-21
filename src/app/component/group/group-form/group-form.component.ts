import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { first, take } from 'rxjs';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { Category } from '../../category/category.model';
import { CategoryQueryService } from '../../category/category-query.service';
import { MultiSelectComponent } from '../../../shared/component/multi-select/multi-select.component';
import { GroupService } from '../group.service';
import { GroupQueryService } from '../group-query.service';
import { CreateGroupCommand, Group, UpdateGroupCommand } from '../group.model';
import { CreateGroupEvent, GroupCreatedEvent, GroupUpdateddEvent, UpdateGroupEvent } from '../group-module.event';
import { Topic } from '../../topic/topic.model';
import { TopicQueryService } from '../../topic/topic-query.service';

@Component({
  selector: 'group-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectComponent
  ],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.scss'
})
export class GroupFormComponent implements OnInit {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  groupService = inject(GroupService);
  groupQueryService = inject(GroupQueryService);
  categoryQueryService = inject(CategoryQueryService);
  topicQueryService = inject(TopicQueryService);

  message?: string;

  isEditForm: boolean = false;
  editModel?: Group;

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
    topics: new FormControl<Topic[]>([]),
    groups: new FormControl<Group[]>([]),
  });

  constructor() {
    this.eventBus.listen(CreateGroupEvent.name, (event: CreateGroupEvent) => {
      this.fillForm();
    });

    this.eventBus.listen(UpdateGroupEvent.name, (event: UpdateGroupEvent) => {
      this.groupQueryService.get(event.modelId).pipe(take(1)).subscribe({
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
  fillForm(model?: Group) {
    this.logger.debug(GroupFormComponent.name, " fillForm()", model)
    this.formGroup.reset();
    this.message = '';
    if (!model) {
      this.isEditForm = false;
      this.editModel = undefined;
      this.formGroup.setValue({
        name: "",
        content: "",
        categories: [],
        topics: [],
        groups: [],
      });
    } else {
      this.isEditForm = true;
      this.editModel = model;
      this.formGroup.setValue({
        name: this.editModel.name,
        content: this.editModel.content,
        categories: this.editModel.categories,
        topics: this.editModel.topics,
        groups: this.editModel.groups,
      });
    }
  }

  submit() {
    this.logger.debug(GroupFormComponent.name, "submit");
    if (this.formGroup.valid) {
      this.isEditForm ? this.update() : this.create();
    }
  }
  create() {
    let command = new CreateGroupCommand();
    command.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
    command.content = this.formGroup.value.content ? this.formGroup.value.content as string : '';
    command.categoryIds = this.formGroup.value.categories?.map(e => e['id']) as string[] ?? [];
    command.topicIds = this.formGroup.value.topics?.map(e => e['id']) as string[] ?? [];
    command.groupIds = this.formGroup.value.groups?.map(e => e['id']) as string[] ?? [];

    this.groupService.create(command)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(GroupFormComponent.name, " group created ", response.id);
          this.eventBus.emit(GroupCreatedEvent.name, new GroupCreatedEvent(response.id));
          this.fillForm();
        },
        error: e => {
          this.logger.debug(GroupFormComponent.name, " error occurred while creating group ", e);
          this.message = e.message;
        }
      });
  }
  update() {
    let command = new UpdateGroupCommand();
    command.id = this.editModel?.id ??  (() => { throw new Error("Edit model ID is null or undefined."); })();
    command.name = this.formGroup.value.name ? this.formGroup.value.name as string : '';
    command.content = this.formGroup.value.content ? this.formGroup.value.content as string : '';
    command.categoryIds = this.formGroup.value.categories?.map(cat => cat['id']) as string[] ?? [];
    command.topicIds = this.formGroup.value.topics?.map(e => e['id']) as string[] ?? [];
    command.groupIds = this.formGroup.value.groups?.map(e => e['id']) as string[] ?? [];

    this.groupService.update(command)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(GroupFormComponent.name, " group updated ", command.id);
          this.eventBus.emit(GroupUpdateddEvent.name, new GroupUpdateddEvent(command.id));
          this.fillForm();
        },
        error: e => {
          this.logger.debug(GroupFormComponent.name, " error occurred while updateing group ", e);
          this.message = e.message;
        }
      });
  }
}
