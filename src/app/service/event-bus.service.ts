import { Injectable, inject } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { Subject } from "rxjs";

@Injectable()
export class EventBusService {
    logger: NGXLogger = inject(NGXLogger);
    
    private subject = new Subject();

    emit(eventName: string, payload: any) {
        this.logger.info("Event emited: ", eventName, " - ", payload);
        this.subject.next({ eventName, payload });
    }

    listen(eventName: string  | string[], callback: (event: any) => void) {
        this.subject.asObservable().subscribe((nextObj: any) => {
            if (typeof eventName === 'string') {
                if (eventName === nextObj.eventName) {
                    callback(nextObj.payload);
                }
            } else if (Array.isArray(eventName)) {
                if (eventName.includes(nextObj.eventName)) {
                    callback(nextObj.payload);
                }
            }
        })
    }
}