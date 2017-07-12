import { Component, ViewChild, QueryList, AfterViewInit } from '@angular/core';
import { TileComponent, TileGroupComponent } from './tile/tile.component';
import { AutoCompleteComponent } from './widget.component';
import { TableMetadata, TableColumnGroupMetadata } from './table/model/table.model';
import { DefaultTableHeaderMetadata, DefaultTableColumnMetadata } from './table/render/default.render';

@Component({
    selector: 'account-search',
    template: `
            <dyn-table [tableMetadata]='accountTableMetadata' [tableData]='searchResults'></dyn-table>
            <div class="modalDialog" *ngIf="!isSearchCriteriaApplied">
                <div>
                    <div class="tileContainer">
                        <tile-group [rowWidthPercentages]='rowWidthPercentages'>
                            <tile [title]="'Blocking'" [rowIndex]="'0'" [rowSpan]="'3'" [colIndex]="'0'" [colSpan]="'1'" [isCriteriaSpecified]="isOneBlockingReasonSelected()" (onClear)="onClearBlockingReasons()" (onActivationChanged)="onBlockingReasonActivationChanged($event)">
                                <ul>
                                    <li><input type="checkbox" name="blocking" [checked]="isBlockingReasonSelected(1)" (change)="onBlockingReasonSelection(1)">Awaiting guardian's approval</li>
                                    <li><input type="checkbox" name="blocking" [checked]="isBlockingReasonSelected(2)" (change)="onBlockingReasonSelection(2)">Bankruptcy</li>
                                    <li><input type="checkbox" name="blocking" [checked]="isBlockingReasonSelected(4)" (change)="onBlockingReasonSelection(4)">Fund closure</li>
                                    <li><input type="checkbox" name="blocking" [checked]="isBlockingReasonSelected(8)" (change)="onBlockingReasonSelection(8)">Inactive account</li>
                                    <li><input type="checkbox" name="blocking" [checked]="isBlockingReasonSelected(16)" (change)="onBlockingReasonSelection(16)">Incomplete AML/KYC</li>
                                    <li><input type="checkbox" name="blocking" [checked]="isBlockingReasonSelected(32)" (change)="onBlockingReasonSelection(32)">Inheritance processing</li>
                                    <li><input type="checkbox" name="blocking" [checked]="isBlockingReasonSelected(64)" (change)="onBlockingReasonSelection(64)">Margin lending</li>
                                    <li><input type="checkbox" name="blocking" [checked]="isBlockingReasonSelected(128)" (change)="onBlockingReasonSelection(128)">Pledge</li>
                                    <li><input type="checkbox" name="blocking" [checked]="isBlockingReasonSelected(256)" (change)="onBlockingReasonSelection(256)">Returned mail</li>
                                    <li><input type="checkbox" name="blocking" [checked]="isBlockingReasonSelected(512)" (change)="onBlockingReasonSelection(512)">Miscellaneous</li>
                                </ul>
                            </tile>
                            <tile [title]="'Zero Balance'" [toggleTile]="'true'" [rowIndex]="'3'" [rowSpan]="'1'" [colIndex]="'0'" [colSpan]="'1'" (onActivationChanged)="onZeroBalanceActivationChanged($event)">
                            </tile>
                            <tile [title]="'Account Name'" [rowIndex]="'0'" [rowSpan]="'1'" [colIndex]="'1'" [colSpan]="'1'" [isCriteriaSpecified]="isAccountNameSpecified()" (onClear)="onClearAccountName()" (onActivationChanged)="onAccountNameActivationChanged($event)">
                                <input type="text" [(ngModel)]="accountName">
                            </tile>
                            <tile [title]="'Account Number'" [rowIndex]="'1'" [rowSpan]="'1'" [colIndex]="'1'" [colSpan]="'1'" [isCriteriaSpecified]="isAccountNumberSpecified()" (onClear)="onClearAccountNumber()" (onActivationChanged)="onAccountNumberActivationChanged($event)">
                                <input type="text" [(ngModel)]="accountNumber">
                            </tile>
                            <tile [title]="'Legal Fund'" [rowIndex]="'2'" [rowSpan]="'1'" [colIndex]="'1'" [colSpan]="'1'" [isCriteriaSpecified]="selectedLegalFunds.length>0" (onClear)="onClearLegalFunds()" (onActivationChanged)="onLegalFundsActivationChanged($event)">
                                <auto-complete #legalFundAutoComplete [elements]="allowedLegalFunds" (onSelectionChanged)="onLegalFundCriteriaSelectionChanged($event)"></auto-complete>
                            </tile>
                            <tile [title]="'Share Class'" [rowIndex]="'3'" [rowSpan]="'1'" [colIndex]="'1'" [colSpan]="'1'" [isCriteriaSpecified]="selectedShareClasses.length>0" (onClear)="onClearShareClasses()" (onActivationChanged)="onShareClassesActivationChanged($event)">
                                <auto-complete #shareClassAutoComplete [elements]="allowedShareClasses" (onSelectionChanged)="onShareClassCriteriaSelectionChanged($event)"></auto-complete>
                            </tile>
                        </tile-group>
                        <div class="searchButtonBar">
                            <button [disabled]="!isAtLeastOnCriteria()" (click)="applySearchCriteria()">Apply</button>
                        </div>
                    </div>
                </div>
            <div>
              `
})
export class AccountSearchPanel implements AfterViewInit {
    public rowWidthPercentages = [40, 60];
    public blockingAccountCriteria = 0;
    public accountName = "";
    public accountNumber = "";
    public allowedLegalFunds = ["Fund A", "Fund B", "Fund C"];
    public allowedShareClasses = ["Class A", "Class B", "Class C", "Class I"];
    public selectedLegalFunds = new Array<string>();
    public selectedShareClasses = new Array<string>();

