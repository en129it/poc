import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit, AfterViewInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'tile',
    template: '<ng-template><ng-content></ng-content></ng-template>'
})
export class TileComponent {
    @ViewChild(TemplateRef) public content : TemplateRef<any>;
    @Input() public rowIndex: number;
    @Input() public colIndex: number;
    @Input() public rowSpan: number;
    @Input() public colSpan: number;
    @Input() public title: string;
    @Input() public toggleTile: boolean = false;
    @Input() public isCriteriaSpecified: boolean;
    @Output() public onClear = new EventEmitter<void>();
    @Output() public onActivationChanged = new EventEmitter<boolean>();
    @Input() public additionalClass: string;

    public onClearEvent() {
        this.onClear.emit();
    }

    public onActivationChangedEvent(isActivate: boolean) {
        this.onActivationChanged.emit(isActivate);
    }
}

@Component({
    selector: 'tile-item',
    template: `<div [attr.class]="cssClasses()" (click)="onSelectionToggling($event)" [ngClass]="{tileSelected: isActive()}">
                    <div #anchor class="tileItemTitle">
                        <div class="title">{{title}}</div>
                        <span *ngIf="!toggleTile" class="clearButton" (click)="onClearEvent($event)">Clear</span>
                    </div>
               </div>`
})
export class TileItemComponent implements AfterViewInit {
    @ViewChild("anchor", {read: ViewContainerRef}) public anchorElem : ViewContainerRef;
    @Input() public content : TemplateRef<any>;
    @Input() public title : string;
    @Input() public isCriteriaSpecified : boolean;
    @Input() public toggleTile: boolean = false;
    public isForceDeactivation: boolean;
    @Output() public onClear = new EventEmitter<void>();
    @Output() public onActivationChanged = new EventEmitter<boolean>();
    private isActiveOld = false;
    @Input() public additionalClass: string;

    constructor() {
        this.isCriteriaSpecified = false;
        this.isForceDeactivation = false;
    }

    ngAfterViewInit() {
        this.anchorElem.createEmbeddedView(this.content);
    }

    public onSelectionToggling(event: MouseEvent) {
        if ("DIV"==event.srcElement.tagName) {
            if (this.toggleTile) {
                this.isCriteriaSpecified = !this.isCriteriaSpecified;
            } else {
                if (this.isCriteriaSpecified) {
                    this.isForceDeactivation = this.isActive();
                }
            }
        }
    }

    public isActive(): boolean {
        var rslt = this.isCriteriaSpecified && (!this.isForceDeactivation);
        if (rslt!=this.isActiveOld) {
            setTimeout( ()=>{
                this.onActivationChanged.emit(rslt);
            }, 1);
            this.isActiveOld = rslt;
        }
        return rslt;
    }

    public onClearEvent(): void {
        this.onClear.emit();
    }

    public cssClasses(): string {
        var rslt = "tileItem";
        if (this.additionalClass) {
            rslt += " " + this.additionalClass;
        }
        return rslt;
    }
}

@Component({
    selector: 'tile-group',
    template: `<table>
                    <tr *ngFor="let row of rows, let rowIndex=index">
                        <td *ngFor="let col of row, let colIndex=index" [attr.colspan]="col.colSpan" [attr.rowspan]="col.rowSpan" [ngStyle]="{width: colPercentages(colIndex)}">
                            <tile-item [content]="col.content" [title]="col.title" [isCriteriaSpecified]="col.isCriteriaSpecified" [toggleTile]="col.toggleTile" [additionalClass]="col.additionalClass" (onClear)="col.onClearEvent()" (onActivationChanged)="col.onActivationChangedEvent($event)"></tile-item>
                        </td>
                    </tr>
               </table>
              `
})
export class TileGroupComponent implements AfterContentInit {
    @Input() public rowWidthPercentages: Array<number>;
    @ContentChildren(TileComponent) public tiles : QueryList<TileComponent>;
    public rows: Array<Array<TileComponent>>;

    public colPercentages(colIndex: number) {
        return this.rowWidthPercentages[colIndex] + "%";
    }

    ngAfterContentInit() {
        this.rows = new Array<Array<TileComponent>>();

        this.tiles.forEach(  (tile: TileComponent) => {
            var row = this.rows[tile.rowIndex];
            if (!row) {
                row = new Array<TileComponent>();
                this.rows[tile.rowIndex] = row;
            }
            row[tile.colIndex] = tile;
        });

        this.rows.forEach( (row: Array<TileComponent>) => {
            for (var i=row.length; i>=0; i--) {
                if (!row[i]) {
                    row.splice(i, 1);
                }
            }
        });

//        console.log(">>>>>> " + this.rows.length);
    }
}


