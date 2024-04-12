
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

// Error handling
export function errorHandle(error: any) {
  let errorMessage = '';
  if (error.error instanceof ErrorEvent) {
    errorMessage = error.error.message;
  } else {
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  console.log(errorMessage);
  return throwError(() => {
    return errorMessage;
  });
}