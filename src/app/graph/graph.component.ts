import { Component, OnInit, OnChanges, AfterViewInit, Input, SimpleChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { PieSerie, NamedValue, PlotSerie } from './graph.model';
declare var Highcharts: any;


@Component({
    selector: 'pie-chart',
    template: `<div #container id="container" style="min-width: 310px; height: 400px; width: 500px; margin: 0 auto; display: inline-block;"></div>`
})
export class PieGraphComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() public data: PieSerie;
    @ViewChild("container") public containerElem: ElementRef; 
    private isActive = false;

    public ngAfterViewInit() {
        this.isActive = true;
        this.drawChart();
    }

    public ngOnInit() {
        this.drawChart();
    }

    public ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        for (let propName in changes) {
            let changedProp = changes[propName];
            let from = changedProp.previousValue;
            let to = changedProp.currentValue;
            if (propName=="data") {
                this.drawChart();
            }
        }
    }

    private drawChart() {
        
        if (this.isActive) {
            Highcharts.chart(this.containerElem.nativeElement, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
                title: {
                    text: ' ',
                    align: 'center',
                    verticalAlign: 'top',
                    y: 40
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: -50,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        },
                        startAngle: -180,
                        endAngle: 180,
                        center: ['50%', '50%']
                    }
                },
                series: [{
                    type: 'pie',
                    name: ' ',
                    innerSize: '50%',
                    data: this.data.extract()
                }]
            });
        }
    }
}

@Component({
    selector: 'series-chart',
    template: `<div #container2 id="container2" style="height: 400px; width: 1100px;"></div>`
})
export class SerieGraphComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() public data: Array<PlotSerie>;
    @ViewChild("container2") public containerElem: ElementRef; 
    private isActive = false;

    public ngAfterViewInit() {
        this.isActive = true;
        this.drawChart();
    }

    public ngOnInit() {
        this.drawChart();
    }

    public ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        for (let propName in changes) {
            let changedProp = changes[propName];
            let from = changedProp.previousValue;
            let to = changedProp.currentValue;
            if (propName=="data") {
                this.drawChart();
            }
        }
    }
    private drawChart() {
        Highcharts.chart(this.containerElem.nativeElement, {
            chart: {
                width: 1000,
                plotLeft: 100,
                spacing: [0, 100, 20, 40]  // top, right, bottom, left
            },
            title: {
                text: ' '
            },
            yAxis: {
                title: {
                    text: ' Amount'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                series: {
                    pointStart: 2010
                }
            },

            series: this.data
        });
    }
}