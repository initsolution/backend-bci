import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, catchError, timestamp } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP')

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest()
        const { method, originalUrl, ip } = req
        const start = Date.now()

        const body = req.body ?? {}
        const sizeBytes = Buffer.byteLength(JSON.stringify(body), 'utf-8')
        const sizeKB = (sizeBytes / 1024).toFixed(2)

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - start;
                this.logger.log({
                    ip,
                    method,
                    url: originalUrl,
                    status: 'SUCCESS',
                    duration_ms: duration,
                    timestamp: new Date().toISOString(),
                    size: `${sizeBytes} b / ${sizeKB} kb`
                })
            }),
            catchError((error) => {
                const duration = Date.now() - start;
                this.logger.error({
                    ip,
                    method,
                    url: originalUrl,
                    status: 'FAILED',
                    duration_ms: duration,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                    size: `${sizeBytes} b / ${sizeKB} kb`
                })
                throw error
            })
        )
    }
}