export type ColumnData = {
    data: string;
    label: string;
    width?: number;
}

export enum EActionTable {
    Edit = 'edit',
    Delete = 'delete'
}

export type ActionData = {
    action: EActionTable;
    data: any
}