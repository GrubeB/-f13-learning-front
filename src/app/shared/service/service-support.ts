
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

// Error handling
export function errorHandle(error: any) {
  let errorMessage = error.error.message;
  console.log(errorMessage);
  return throwError(() => {
    return new Error(errorMessage);
  });
}