
import { Injectable } from '@angular/core';
import { Utils, Currency, ShareClassSummaryRaw, ShareClassSummary, LegalFundPositionSummary, SelectedCurrencyChangeListener, Dealer, DealerPositionSummary, ShareClassPositionHistory } from './general.model'
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class DataService {
    private supportedCurrencies : Array<Currency>;
    private shareClasses : Array<ShareClassSummaryRaw>;
    private dealers : Array<Dealer>;
    private selectedCurrency: Currency;
    private selectedCurrencyChangeSubject : Subject<Currency>;
    private historySize = 10;

    constructor() {
        this.supportedCurrencies = new Array<Currency>();
        this.selectedCurrency = new Currency("EUR", 1, "EUR");
        this.supportedCurrencies.push(this.selectedCurrency);
        this.supportedCurrencies.push(new Currency("USD", 1.1, "EUR"));
        this.supportedCurrencies.push( new Currency("GBP", 0.8, "EUR"));
        this.supportedCurrencies.push(new Currency("NOK", 1.7, "EUR"));
        this.supportedCurrencies.push(new Currency("SGD", 7.3, "EUR"));
        this.selectedCurrencyChangeSubject = new Subject<Currency>();

        var isoCodeToCurrencyMap = new Map<string, Currency>();
        this.supportedCurrencies.forEach( (currency: Currency) => {
            isoCodeToCurrencyMap.set(currency.isoCode, currency);
        });

        this.shareClasses = new Array<ShareClassSummaryRaw>();
        this.shareClasses.push(new ShareClassSummaryRaw("A EUR Acc", "A", 753.53, 455.23, isoCodeToCurrencyMap.get("EUR"), this.historySize));
        this.shareClasses.push(new ShareClassSummaryRaw("A Inc", "A", 187.53, 345.67, isoCodeToCurrencyMap.get("EUR"), this.historySize));
        this.shareClasses.push(new ShareClassSummaryRaw("A NOK Acc", "A", 463.27, 12.45, isoCodeToCurrencyMap.get("NOK"), this.historySize));
        this.shareClasses.push(new ShareClassSummaryRaw("A SGD Acc", "A", 1636.01, 789.12, isoCodeToCurrencyMap.get("SGD"), this.historySize));
        this.shareClasses.push(new ShareClassSummaryRaw("A USD Acc", "A", 245.96, 578.34, isoCodeToCurrencyMap.get("USD"), this.historySize));
        this.shareClasses.push(new ShareClassSummaryRaw("A1 EUR Acc", "A", 12.64, 212.45, isoCodeToCurrencyMap.get("EUR"), this.historySize));
        this.shareClasses.push(new ShareClassSummaryRaw("A1 USD Acc", "A", 53.68, 528.83, isoCodeToCurrencyMap.get("USD"), this.historySize));
        this.shareClasses.push(new ShareClassSummaryRaw("B EUR Acc", "B", 957.86, 65.87, isoCodeToCurrencyMap.get("EUR"), this.historySize));
        this.shareClasses.push(new ShareClassSummaryRaw("B USD Acc", "B", 747.22, 71.01, isoCodeToCurrencyMap.get("USD"), this.historySize));
        this.shareClasses.push(new ShareClassSummaryRaw("C EUR Acc", "C", 446.85, 552.56, isoCodeToCurrencyMap.get("EUR"), this.historySize));

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

        var shareClassesPositionHistoryList = new Array<Array<number>>();
        this.shareClasses.forEach( (shareClass: ShareClassSummaryRaw)=> {
            shareClassesPositionHistoryList.push(shareClass.extractPositionHistory(this.selectedCurrency));
        });
        for (var i=0; i<shareClassesPositionHistoryList.length; i++) {
            for (var j=i+1; j<shareClassesPositionHistoryList.length; j++) {
                for (var k=0; k<this.historySize; k++) {
                    var positionShareClassI = shareClassesPositionHistoryList[i][k];
                    var positionShareClassJ = shareClassesPositionHistoryList[j][k];
                    var minPosition = Math.min(positionShareClassI, positionShareClassJ);
                    var transferAmount = Math.random() * (minPosition/8);
                    if (Math.random()>0.5) {
                        transferAmount = -transferAmount;
                    }
                    this.shareClasses[i].setInterShareClassTransfers(transferAmount, this.selectedCurrency, this.shareClasses[j].className, k);
                    this.shareClasses[j].setInterShareClassTransfers(-transferAmount, this.selectedCurrency, this.shareClasses[i].className, k);
                }
            }
        }

        var totalDealerWeight = 0;
        this.dealers.forEach( (dealer : Dealer) => {
            totalDealerWeight += dealer.weight;
        });
        this.dealers.forEach( (dealer : Dealer) => {
            dealer.weight = dealer.weight/totalDealerWeight;
        });
    }

    public getSelectedCurrency() : Currency {
        return this.selectedCurrency;
    }

    public setSelectedCurrency(currency : Currency) {
        if (this.selectedCurrency!=currency) {
            this.selectedCurrency = currency;
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
            rslt.push(shareClass.extract(requestedCurrency, isLastNav));
        });

        return rslt;
    }

    public getLegalFund(legalFund: string, requestedCurrency: Currency, isLastNav: boolean): LegalFundPositionSummary {
        var totalPosition = 0;
        this.getShareClasses(legalFund, requestedCurrency, isLastNav).forEach ( (shareClass: ShareClassSummary) => {
            totalPosition += shareClass.positionValueInRequestedCurrency;
        });
        return new LegalFundPositionSummary(legalFund, totalPosition, requestedCurrency.isoCode);
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
            rslt.push(new ShareClassPositionHistory(shareClass.className, shareClass.extractPositionHistory(requestedCurrency)));
        });
        return rslt;
    }

    public getLegalFundConsolidatedInterShareClassesTransferHistory(requestedCurrency: Currency, mustExtractPositiveBalance: boolean): Array<number> {
        var rslt = new Array<number>(this.historySize);
        rslt.fill(0);
        this.shareClasses.forEach( (shareClass: ShareClassSummaryRaw) => {
            var amountHistory = shareClass.extractConsolidatedInterClassTransferHistory(requestedCurrency, mustExtractPositiveBalance);
            for (var i=0; i<this.historySize; i++) {
                rslt[i] += amountHistory[i];
            }
        });
        return rslt;
    }

    public getConsolidatedInterShareClassesTransferHistory(requestedCurrency: Currency, referenceShareClassName: string, mustExtractPositiveBalance: boolean): Array<number> {
        var shareClass: ShareClassSummaryRaw = this.findShareClassByName(referenceShareClassName);
        if (shareClass) {
            return shareClass.extractConsolidatedInterClassTransferHistory(requestedCurrency, mustExtractPositiveBalance);
        }
        return null;
    }

    public getSpecificInterShareClassesTransferHistory(requestedCurrency: Currency, referenceShareClassName: string, counterpartyShareClassName: string, mustExtractPositiveBalance: boolean): Array<number> {
        var shareClass: ShareClassSummaryRaw = this.findShareClassByName(referenceShareClassName);
        if (shareClass) {
            return shareClass.extractSpecificInterClassTransferHistory(requestedCurrency, counterpartyShareClassName, mustExtractPositiveBalance);
        }
        return null;
    }

    private findShareClassByName(shareClassName: string): ShareClassSummaryRaw {
        for (var i=0; i<this.shareClasses.length; i++) {
            if (this.shareClasses[i].className==shareClassName) {
                return this.shareClasses[i];
            }
        }
        return null;
    }
    
}
