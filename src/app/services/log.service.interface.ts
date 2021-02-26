export interface ILogService {
    initialize();
    trace(msg: any, ...args: any[]);
    message(msg: string, ...args: any[]);
    error(error: Error, ...args: any[]);
    exception(e: Error, ...args: any[]);
}