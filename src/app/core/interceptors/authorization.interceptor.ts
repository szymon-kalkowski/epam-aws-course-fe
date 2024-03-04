import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const IS_AUTHORIZATION_ENABLED = new HttpContextToken<boolean>(
  () => true
);

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authorizationToken: string =
      localStorage.getItem('authorization_token') || '';

    if (!authorizationToken || !request.context.get(IS_AUTHORIZATION_ENABLED)) {
      return next.handle(request);
    }

    const requestWithAuthorization: HttpRequest<unknown> = request.clone({
      setHeaders: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Basic ${authorizationToken}`,
      },
    });

    return next.handle(requestWithAuthorization);
  }
}
