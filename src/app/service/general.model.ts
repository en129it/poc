export class Currency {
    constructor(public isoCode: string, public exchangeRate: number, public refCurrencyIsoCode: string) {}
}

export class ShareClassSummaryRaw {
    constructor(public className: string, public type: string, private position: Array<number>, public currency: string) {}

    public extract(currency: Currency, isLastNav: boolean, shareClassCurrency: Currency) : ShareClassSummary {
        var positionValue = this.position[isLastNav ? 1 : 2];
        var positionValueInRequestedCurrency = this.formatDecimal( positionValue * currency.exchangeRate / shareClassCurrency.exchangeRate, 2);
        var variation = this.formatDecimal( (positionValue - this.position[isLastNav ? 0 : 1]) , 2);
        return new ShareClassSummary(this.className, this.type, positionValue, this.currency, positionValueInRequestedCurrency, currency.isoCode, variation);
    }

    private formatDecimal(value:number, nbDecimals:number): number {
        var mult = Math.pow(10, nbDecimals);
        var val = value*mult;
        val = Math.ceil(val);
        return val/mult;
    }
}

export class ShareClassSummary {
    constructor(public className: string, public type: string, public positionValue: number, public positionCurrency: string, public positionValueInRequestedCurrency: number, public requestedCurrency: string, public variation: number) {}
}

export interface SelectedCurrencyChangeListener {
    onCurrencyChange(newCurrency: Currency);
}