    public isZeroBalanceCriteriaActivated = false;
    public isBlockingReasonCriteriaActivated = false;
    public isAccountNameCriteriaActivated = false;
    public isAccountNumberCriteriaActivated = false;
    public isLegalFundsCriteriaActivated = false;
    public isShareClassesCriteriaActivated = false;

    @ViewChild("legalFundAutoComplete") legalFundAutoComplete : AutoCompleteComponent;
    @ViewChild("shareClassAutoComplete") shareClassAutoComplete : AutoCompleteComponent;
    @ViewChild(TileComponent) tiles : QueryList<TileComponent>;
    public isSearchCriteriaApplied : boolean = false;
    public accountTableMetadata : TableMetadata;
    public searchResults: Array<any>;

    constructor() {
        this.initAccountTableMetadata();
        this.searchResults = new Array<any>();
    }

    ngAfterViewInit() {

    }

    public isOneBlockingReasonSelected(): boolean {
        return this.blockingAccountCriteria!=0;
    }

    public isBlockingReasonSelected(code: number): boolean {
        return (this.blockingAccountCriteria & code)>0;
    }

    public onBlockingReasonSelection(code: number): void {
        this.blockingAccountCriteria = (this.blockingAccountCriteria ^ code);
    }

    public isAccountNameSpecified(): boolean {
        return this.accountName!="";
    }

    public isAccountNumberSpecified(): boolean {
        return this.accountNumber!="";
    }

    public onLegalFundCriteriaSelectionChanged(selectedItems: Array<string>): void {
        this.selectedLegalFunds = selectedItems;
    }

    public onShareClassCriteriaSelectionChanged(selectedItems: Array<string>): void {
        this.selectedShareClasses = selectedItems;
    }

    public onClearBlockingReasons() {
        this.blockingAccountCriteria = 0;
    }
    public onClearAccountName() {
        this.accountName = "";
    }
    public onClearAccountNumber() {
        this.accountNumber = "";
    }
    public onClearLegalFunds() {
        this.legalFundAutoComplete.clear()
    }
    public onClearShareClasses() {
        this.shareClassAutoComplete.clear();
    }
    
    public onZeroBalanceActivationChanged(isActivated: boolean) {
        this.isZeroBalanceCriteriaActivated = isActivated;
    }

    public onBlockingReasonActivationChanged(isActivated: boolean) {
        this.isBlockingReasonCriteriaActivated = isActivated;
    }

    public onAccountNameActivationChanged(isActivated: boolean) {
        this.isAccountNameCriteriaActivated = isActivated;
    }

    public onAccountNumberActivationChanged(isActivated: boolean) {
        this.isAccountNumberCriteriaActivated = isActivated;
    }

    public onLegalFundsActivationChanged(isActivated: boolean) {
        this.isLegalFundsCriteriaActivated = isActivated;
    }

    public onShareClassesActivationChanged(isActivated: boolean) {
        this.isShareClassesCriteriaActivated = isActivated;
    }

    public isAtLeastOnCriteria(): boolean {
        var rslt = this.isBlockingReasonCriteriaActivated
            || this.isAccountNameCriteriaActivated
            || this.isAccountNumberCriteriaActivated
            || this.isLegalFundsCriteriaActivated
            || this.isShareClassesCriteriaActivated
            || this.isZeroBalanceCriteriaActivated;
        return rslt;
    }

    public applySearchCriteria() {
        this.isSearchCriteriaApplied = true;
    }

    public initAccountTableMetadata() {
        this.accountTableMetadata = new TableMetadata();
        this.accountTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
        new DefaultTableHeaderMetadata('Account Name', true, true),
        new DefaultTableColumnMetadata("accountName", false, false) 
        ));
        this.accountTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
        new DefaultTableHeaderMetadata('Account Number', true, true),
        new DefaultTableColumnMetadata("accountNumber", false, false) 
        ));
        this.accountTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
        new DefaultTableHeaderMetadata('Dealer', true, true),
        new DefaultTableColumnMetadata("dealer", false, false)
        ));
        this.accountTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
        new DefaultTableHeaderMetadata('Quantity', true, true),
        new DefaultTableColumnMetadata("quantity", false, false)
        ));
        this.accountTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
        new DefaultTableHeaderMetadata('Price', true, true),
        new DefaultTableColumnMetadata("price", false, false) 
        ));
        this.accountTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
        new DefaultTableHeaderMetadata('Status', true, true),
        new DefaultTableColumnMetadata("status", false, false) 
        ));
        this.accountTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
        new DefaultTableHeaderMetadata('Share class', true, true),
        new DefaultTableColumnMetadata("shareClassId", false, false) 
        ));
    }    
}
