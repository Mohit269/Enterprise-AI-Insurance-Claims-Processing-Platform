import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const responseObject =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as Record<string, unknown>)
        : undefined;
    const message = this.getMessage(
      exception,
      exceptionResponse,
      responseObject,
    );
    const error =
      typeof responseObject?.error === 'string'
        ? responseObject.error
        : HttpStatus[statusCode];
    const requestId = request.headers['x-request-id'];
    const requestIdValue = Array.isArray(requestId) ? requestId[0] : requestId;

    response.status(statusCode).json({
      statusCode,
      error,
      message,
      requestId: requestIdValue ?? '',
    });
  }

  private getMessage(
    exception: unknown,
    exceptionResponse: string | object | undefined,
    responseObject: Record<string, unknown> | undefined,
  ): string | string[] {
    if (Array.isArray(responseObject?.message)) {
      return responseObject.message.filter(
        (message): message is string => typeof message === 'string',
      );
    }
    if (typeof responseObject?.message === 'string') {
      return responseObject.message;
    }
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }
    if (exception instanceof Error) {
      return exception.message;
    }
    return 'Internal server error';
  }
}
