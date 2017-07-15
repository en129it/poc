export class Currency {
    constructor(public isoCode: string, public exchangeRate: number, public refCurrencyIsoCode: string) {}
}

class NamedValue {
    constructor(public name, public value: number) {}
}

export class ShareClassSummaryRaw {
    private quantity : Array<number>;
    private price: Array<number>;
    private incomeHistory: Array<number>;
    private outcomeHistory: Array<number>;
    private interClassTransfer: Array<Map<string, number>>;

    constructor(public className: string, public type: string, private startQuantity: number, private startPrice: number, public currency: Currency, private suiteSize: number) {
        this.quantity = Utils.generateRandomNumberSuite(startQuantity, 5, suiteSize);
        this.price = Utils.generateRandomNumberSuite(startPrice, 15, suiteSize);

        this.incomeHistory = new Array<number>();
        this.outcomeHistory = new Array<number>();
        var previousPosition = (this.quantity[0] * this.price[0]); 
        var position: number; var absoluteVariation: number;
        for (var i=0; i<suiteSize-1; i++) {
            position = (this.quantity[i+1] * this.price[i+1]);
            absoluteVariation = position - previousPosition;
            previousPosition = position;

            var relVariation = Utils.generateRandomNumberSuite(absoluteVariation, 35, 1)[0];
            if (relVariation>absoluteVariation) {
                this.incomeHistory[i] = relVariation;
                this.outcomeHistory[i] = absoluteVariation - (relVariation - absoluteVariation);
            } else {
                this.outcomeHistory[i] = relVariation;
                this.incomeHistory[i] = absoluteVariation + (absoluteVariation + relVariation);
            }
        }
        this.interClassTransfer = new Array<Map<string, number>>();
    }

    public extract(requestedCurrency: Currency, isLastNav: boolean) : ShareClassSummary {
        var index = isLastNav ? (this.quantity.length-2) : (this.quantity.length-1);

        var priceValue = this.price[index];
        var quantityValue = this.quantity[index]; 
        var positionValue = priceValue * quantityValue;
        var positionValueInRequestedCurrency = positionValue * requestedCurrency.exchangeRate / this.currency.exchangeRate;
        var previousPositionValue = (this.price[index-1] * this.quantity[index-1]);
        var variation = (positionValue - previousPositionValue)*100/previousPositionValue;
        var variationStr = ((variation>0) ? "+" : "") + Utils.formatDecimalStr(variation, 2);
        return new ShareClassSummary(this.className, this.type, quantityValue, priceValue, this.currency.isoCode, positionValue, this.currency.isoCode, positionValueInRequestedCurrency, requestedCurrency.isoCode, variationStr);
    }

    public extractPositionHistory(requestedCurrency: Currency): Array<number> {
        var rslt = new Array<number>();

        var positionValue = 0; var positionValueInRequestedCurrency;
        for (var i=0; i<this.quantity.length; i++) {
            positionValue = this.price[i] * this.quantity[i];
            positionValueInRequestedCurrency = Utils.formatDecimal( positionValue * requestedCurrency.exchangeRate / this.currency.exchangeRate, 2);
            rslt.push(positionValueInRequestedCurrency);
        }
        return rslt;
    }

    public setInterShareClassTransfers(amount: number, currency: Currency, counterpartyShareClassName: string, historyId: number): void {
        var interClassTransfer = this.interClassTransfer[historyId];
        if (!interClassTransfer) {
            interClassTransfer = new Map<string, number>();
            this.interClassTransfer[historyId] = interClassTransfer;
        }
        interClassTransfer.set(counterpartyShareClassName, (amount * this.currency.exchangeRate / currency.exchangeRate));
    }

    public extractConsolidatedInterClassTransferHistory(requestedCurrency: Currency, mustExtractPositiveBalance: boolean): Array<number> {
        var rslt = new Array<number>(this.interClassTransfer.length);
        rslt.fill(0);
        for (var i=0; i<this.interClassTransfer.length; i++) {
            var interClassTransferMap: Map<string, number> = this.interClassTransfer[i];
            interClassTransferMap.forEach( (amount: number, shareClassName: string) => {
                if ((mustExtractPositiveBalance && (amount>0)) || (!mustExtractPositiveBalance && (amount<0))) {
                    rslt[i] += amount * requestedCurrency.exchangeRate / this.currency.exchangeRate;
                }
            });
        }
        return rslt;
    }

    public extractSpecificInterClassTransferHistory(requestedCurrency: Currency, counterpartyShareClassName: string, mustExtractPositiveBalance: boolean): Array<number> {
        var rslt = new Array<number>(this.interClassTransfer.length);
        rslt.fill(0);
        for (var i=0; i<this.interClassTransfer.length; i++) {
            var interClassTransferMap: Map<string, number> = this.interClassTransfer[i];
            var amount = interClassTransferMap.get(counterpartyShareClassName);
            if ((mustExtractPositiveBalance && (amount>0)) || (!mustExtractPositiveBalance && (amount<0))) {
                rslt[i] = amount * requestedCurrency.exchangeRate / this.currency.exchangeRate;
            }
        }
        return rslt;
    }
}

export class ShareClassSummary {
    constructor(public className: string, public type: string, public quantity: number, public priceValue: number, public priceCurrency: string, public positionValue: number, public positionCurrency: string, public positionValueInRequestedCurrency: number, public requestedCurrency: string, public variation: string) {}
}

export interface SelectedCurrencyChangeListener {
    onCurrencyChange(newCurrency: Currency);
}

export class Dealer {
    constructor(public dealerName: string, public weight: number) {}
}

export class DealerPositionSummary {
    constructor(public dealerName: string, public positionValue: number, public positionCurrency: string) {}
}

export class ShareClassPositionHistory {
    constructor(public className: string, public history: Array<number>) {}
}

export class LegalFundPositionSummary {
    constructor(public legalFundName: string, public positionValueInRequestedCurrency: number, public requestedCurrency: string) {}
}

export class Utils {

    public static formatDecimal(value:number, nbDecimals:number): number {
        var mult = Math.pow(10, nbDecimals);
        var val = value*mult;
        val = Math.ceil(val);
        return val/mult;
    }

    public static formatDecimalStr(value:number, nbDecimals:number): string {
        var rslt = "" + this.formatDecimal(value, nbDecimals);

        var pos = rslt.indexOf(".");
        if (pos==-1) {
            rslt += '.';
            pos = 0;
        }
        pos = nbDecimals - (rslt.length - pos -1);
        if (pos>0) {
            for (var i=0; i<pos; i++) {
                rslt += "0";
            }
        }

        return rslt;
    }

    public static generateRandomNumberSuite(startValue: number, maxVariationInPercent: number, suiteSize: number): Array<number> {
        var lastValue = startValue;
        var rslt = new Array<number>();
        rslt.push(lastValue);

        var maxVariation : number;
        for (var i=1; i<suiteSize; i++) {
            maxVariation = lastValue * maxVariationInPercent / 100;
            lastValue = lastValue + ((maxVariation/2) - (Math.random() * maxVariation));
            rslt.push(lastValue);
        }

        return rslt;
    }
    
}