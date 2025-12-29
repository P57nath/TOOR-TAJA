import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl } = request;
    const requestId = request.requestId || 'unknown';
    const started = Date.now();

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - started;
        const statusCode = context.switchToHttp().getResponse().statusCode;
        console.log(`[${requestId}] ${method} ${originalUrl} ${statusCode} ${durationMs}ms`);
      }),
    );
  }
}
