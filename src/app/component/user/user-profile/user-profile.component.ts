import { Component, Input, OnInit, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventBusService } from '../../../shared/service/event-bus.service';
import { User } from '../user.model';
import { UserQueryService } from '../user-query.service';
import { first } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-profile',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  logger = inject(NGXLogger);
  eventBus = inject(EventBusService);
  userQueryService = inject(UserQueryService);

  @Input() userId!: string;

  user?: User;
  url: string = "http://localhost:9007/api/v1/files/";
  defalutImage: string = '/assets/logo.png';

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.logger.debug(UserProfileComponent.name, " getUser()");
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
