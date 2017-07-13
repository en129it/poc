export class NamedValue {
    constructor(public name, public value: number) {}
}

export class PieSerie {
    private items: Array<NamedValue> = new Array<NamedValue>();

    constructor(public title) {}

    public addItem(item : NamedValue) {
        this.items.push(item);
    }

    public extract(): Array<Array<any>> {
        var rslt = new Array<Array<any>>();

        var total = 0;
        this.items.forEach( (item: NamedValue) => {
            total += item.value;
        });

        this.items.forEach( (item: NamedValue) => {
            var rsltItem = [item.name, item.value*100/total];
            rslt.push(rsltItem);
        });
        
        return rslt;
    }
}

export class PlotSerie {

    constructor(public name: string, public data: Array<number>) {
    }

}