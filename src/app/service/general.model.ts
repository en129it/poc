export class Currency {
    constructor(public isoCode: string, public exchangeRate: number, public refCurrencyIsoCode: string) {}
}

export class ShareClassSummaryRaw {
    private quantity : Array<number>;
    private price: Array<number>;

    constructor(public className: string, public type: string, private startQuantity: number, private startPrice: number, public currency: string) {
        var suiteSize = 10;
        this.quantity = this.generateRandomNumberSuite(startQuantity, 5, suiteSize);
        this.price = this.generateRandomNumberSuite(startPrice, 15, suiteSize);
    }

    public extract(currency: Currency, isLastNav: boolean, shareClassCurrency: Currency) : ShareClassSummary {
        var index = isLastNav ? (this.quantity.length-2) : (this.quantity.length-1);

        var priceValue = this.price[index];
        var quantityValue = this.quantity[index]; 
        var positionValue = this.formatDecimal(priceValue * quantityValue, 2);
        var positionValueInRequestedCurrency = this.formatDecimal( positionValue * currency.exchangeRate / shareClassCurrency.exchangeRate, 2);
        var previousPositionValue = (this.price[index-1] * this.quantity[index-1]);
        var variation = this.formatDecimal( (positionValue - previousPositionValue)*100/previousPositionValue , 2);
        var variationStr = (variation>0) ? ("+" + variation) : ("" + variation);
        return new ShareClassSummary(this.className, this.type, quantityValue, priceValue, this.currency, positionValue, this.currency, positionValueInRequestedCurrency, currency.isoCode, variationStr);
    }

    public extractPositionHistory(currency: Currency, shareClassCurrency: Currency): Array<number> {
        var rslt = new Array<number>();

        var positionValue = 0; var positionValueInRequestedCurrency = 0;
        for (var i=0; i<this.quantity.length; i++) {
            positionValue = this.price[i] * this.quantity[i];
            positionValueInRequestedCurrency = this.formatDecimal( positionValue * currency.exchangeRate / shareClassCurrency.exchangeRate, 2);
            rslt.push(positionValueInRequestedCurrency);
        }
        return rslt;
    }

    private formatDecimal(value:number, nbDecimals:number): number {
        var mult = Math.pow(10, nbDecimals);
        var val = value*mult;
        val = Math.ceil(val);
        return val/mult;
    }

    private generateRandomNumberSuite(startValue: number, maxVariationInPercent: number, suiteSize: number): Array<number> {
        var lastValue = startValue;
        var rslt = new Array<number>();
        rslt.push(this.formatDecimal(lastValue, 2));

        var maxVariation : number;
        for (var i=1; i<suiteSize; i++) {
            maxVariation = lastValue * maxVariationInPercent / 100;
            lastValue = lastValue + ((maxVariation/2) - (Math.random() * maxVariation));
            rslt.push(this.formatDecimal(lastValue, 2));
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