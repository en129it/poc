import { Component } from '@angular/core'
import { ITableHeaderMetadata, ITableHeaderCellRenderer, ITableCellRenderer, ITableColumnMetadata } from '../model/table.model'

//#############################################################################
//#### Header #################################################################
//#############################################################################

class DefaultTableHeaderCellParams {
    constructor(public title: string, public isLeftAlign: boolean, public stickToNeighboorColumn: boolean) {
    }
}

@Component({
  template: `<span [className]="computeClasses()">
                {{data.title}}
            </span>`    
})
export class DefaultTableHeaderCellRenderer implements ITableHeaderCellRenderer<DefaultTableHeaderCellParams> {
    private data: DefaultTableHeaderCellParams; 

    init(value: DefaultTableHeaderCellParams) {
        this.data = value;
    }

    public computeClasses(): string {
        var classes = "";
        classes += (this.data.isLeftAlign) ? "leftAlign" : "rightAlign";
        classes += (this.data.stickToNeighboorColumn) ? "" : " space";
        return classes;
    }
    
}

export class DefaultTableHeaderMetadata implements ITableHeaderMetadata<DefaultTableHeaderCellParams> {
    public rendererType = DefaultTableHeaderCellRenderer;
    public params : DefaultTableHeaderCellParams;
    constructor(public title: string, public isLeftAlign: boolean, public stickToNeighboorColumn: boolean) {
        this.params = new DefaultTableHeaderCellParams(title, isLeftAlign, stickToNeighboorColumn);
    }
}

//#############################################################################
//#### Column #################################################################
//#############################################################################

class DefaultTableColumnCellParams {
    constructor(public isLeftAlign: boolean, public stickToNeighboorColumn: boolean) {}
}

@Component({
  template: `<span [className]="computeClasses()">
                {{value}}
            </span>`,
})
export class DefaultTableCellRenderer implements ITableCellRenderer<DefaultTableColumnCellParams> {
    public value: any;
    public format : DefaultTableColumnCellParams;

    init(cellRowIndex: number, cellColumnIndex:number, format: DefaultTableColumnCellParams, value: any) {
        this.value = value;
        this.format = format;
    }

    public computeClasses(): string {
        var classes = "";
        classes += (this.format.isLeftAlign) ? "leftAlign" : "rightAlign";
        classes += (this.format.stickToNeighboorColumn) ? "" : " space";
        return classes;
    }
}

export class DefaultTableColumnMetadata implements ITableColumnMetadata<DefaultTableColumnCellParams> {
    public rendererType = DefaultTableCellRenderer;
    public format : DefaultTableColumnCellParams;
    constructor(public fieldName: string, public isLeftAlign: boolean, public stickToNeighboorColumn: boolean) {
        this.format = new DefaultTableColumnCellParams(isLeftAlign, stickToNeighboorColumn);
    } 
}
