import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../service/general.service';
import { Currency } from '../service/general.model';

@Component({
    selector: 'app-menu',
    template: `
        <div class="menu">
            <a href="legalFund" class="menuItem">Legal Fund</a>
            <a href="accountSearch" class="menuItem">Account Search</a>
            <div class=menuCurrency>
                <select [(ngModel)]="selectedCurrency" (ngModelChange)="onSelectionChange($event)">
                    <option *ngFor="let c of currencies" [ngValue]="c">{{c.isoCode}}</option>
                </select>
            </div>
        </div>
            `
})
export class MenuComponent {
    public currencies: Array<Currency>;
    public selectedCurrency: Currency;

    constructor(private dataService : DataService) {
        this.selectedCurrency = dataService.getSelectedCurrency();
        this.currencies = dataService.getSupportedCurrencies();
    }

    public onSelectionChange(event) {
        this.dataService.setSelectedCurrency(this.selectedCurrency);
    }

}
