// Type definitions for winston-daily-rotate-file
import * as Transport from 'winston-transport';

declare module 'winston-daily-rotate-file' {
  interface DailyRotateFileTransportOptions extends Transport.TransportStreamOptions {
    filename?: string;
    dirname?: string;
    datePattern?: string;
    zippedArchive?: boolean;
    maxSize?: string | number;
    maxFiles?: string | number;
    options?: object;
    auditFile?: string;
    utc?: boolean;
    extension?: string;
    createSymlink?: boolean;
    symlinkName?: string;
    json?: boolean;
    eol?: string;
    maxRetries?: number;
    tailable?: boolean;
    maxBackups?: number;
    format?: any;
  }

  class DailyRotateFile extends Transport {
    constructor(options?: DailyRotateFileTransportOptions);
  }

  namespace DailyRotateFile {
    interface DailyRotateFileTransportOptions extends DailyRotateFileTransportOptions {}
  }

  export = DailyRotateFile;
}
