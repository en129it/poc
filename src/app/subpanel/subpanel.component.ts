import { Component, Directive, OnInit, OnDestroy, ContentChildren, QueryList, ViewChild, Input, Output, EventEmitter, TemplateRef, ViewContainerRef, AfterViewInit, AfterContentChecked } from '@angular/core';
import { SubPanelService, SubPanelChangeListener } from '../service/subpanel.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'sub-panel-title',
    template: `<div class="subPanelTitle" [ngClass]="{subPanelSelected: isSelected}" (click)="onSelection($event)">{{title}}</div>`
})
export class SubPanelTitleComponent implements OnInit, SubPanelChangeListener, OnDestroy {
    @Input() public title: string;
    @Input() public subPanelGroupId: string;
    @Input() public subPanelId : string;
    private subscription : Subscription;
    public isSelected : boolean = false;

    constructor(private subPanelService : SubPanelService) {
    }

    public ngOnInit() {
        this.subscription = this.subPanelService.subscribeSubPanelSelectionChange(this.subPanelGroupId, this);    
    }

    public ngOnDestroy() {
        this.subPanelService.unsubscribeSubPanelSelectionChange(this.subPanelGroupId, this.subscription);
    }

    public subPanelSelectionChanged(newSelectedSubPanelId: string) {
        this.isSelected = (newSelectedSubPanelId==this.subPanelId);
    }

    public onSelection(event): void {
        this.subPanelService.subPanelSelectionChange(this.subPanelGroupId, this.isSelected ? null : this.subPanelId);
    }

    public forceSelection(): void {
        this.isSelected = false;
        this.onSelection(null);
    }

    public forceUnselection(): void {
        this.isSelected = true;
        this.onSelection(null);
    }
}

@Component({
    selector: 'panel',
    template: '<ng-template><ng-content></ng-content></ng-template>'
}) 
export class PanelComponent {
    @Input() public subPanelId : string;
    @ViewChild(TemplateRef) content : TemplateRef<any>;
}

@Component({
    selector: 'sub-panel',
    template: `<div #anchor></div>`
}) 
export class SubPanelComponent implements AfterViewInit {
    @ViewChild("anchor", {read: ViewContainerRef}) public anchorElem : ViewContainerRef;
    @Input() public content : TemplateRef<any>;
    @Input() public subPanelId : string;

    ngAfterViewInit() {
        this.anchorElem.createEmbeddedView(this.content);
    }

}

@Component({
    selector: 'sub-panel-group',
    template: `
        <div>
            <div *ngFor="let panel of panels">
                <sub-panel [content]="panel.content" [subPanelId]="panel.subPanelId" *ngIf="panel.subPanelId==selectedSubPanelId">
                </sub-panel>
            </div>
        </div>`
}) 
export class SubPanelGroupComponent implements OnInit, OnDestroy, SubPanelChangeListener {
    @ContentChildren(PanelComponent) public panels : QueryList<PanelComponent>;
    @Input() subPanelGroupId: string;
    @Output() subPanelSelectionChangedEvent = new EventEmitter<string>();
    private subscription: Subscription;
    public selectedSubPanelId : string;

    constructor(private subPanelService: SubPanelService) {}

    ngOnInit() {
        this.subscription = this.subPanelService.subscribeSubPanelSelectionChange(this.subPanelGroupId, this);
    }

    ngOnDestroy() {
        this.subPanelService.unsubscribeSubPanelSelectionChange(this.subPanelGroupId, this.subscription);
    }

    subPanelSelectionChanged(newSelectedSubPanelId: string) {
        this.selectedSubPanelId = newSelectedSubPanelId;
        this.subPanelSelectionChangedEvent.emit(newSelectedSubPanelId);
    }
    
    closeAll() {
        this.selectedSubPanelId = null;
    }
}

