import { Injectable, inject } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { Observable, Subject } from "rxjs";

@Injectable()
export class EventBusService {
    logger: NGXLogger = inject(NGXLogger);
    
    private subject = new Subject();

    emit(eventName: string, payload: any) {
        this.logger.debug("Event emited: ", eventName, " - ", payload);
        this.subject.next({ eventName, payload });
    }

    listen(eventName: string, callback: (event: any) => void) {
        this.subject.asObservable().subscribe((nextObj: any) => {
            if (eventName === nextObj.eventName) {
                callback(nextObj.payload);
            }
        })
    }
}