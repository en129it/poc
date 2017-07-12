import { Component, Input, Directive, ComponentFactoryResolver, ViewContainerRef, ViewChild, AfterContentInit, Type } from '@angular/core';
import { TableMetadata, TableColumnGroupMetadata, ITableHeaderCellRenderer, ITableHeaderMetadata, ITableCellRenderer, ITableColumnMetadata } from './model/table.model';
import * as $ from 'jquery';

@Directive({
  selector: '[cell]',
})
export class CellDirective {
    constructor(public viewContainerRef: ViewContainerRef) { 
    }
}

@Component({
  selector: '[dyn-table-cell-header]',
  template: `<ng-template cell></ng-template>`    
})
export class TableHeaderCell implements AfterContentInit {
    @ViewChild(CellDirective) public cell: CellDirective;
    @Input() public cellMetadata : ITableHeaderMetadata<any> | undefined;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngAfterContentInit() {        
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.cellMetadata.rendererType);
        let viewContainerRef = this.cell.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<ITableHeaderCellRenderer<any>>componentRef.instance).init(this.cellMetadata.params);
    }
}

@Component({
  selector: '[dyn-table-cell]',
  template: `<ng-template cell></ng-template>`    
})
export class TableCell implements AfterContentInit {
    @ViewChild(CellDirective) public cell: CellDirective;
    @Input() public cellMetadata : ITableColumnMetadata<any> | undefined;
    @Input() public cellValue : any;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngAfterContentInit() {        
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.cellMetadata.rendererType);
        let viewContainerRef = this.cell.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<ITableCellRenderer<any>>componentRef.instance).init(1, 1, this.cellMetadata.format, this.cellValue);
    }
}

@Component({
  selector: 'dyn-table',
  template: `<table>
                <tr>
                    <th dyn-table-cell-header *ngFor="let columnGroup of tableMetadata.getColumnGroupMetadataList()" [cellMetadata]='columnGroup.header' [attr.colspan]="columnGroup.getHeaderColSpan()">
                    </th>
                </tr>
                <tr *ngFor="let row of tableData">
                    <td dyn-table-cell *ngFor="let column of tableMetadata.getColumnMetadataList()" [cellMetadata]="column" [cellValue]="row[column.fieldName]">
                    </td>
                </tr>
             </table>`
})
export class DynamicTableComponent {
    @Input() public tableMetadata: TableMetadata;
    @Input() public tableData: Array<any>;
}



