import { Component, SimpleChange, Input, OnInit } from '@angular/core';
import { DynamicTableComponent } from './table/table.component';
import { DefaultTableHeaderMetadata, DefaultTableColumnMetadata } from './table/render/default.render';
import { TableMetadata, TableColumnGroupMetadata } from './table/model/table.model';
import { TabGroupComponent, TabComponent } from './tab/tab.component';
import { DataService } from './service/general.service';
import { Currency, ShareClassSummary, SelectedCurrencyChangeListener, DealerPositionSummary, ShareClassPositionHistory } from './service/general.model';
import { SubPanelTitleComponent, SubPanelGroupComponent, SubPanelComponent, PanelComponent } from './subpanel/subpanel.component';
import { PieGraphComponent, SerieGraphComponent } from './graph/graph.component';
import { PieSerie, NamedValue, PlotSerie } from './graph/graph.model';
import { MyRootComponent } from './test/test.component';


@Component({
  selector: 'legal-fund',
  templateUrl: './legalFund.panel.html'
})
export class LegalFundPanel implements SelectedCurrencyChangeListener {
  public selectedCurrency: Currency;
  public selectedTabIndex : number;
  shareClassTableMetadata : TableMetadata;
  shareClassData: Array<Array<any>>;
  public pieData : PieSerie;
  public historyData: Array<PlotSerie>;
  dealerTableMetadata : TableMetadata;
  dealerData: Array<any>;

  constructor(private dataService: DataService) {
    this.selectedTabIndex = 0;
    this.dataService.subscribeSelectedCurrencyChange(this);
    this.selectedCurrency = dataService.getSelectedCurrency();
    this.initTablesMetadata();
    this.initShareClassData();
    this.initSubPanel();
  }

  public onTabSelectionChange(newSelectedTabIndex: number) {
    this.selectedTabIndex = newSelectedTabIndex;
    this.initSubPanel();
  }

  public onCurrencyChange(newSelectedCurrency : Currency) {
      console.log("######################## onCurrencyChange " + newSelectedCurrency.isoCode);
      this.selectedCurrency = newSelectedCurrency;
      this.initShareClassData();
      this.initSubPanel();
  }

  private initTablesMetadata() {
    this.shareClassTableMetadata = new TableMetadata();
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Share class', true, true),
      new DefaultTableColumnMetadata("className", true, false) 
    ));
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Type', true, true),
      new DefaultTableColumnMetadata("type", true, false) 
    ));
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Quantity', true, true),
      new DefaultTableColumnMetadata("quantity", false, false)
    ));
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Price', true, true),
      new DefaultTableColumnMetadata("priceValue", false, false), 
      new DefaultTableColumnMetadata("priceCurrency", true, true) 
    ));
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Position', true, true),
      new DefaultTableColumnMetadata("positionValue", false, false), 
      new DefaultTableColumnMetadata("positionCurrency", true, true) 
    ));
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Position', true, true),
      new DefaultTableColumnMetadata("positionValueInRequestedCurrency", false, false), 
      new DefaultTableColumnMetadata("requestedCurrency", true, true) 
    ));
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Var', true, true),
      new DefaultTableColumnMetadata("variation", false, false) 
    ));

    this.dealerTableMetadata = new TableMetadata();
    this.dealerTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Dealer Name', true, true),
      new DefaultTableColumnMetadata("dealerName", true, false) 
    ));
    this.dealerTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Position', true, true),
      new DefaultTableColumnMetadata("positionValue", false, false),
      new DefaultTableColumnMetadata("positionCurrency", true, true) 
    ));
  }

  private initShareClassData() {
    this.shareClassData = [
      this.dataService.getShareClasses('Shroder', this.selectedCurrency, true),
      this.dataService.getShareClasses('Shroder', this.selectedCurrency, false)
    ]
  }

  private initSubPanel() {
    var shareClassData = this.shareClassData[this.selectedTabIndex];

    this.pieData = new PieSerie("Currency repartition");

    var aggrCurrency = new Map<string, number>();
    shareClassData.forEach( (item:ShareClassSummary) => {
      var position = item.positionValueInRequestedCurrency + (aggrCurrency.get(item.positionCurrency) || 0);
      aggrCurrency.set(item.positionCurrency, position);
    });

    aggrCurrency.forEach( (value: number, key: string) => {
      this.pieData.addItem(new NamedValue(key, value));
    });



    this.dealerData = this.dataService.getDealerPositions('Shroder', this.selectedCurrency, (this.selectedTabIndex==0));



    this.historyData = new Array<PlotSerie>();
    var shareClassPositionHistory = this.dataService.getLegalFundPositionHistory('Shroder', this.selectedCurrency);
    shareClassPositionHistory.forEach( (shareClassPositionHistory: ShareClassPositionHistory) => {
      this.historyData.push(new PlotSerie(shareClassPositionHistory.className, shareClassPositionHistory.history));
    });
  }

}

