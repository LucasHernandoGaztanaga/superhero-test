import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpRequest, HttpResponse, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { runInInjectionContext } from '@angular/core';
import { loadingInterceptor } from './loading.interceptor';
import { INJECTOR } from '@angular/core';

describe('LoadingInterceptor', () => {
  let loadingService: LoadingService;
  let injector: any;
  const MIN_LOADING_TIME = 500;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    loadingService = TestBed.inject(LoadingService);
    injector = TestBed.inject(INJECTOR);
    spyOn(loadingService, 'show').and.callThrough();
    spyOn(loadingService, 'hide').and.callThrough();
  });

  describe('Basic Functionality', () => {
    it('should show and hide loading for successful request', fakeAsync(() => {
      const mockResponse = new HttpResponse({ status: 200 });
      const next = () => of(mockResponse);
      const request = new HttpRequest('GET', '/test');

      runInInjectionContext(injector, () => {
        loadingInterceptor(request, next).subscribe();
        expect(loadingService.show).toHaveBeenCalled();
        tick(MIN_LOADING_TIME);
        expect(loadingService.hide).toHaveBeenCalled();
      });
    }));

    it('should show and hide loading for failed request', fakeAsync(() => {
      const mockError = new HttpErrorResponse({ status: 404 });
      const next = () => throwError(() => mockError);
      const request = new HttpRequest('GET', '/test');

      runInInjectionContext(injector, () => {
        loadingInterceptor(request, next).subscribe({
          error: () => {}
        });
        expect(loadingService.show).toHaveBeenCalled();
        tick(MIN_LOADING_TIME);
        expect(loadingService.hide).toHaveBeenCalled();
      });
    }));

    it('should respect minimum loading time', fakeAsync(() => {
      const mockResponse = new HttpResponse({ status: 200 });
      const next = () => of(mockResponse);
      const request = new HttpRequest('GET', '/test');

      runInInjectionContext(injector, () => {
        loadingInterceptor(request, next).subscribe();
        tick(MIN_LOADING_TIME - 100);
        expect(loadingService.hide).not.toHaveBeenCalled();
        tick(100);
        expect(loadingService.hide).toHaveBeenCalled();
      });
    }));
  });

  describe('Skip Loader Header', () => {
    it('should skip loading for requests with skip-loader header', fakeAsync(() => {
      const mockResponse = new HttpResponse({ status: 200 });
      const next = () => of(mockResponse);
      const headers = new HttpHeaders().set('skip-loader', 'true');
      const request = new HttpRequest('GET', '/test', null, { headers });

      runInInjectionContext(injector, () => {
        loadingInterceptor(request, next).subscribe();
        expect(loadingService.show).not.toHaveBeenCalled();
        tick(MIN_LOADING_TIME);
        expect(loadingService.hide).not.toHaveBeenCalled();
      });
    }));

    it('should handle skip-loader header with different values', fakeAsync(() => {
      const mockResponse = new HttpResponse({ status: 200 });
      const next = () => of(mockResponse);
      const headers = new HttpHeaders().set('skip-loader', 'false');
      const request = new HttpRequest('GET', '/test', null, { headers });

      runInInjectionContext(injector, () => {
        loadingInterceptor(request, next).subscribe();
        expect(loadingService.show).not.toHaveBeenCalled();
      });
    }));
  });

  describe('HTTP Methods', () => {
    ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
      it(`should handle ${method} requests`, fakeAsync(() => {
        const mockResponse = new HttpResponse({ status: 200 });
        const next = () => of(mockResponse);
        const request = new HttpRequest(method as any, '/test');

        runInInjectionContext(injector, () => {
          loadingInterceptor(request, next).subscribe();
          expect(loadingService.show).toHaveBeenCalled();
          tick(MIN_LOADING_TIME);
          expect(loadingService.hide).toHaveBeenCalled();
        });
      }));
    });
  });

  describe('Response Timing', () => {
    it('should handle fast responses', fakeAsync(() => {
      const mockResponse = new HttpResponse({ status: 200 });
      const next = () => of(mockResponse);
      const request = new HttpRequest('GET', '/test');

      runInInjectionContext(injector, () => {
        loadingInterceptor(request, next).subscribe();
        tick(10);
        expect(loadingService.hide).not.toHaveBeenCalled();
        tick(MIN_LOADING_TIME - 10);
        expect(loadingService.hide).toHaveBeenCalled();
      });
    }));

    it('should handle slow responses', fakeAsync(() => {
      const mockResponse = new HttpResponse({ status: 200 });
      const next = () => new Observable<HttpEvent<unknown>>(subscriber => {
        setTimeout(() => {
          subscriber.next(mockResponse);
          subscriber.complete();
        }, 1000);
      });
      const request = new HttpRequest('GET', '/test');

      runInInjectionContext(injector, () => {
        loadingInterceptor(request, next).subscribe();
        tick(1000);
        expect(loadingService.hide).not.toHaveBeenCalled();
        tick(MIN_LOADING_TIME);
        expect(loadingService.hide).toHaveBeenCalled();
      });
    }));
  });

  describe('Error Scenarios', () => {
    it('should handle network errors', fakeAsync(() => {
      const mockError = new Error('Network Error');
      const next = () => throwError(() => mockError);
      const request = new HttpRequest('GET', '/test');

      runInInjectionContext(injector, () => {
        loadingInterceptor(request, next).subscribe({
          error: () => {}
        });
        tick(MIN_LOADING_TIME);
        expect(loadingService.hide).toHaveBeenCalled();
      });
    }));

    it('should handle different HTTP error codes', fakeAsync(() => {
      [400, 401, 403, 404, 500].forEach(status => {
        const mockError = new HttpErrorResponse({ status });
        const next = () => throwError(() => mockError);
        const request = new HttpRequest('GET', '/test');

        runInInjectionContext(injector, () => {
          (loadingService.show as jasmine.Spy).calls.reset();
          (loadingService.hide as jasmine.Spy).calls.reset();

          loadingInterceptor(request, next).subscribe({
            error: () => {}
          });
          tick(MIN_LOADING_TIME);
          expect(loadingService.show).toHaveBeenCalled();
          expect(loadingService.hide).toHaveBeenCalled();
        });
      });
    }));
  });

  describe('Multiple Requests', () => {
    it('should handle concurrent requests', fakeAsync(() => {
      const mockResponse = new HttpResponse({ status: 200 });
      const next = () => of(mockResponse);
      const request = new HttpRequest('GET', '/test');

      runInInjectionContext(injector, () => {
        loadingInterceptor(request, next).subscribe();
        loadingInterceptor(request, next).subscribe();
        
        expect(loadingService.show).toHaveBeenCalledTimes(2);
        tick(MIN_LOADING_TIME);
        expect(loadingService.hide).toHaveBeenCalledTimes(2);
      });
    }));
  });
});