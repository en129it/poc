
import { Injectable } from '@angular/core';
import { Currency, ShareClassSummaryRaw, ShareClassSummary, SelectedCurrencyChangeListener } from './general.model'
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class DataService {
    private supportedCurrencies : Array<Currency>;
    private selectedCurrency: Currency;
    private selectedCurrencyChangeSubject : Subject<Currency>;

    constructor() {
        this.supportedCurrencies = new Array<Currency>();
        this.selectedCurrency = new Currency("EUR", 1, "EUR");
        this.supportedCurrencies.push(this.selectedCurrency);
        this.supportedCurrencies.push(new Currency("USD", 1.1, "EUR"));
        this.supportedCurrencies.push(new Currency("GBP", 0.8, "EUR"));
        this.supportedCurrencies.push(new Currency("NOK", 1.7, "EUR"));
        this.supportedCurrencies.push(new Currency("SGD", 7.3, "EUR"));
        this.selectedCurrencyChangeSubject = new Subject<Currency>();
    }

    public getSelectedCurrency() : Currency {
        return this.selectedCurrency;
    }

    public setSelectedCurrency(currency : Currency) {
        if (this.selectedCurrency!=currency) {
            this.selectedCurrency = currency;
            console.log("######################## setSelectedCurrency " + currency);
            this.selectedCurrencyChangeSubject.next(currency);
        }
    }

    public subscribeSelectedCurrencyChange(listener: SelectedCurrencyChangeListener): Subscription {
        return this.selectedCurrencyChangeSubject.subscribe( (item: Currency) => {
            listener.onCurrencyChange(item);
        } );
    }

    public unsubscribeSelectedCurrencyChange(subscription: Subscription) {
        subscription.unsubscribe();
    }

    public getSupportedCurrencies(): Array<Currency>  {
        return this.supportedCurrencies;
    }

    public getSupportedCurrency(isoCode: string): Currency {
        var currencies = this.supportedCurrencies;
        for (var i=0; i<currencies.length; i++) {
            if (currencies[i].isoCode==isoCode) {
                return currencies[i];
            }
        }
        return null;
    }

    public getShareClasses(legalFund: string, requestedCurrency: Currency, isLastNav: boolean): Array<ShareClassSummary> {
        var rslt = new Array<ShareClassSummary>();
        rslt.push(new ShareClassSummaryRaw("A EUR Acc", "A", [555.23, 568.45, 556.67], "EUR").extract(requestedCurrency, isLastNav, this.getSupportedCurrency("EUR")));
        rslt.push(new ShareClassSummaryRaw("A Inc", "A", [345.67, 333.23, 321.09], "EUR").extract(requestedCurrency, isLastNav, this.getSupportedCurrency("EUR")));
        rslt.push(new ShareClassSummaryRaw("A NOK Acc", "A", [12.45, 12.23, 12.67], "NOK").extract(requestedCurrency, isLastNav, this.getSupportedCurrency("NOK")));
        rslt.push(new ShareClassSummaryRaw("A SGD Acc", "A", [789.12, 791.23, 791.33], "SGD").extract(requestedCurrency, isLastNav, this.getSupportedCurrency("SGD")));
        rslt.push(new ShareClassSummaryRaw("A USD Acc", "A", [578.34, 577.12, 577.23], "USD").extract(requestedCurrency, isLastNav, this.getSupportedCurrency("USD")));
        rslt.push(new ShareClassSummaryRaw("A1 EUR Acc", "A", [212.45, 218.49, 219.45], "EUR").extract(requestedCurrency, isLastNav, this.getSupportedCurrency("EUR")));
        rslt.push(new ShareClassSummaryRaw("A1 USD Acc", "A", [528.83, 527.66, 527.28], "USD").extract(requestedCurrency, isLastNav, this.getSupportedCurrency("USD")));
        rslt.push(new ShareClassSummaryRaw("B EUR Acc", "B", [65.87, 64.44, 64.99], "EUR").extract(requestedCurrency, isLastNav, this.getSupportedCurrency("EUR")));
        rslt.push(new ShareClassSummaryRaw("B USD Acc", "B", [71.01, 70.92, 70.85], "USD").extract(requestedCurrency, isLastNav, this.getSupportedCurrency("USD")));
        rslt.push(new ShareClassSummaryRaw("C EUR Acc", "C", [552.56, 557.34, 559.02], "EUR").extract(requestedCurrency, isLastNav, this.getSupportedCurrency("EUR")));

        return rslt;
    }

}
