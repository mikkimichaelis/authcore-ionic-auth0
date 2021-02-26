export interface IBusyService {
    initialize();
    present(content?: string);
    dismiss();
}