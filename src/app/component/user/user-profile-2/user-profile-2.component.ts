import { Component, Input, OnInit, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../service/event-bus.service';
import { User } from '../user.model';
import { UserQueryService } from '../user-query.service';
import { first } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'user-profile-2',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './user-profile-2.component.html',
  styleUrl: './user-profile-2.component.scss'
})
export class UserProfile2Component {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  userQueryService = inject(UserQueryService);

  @Input() userId!: string;
  @Input() date!: any;

  user?: User;
  url: string = "http://localhost:9007/api/v1/files/";
  defalutImage: string = '/assets/logo.png';

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.logger.debug(UserProfile2Component.name, " getUser()");
    this.userQueryService.get(this.userId).pipe(first()).subscribe({
      next: data =>{
        this.user = data;
      }
    });
  }
  getAvatarUrl() {
    if(this.user?.avatarFileId){
      return this.url + this.user?.avatarFileId;
    }
    return this.defalutImage;
  }
}
