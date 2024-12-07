import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const loadingService = inject(LoadingService);
  const MIN_LOADING_TIME = 500;

  if (req.headers.get('skip-loader')) {
    return next(req);
  }

  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      setTimeout(() => {
        loadingService.hide();
      }, MIN_LOADING_TIME);
    })
  );
};