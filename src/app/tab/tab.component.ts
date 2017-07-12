import { Component, Directive, ContentChildren, QueryList, ViewChild, Input, Output, EventEmitter, TemplateRef, ViewContainerRef, AfterViewInit, AfterContentChecked } from '@angular/core';

@Component({
    selector: 'tab-body',
    template: `<div #anchor></div>`
}) 
export class TabBodyComponent implements AfterViewInit {
    @ViewChild("anchor", {read: ViewContainerRef}) public anchorElem : ViewContainerRef;
    @Input() public content : TemplateRef<any>;

    ngAfterViewInit() {
        this.anchorElem.createEmbeddedView(this.content);
    }

}


@Component({
    selector: 'tab',
    template: '<ng-template><ng-content></ng-content></ng-template>'
}) 
export class TabComponent {
    @Input() public title : string;
    @ViewChild(TemplateRef) content : TemplateRef<any>;
}


@Component({
    selector: 'tab-group',
    template: `
        <div class="tabTitleContainer">
            <span *ngFor="let tab of tabs, let i=index" (click)="tabSelectionChange(i)" class="tabTitle" [ngClass]="{tabSelected: selectedIndex==i}">
                {{tab.title}}
            </span>
        </div>
        <div class="tabBodyContainer">
            <div *ngFor="let tab of tabs, let i=index" class="tabBody">
                <tab-body [content]="tab.content" *ngIf="selectedIndex==i">
                </tab-body>
            </div>
        </div>`
}) 
export class TabGroupComponent {
    @ContentChildren(TabComponent) public tabs : QueryList<TabComponent>;
    @Input() public selectedIndex: number = 0;
    @Output() public onTabSelectionChange = new EventEmitter<number>();
    public toto = true;
    
    public tabSelectionChange(newSelectedIndex: number) {
        this.selectedIndex = newSelectedIndex;
        this.onTabSelectionChange.emit(newSelectedIndex);
    }
}

