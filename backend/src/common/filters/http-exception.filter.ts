import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx    = host.switchToHttp();
    const req    = ctx.getRequest<Request>();
    const res    = ctx.getResponse<Response>();
    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const raw    = isHttp ? exception.getResponse() : null;
    const message = isHttp
      ? (typeof raw === 'string' ? raw : (raw as any)?.message)
      : 'Erro interno do servidor';
    const details = (typeof raw === 'object' && (raw as any)?.message !== message)
      ? (raw as any)?.message : undefined;

    if (status >= 500) {
      this.logger.error(`[${req.method}] ${req.url} → ${status}`, exception instanceof Error ? exception.stack : String(exception));
    } else {
      this.logger.warn(`[${req.method}] ${req.url} → ${status} — ${message}`);
    }

    res.status(status).json({
      success: false,
      error:   { code: status, message, ...(details ? { details } : {}) },
      ts:      new Date().toISOString(),
      path:    req.url,
    });
  }
}
