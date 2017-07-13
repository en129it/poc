
import { Injectable } from '@angular/core';
import { Currency, ShareClassSummaryRaw, ShareClassSummary, SelectedCurrencyChangeListener, Dealer, DealerPositionSummary, ShareClassPositionHistory } from './general.model'
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class DataService {
    private supportedCurrencies : Array<Currency>;
    private shareClasses : Array<ShareClassSummaryRaw>;
    private dealers : Array<Dealer>;
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

        this.shareClasses = new Array<ShareClassSummaryRaw>();
        this.shareClasses.push(new ShareClassSummaryRaw("A EUR Acc", "A", 1353.53, 555.23, "EUR"));
        this.shareClasses.push(new ShareClassSummaryRaw("A Inc", "A", 187.53, 345.67, "EUR"));
        this.shareClasses.push(new ShareClassSummaryRaw("A NOK Acc", "A", 463.27, 12.45, "NOK"));
        this.shareClasses.push(new ShareClassSummaryRaw("A SGD Acc", "A", 1636.01, 789.12, "SGD"));
        this.shareClasses.push(new ShareClassSummaryRaw("A USD Acc", "A", 245.96, 578.34, "USD"));
        this.shareClasses.push(new ShareClassSummaryRaw("A1 EUR Acc", "A", 12.64, 212.45, "EUR"));
        this.shareClasses.push(new ShareClassSummaryRaw("A1 USD Acc", "A", 53.68, 528.83, "USD"));
        this.shareClasses.push(new ShareClassSummaryRaw("B EUR Acc", "B", 957.86, 65.87, "EUR"));
        this.shareClasses.push(new ShareClassSummaryRaw("B USD Acc", "B", 747.22, 71.01, "USD"));
        this.shareClasses.push(new ShareClassSummaryRaw("C EUR Acc", "C", 446.85, 552.56, "EUR"));

        this.dealers = new Array<Dealer>();
        this.dealers.push(new Dealer("Morgan Stanley", 12));
        this.dealers.push(new Dealer("Deutche Bank", 8));
        this.dealers.push(new Dealer("BNP Parisbas", 6));
        this.dealers.push(new Dealer("Credit Agricole", 4));
        this.dealers.push(new Dealer("ABN-Amro", 7));
        this.dealers.push(new Dealer("Santander", 2));
        this.dealers.push(new Dealer("BIL", 1));
        this.dealers.push(new Dealer("HSBC", 14));
        this.dealers.push(new Dealer("Credit Suisse", 3));
        this.dealers.push(new Dealer("DanskeBank", 1));

        var totalDealerWeight = 0;
        this.dealers.forEach( (dealer : Dealer) => {
            totalDealerWeight += dealer.weight;
        });
        this.dealers.forEach( (dealer : Dealer) => {
            dealer.weight = dealer.weight*100/totalDealerWeight;
        });
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
        this.shareClasses.forEach( (shareClass: ShareClassSummaryRaw) => {
            rslt.push(shareClass.extract(requestedCurrency, isLastNav, this.getSupportedCurrency(shareClass.currency)));
        });

        return rslt;
    }

    public getDealerPositions(legalFund: string, requestedCurrency: Currency, isLastNav: boolean): Array<DealerPositionSummary> {
        var legalFundPosition = 0;
        var shareClasses = this.getShareClasses(legalFund, requestedCurrency, isLastNav);
        shareClasses.forEach( (shareClass : ShareClassSummary) => {
            legalFundPosition += shareClass.positionValueInRequestedCurrency;
        });

        var rslt = new Array<DealerPositionSummary>();

        this.dealers.forEach( (dealer : Dealer) => {
            rslt.push(new DealerPositionSummary(dealer.dealerName, this.formatDecimal(dealer.weight*legalFundPosition, 2), requestedCurrency.isoCode));
        });

        rslt.sort( (first: DealerPositionSummary, second: DealerPositionSummary) => {
            return second.positionValue - first.positionValue;  // descending sort
        });

        return rslt;
    }
    
    private formatDecimal(value:number, nbDecimals:number): number {
        var mult = Math.pow(10, nbDecimals);
        var val = value*mult;
        val = Math.ceil(val);
        return val/mult;
    }

    public getLegalFundPositionHistory(legalFund: string, requestedCurrency: Currency) : Array<ShareClassPositionHistory> {
        var rslt = new Array<ShareClassPositionHistory>();

        this.shareClasses.forEach( (shareClass: ShareClassSummaryRaw) => {
            rslt.push(new ShareClassPositionHistory(shareClass.className, shareClass.extractPositionHistory(requestedCurrency, this.getSupportedCurrency(shareClass.currency))));
        });
        return rslt;
    }
}
