import { Component, SimpleChange, Input, OnInit } from '@angular/core';
import { DynamicTableComponent } from './table/table.component';
import { DefaultTableHeaderMetadata, DefaultTableColumnMetadata } from './table/render/default.render';
import { TableMetadata, TableColumnGroupMetadata } from './table/model/table.model';
import { TabGroupComponent, TabComponent } from './tab/tab.component';
import { DataService } from './service/general.service';
import { Currency, ShareClassSummary, SelectedCurrencyChangeListener } from './service/general.model';
import { SubPanelTitleComponent, SubPanelGroupComponent, SubPanelComponent, PanelComponent } from './subpanel/subpanel.component';
import { PieGraphComponent } from './graph/graph.component';
import { PieSerie, NamedValue } from './graph/graph.model';
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

  constructor(private dataService: DataService) {
    this.selectedTabIndex = 0;
    this.dataService.subscribeSelectedCurrencyChange(this);
    this.selectedCurrency = dataService.getSelectedCurrency();
    this.initShareClassMetadata();
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

  private initShareClassMetadata() {
    this.shareClassTableMetadata = new TableMetadata();
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Share class', true, true),
      new DefaultTableColumnMetadata("className", false, false) 
    ));
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Type', true, true),
      new DefaultTableColumnMetadata("type", false, false) 
    ));
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Position', true, true),
      new DefaultTableColumnMetadata("positionValue", false, false), 
      new DefaultTableColumnMetadata("positionCurrency", false, false) 
    ));
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Position', true, true),
      new DefaultTableColumnMetadata("positionValueInRequestedCurrency", false, false), 
      new DefaultTableColumnMetadata("requestedCurrency", false, false) 
    ));
    this.shareClassTableMetadata.addColumnMetadata(new TableColumnGroupMetadata(
      new DefaultTableHeaderMetadata('Var', true, true),
      new DefaultTableColumnMetadata("variation", false, false) 
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
console.log("######## addPieItem ", value, key);      
    });
  }
}

