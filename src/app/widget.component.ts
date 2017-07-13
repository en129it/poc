import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'auto-complete',
    template: ` <input type="text" [(ngModel)]="value" (change)="onChange($event)" (keyup)="onChange($event)">
                <div style="position: relative;" *ngIf="proposals.length>0">
                    <div class="autoCompleteSuggestion">
                        <ul>
                            <li *ngFor="let proposal of proposals" (click)="onSelection(proposal)">{{proposal}}</li>
                        </ul>
                    </div>
                </div>
                <div style="height: 40px; padding-top: 15px;">
                    <div class="autoCompleteSelection" *ngFor="let selection of selections">{{selection}}</div>
                </div>
            `
})
export class AutoCompleteComponent {
    public value: string;
    public proposals: Array<string> = new Array<string>();
    @Input() public elements: Array<string>; 
    public selections: Array<string> = new Array<string>();
    @Output() public onSelectionChanged = new EventEmitter<Array<string>>();

    public clear(): void {
        this.clearProposals();
        this.selections = new Array<string>();
        this.onSelectionChanged.emit(this.selections);
    }

    private clearProposals() {
        this.proposals = new Array<string>();
    }

    public onChange(event) {
        this.clearProposals();
        this.elements.forEach( (item: string) => {
            if (item.startsWith(this.value)) {
                if (this.selections.indexOf(item)==-1) {
                    this.proposals.push(item);
                }
            }
        });
    }

    public onSelection(selectedProposal: string) {
        this.selections.push(selectedProposal);
        this.clearProposals();
        this.value = "";
        this.onSelectionChanged.emit(this.selections);
    }
}