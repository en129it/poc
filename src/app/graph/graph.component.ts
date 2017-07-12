import { Component, OnInit, OnChanges, AfterViewInit, Input, SimpleChanges, SimpleChange, ViewChild, ElementRef } from '@angular/core';
import { PieSerie, NamedValue } from './graph.model';
declare var Highcharts: any;


@Component({
    selector: 'pie-chart',
    template: `<div #container id="container" style="min-width: 310px; height: 400px; margin: 0 auto"></div>`
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

