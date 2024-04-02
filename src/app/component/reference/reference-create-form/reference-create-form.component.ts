import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { Reference } from '../../../model/reference.model';
import { first } from 'rxjs';
import { TopicReferenceService } from '../../../service/topic-reference.service';
import { EventBusService } from '../../../service/event-bus.service';
import { ReferenceCreatedEvent } from '../reference-module.event';

@Component({
  selector: 'reference-create-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './reference-create-form.component.html',
  styleUrl: './reference-create-form.component.scss'
})
export class ReferenceCreateFormComponent {
  logger= inject(NGXLogger);
  eventBus= inject(EventBusService);
  referenceService = inject(TopicReferenceService);

  @Input() topicId!: string;

  message?: string;

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

  private createReferenceFromFormValues(formValues: any): Reference {
    let reference = new Reference();
    reference.title = formValues.title ? formValues.title as string : '';
    reference.description = formValues.description ? formValues.description as string : '';
    reference.author = formValues.author ? formValues.author as string : '';
    reference.publicationDate = formValues.publicationDate ? formValues.publicationDate as Date : new Date();
    reference.link = formValues.link ? formValues.link as string : '';
    return reference;
  }

  submit() {
    this.logger.debug(ReferenceCreateFormComponent.name, "submit");
    if (this.formGroup.valid) {
      let newReference = this.createReferenceFromFormValues(this.formGroup.value);

      this.referenceService.create(this.topicId, newReference)
        .pipe(first())
        .subscribe({
          next: response => {
            this.logger.debug(ReferenceCreateFormComponent.name, " referemce created ", response.id);
            this.eventBus.emit(ReferenceCreatedEvent.name, new ReferenceCreatedEvent(response.id));
          },
          error: e => {
            this.logger.debug(ReferenceCreateFormComponent.name, "error occurred while creating reference ", e);
            this.message = e.message;
          }
        })
    }
  }
}
