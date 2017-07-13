

import { Type } from '@angular/core';

//#############################################################################
//#### Header #################################################################
//#############################################################################

export interface ITableHeaderCellRenderer<T> {
    init(value: T);
}

export interface ITableHeaderMetadata<T> {
    rendererType: Type<ITableHeaderCellRenderer<T>>;
    params: T;
}

//#############################################################################
//#### Column #################################################################
//#############################################################################

export interface ITableCellRenderer<T> {
    init(rowIndex: number, columnIndex:number, format: T, value: any);
}

export interface ITableColumnCellParams {
    isLeftAlign: boolean;
}

export interface ITableColumnMetadata<T extends ITableColumnCellParams> {
    rendererType: Type<ITableCellRenderer<T>>;
    fieldName: string,
    format: T;
}

//#############################################################################
//#### Table level ############################################################
//#############################################################################

export class TableColumnGroupMetadata {

    public columns : ITableColumnMetadata<any>[];

    constructor(public header: ITableHeaderMetadata<any>, ...columns: ITableColumnMetadata<any>[]) {
        this.columns = columns;
    }
    
    public getHeaderColSpan(): number {
        return this.columns.length;
    }

}

export class TableMetadata {
    private columnGroupMetadatas = new Array<TableColumnGroupMetadata>();
    private columnMetadatas = new Array<ITableColumnMetadata<any>>();

    public addColumnMetadata(metadata: TableColumnGroupMetadata) {
        this.columnGroupMetadatas.push(metadata);
        metadata.columns.forEach( (item: ITableColumnMetadata<any>) => {
            this.columnMetadatas.push(item);
        });
    }

    public getColumnGroupMetadataList(): Array<TableColumnGroupMetadata> {
        return this.columnGroupMetadatas;
    }
    
    public getColumnMetadataList(): Array<ITableColumnMetadata<any>> {
        return this.columnMetadatas;
    }

    public getColumnMetadata(colIndex: number): ITableColumnMetadata<any> {
        return this.columnMetadatas[colIndex];
    }
}


