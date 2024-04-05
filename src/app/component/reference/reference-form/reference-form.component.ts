import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Reference } from '../reference.model';
import { first, take } from 'rxjs';
import { TopicReferenceService } from '../topic-reference.service';
import { EventBusService } from '../../../service/event-bus.service';
import { CreateReferenceEvent, ReferenceCreatedEvent, ReferenceUpdatedEvent, UpdateReferenceEvent } from '../reference-module.event';
import { MultiSelectComponent } from '../../../../shared/multi-select/multi-select.component';
import { ReferenceQueryService } from '../reference-query.service';

@Component({
  selector: 'reference-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectComponent
  ],
  templateUrl: './reference-form.component.html',
  styleUrl: './reference-form.component.scss'
})
export class ReferenceCreateFormComponent {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  referenceQueryService = inject(ReferenceQueryService);
  referenceService = inject(TopicReferenceService);

  @Input() topicId!: string;

  message?: string;

  isEditForm: boolean = false;
  editReference?: Reference;

  formGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      // Validators.minLength(8)
    ]),
    description: new FormControl('', [
      // Validators.required,
      // Validators.minLength(8)
    ]),
    author: new FormControl('', [
      // Validators.required
    ]),
    publicationDate: new FormControl('', [
      // Validators.required
    ]),
    link: new FormControl('', [
      // Validators.required
    ]),
  });

  constructor(){
    this.eventBus.listen(CreateReferenceEvent.name, (event: CreateReferenceEvent) => {
      this.isEditForm = false;
      this.formGroup.setValue({
        title: '',
        description:  '',
        author:  '',
        publicationDate: '',
        link: '',
      });
      this.formViable ? this.hideForm() : this.showForm();
    });

    this.eventBus.listen(UpdateReferenceEvent.name, (event: UpdateReferenceEvent) => {
      this.isEditForm = true;
      this.referenceQueryService.get(event.referenceId).pipe(take(1)).subscribe({
        next: data => {
          this.editReference = data;
          this.formGroup.setValue({
            title: this.editReference?.title ?? "",
            description: this.editReference?.description ?? "",
            author: this.editReference?.author ?? "",
            publicationDate: '', //TODO
            link: this.editReference?.link ?? "",
          });
          this.showForm();
        }
      })
    });
  }
  submit() {
    this.logger.debug(ReferenceCreateFormComponent.name, "submit");
    if (this.formGroup.valid) {
      this.isEditForm ? this.update() : this.create();
    }
  }

  create() {
    let reference = new Reference();
    reference.title = this.formGroup.value.title ? this.formGroup.value.title as string : '';
    reference.description = this.formGroup.value.description ? this.formGroup.value.description as string : '';
    reference.author = this.formGroup.value.author ? this.formGroup.value.author as string : '';
    reference.publicationDate = this.formGroup.value.publicationDate ? new Date(this.formGroup.value.publicationDate) : new Date();
    reference.link = this.formGroup.value.link ? this.formGroup.value.link as string : '';

    this.referenceService.create(this.topicId, reference)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(ReferenceCreateFormComponent.name, " referemce created ", response.id);
          this.eventBus.emit(ReferenceCreatedEvent.name, new ReferenceCreatedEvent(response.id));
          this.hideForm();
        },
        error: e => {
          this.logger.debug(ReferenceCreateFormComponent.name, " error occurred while creating reference ", e);
          this.message = e.message;
        }
      })
  }
  update() {
    let reference = this.editReference ?? new Reference();
    reference.title = this.formGroup.value.title ? this.formGroup.value.title as string : '';
    reference.description = this.formGroup.value.description ? this.formGroup.value.description as string : '';
    reference.author = this.formGroup.value.author ? this.formGroup.value.author as string : '';
    reference.publicationDate = this.formGroup.value.publicationDate ? new Date(this.formGroup.value.publicationDate) : new Date();
    reference.link = this.formGroup.value.link ? this.formGroup.value.link as string : '';

    this.referenceService.update(reference)
      .pipe(first())
      .subscribe({
        next: response => {
          this.logger.debug(ReferenceCreateFormComponent.name, " referemce updated ", reference.id);
          this.eventBus.emit(ReferenceUpdatedEvent.name, new ReferenceUpdatedEvent(reference.id));
          this.hideForm();
        },
        error: e => {
          this.logger.debug(ReferenceCreateFormComponent.name, " error occurred while updating reference ", e);
          this.message = e.message;
        }
      })
  }

  formViable: boolean = false;
  showForm() {
    this.logger.debug(ReferenceCreateFormComponent.name, "showForm");
    this.formViable = true
  }
  hideForm() {
    this.logger.debug(ReferenceCreateFormComponent.name, "hideForm");
    this.formViable = false;
  }
}
