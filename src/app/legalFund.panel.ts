import { Component, SimpleChange, Input, OnInit, ViewChild } from '@angular/core';
import { DynamicTableComponent } from './table/table.component';
import { DefaultTableHeaderMetadata, DefaultTableColumnMetadata } from './table/render/default.render';
import { TableMetadata, TableColumnGroupMetadata } from './table/model/table.model';
import { TabGroupComponent, TabComponent } from './tab/tab.component';
import { DataService } from './service/general.service';
import { Currency, ShareClassSummary, LegalFundPositionSummary, SelectedCurrencyChangeListener, DealerPositionSummary, ShareClassPositionHistory } from './service/general.model';
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
  public currencyPieData : PieSerie;
  public historyData: Array<PlotSerie>;
  dealerTableMetadata : TableMetadata;
  dealerData: Array<DealerPositionSummary>;
  public dealerPieData : PieSerie;
  public legalFundConsolidatedInterClassTransfer : Array<PlotSerie>;
  public selectedShareClassName: string;
  public shareClassNames: Array<string>;
  public shareClassConsolidatedInterClassTransfer : Array<PlotSerie>;
  public selectedCounterpartyShareClassName: string;
  public counterpartyShareClassNames: Array<string>;
  public counterpartyShareClassConsolidatedInterClassTransfer : Array<PlotSerie>;
  @ViewChild("shareClassDetailForTitle") shareClassDetailForTitleElem : SubPanelTitleComponent;
  @ViewChild("counterpartyDetailWithTitle") counterpartyDetailWithTitleElem : SubPanelTitleComponent;

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
      new DefaultTableColumnMetadata("positionCurrency", true, false) 
    ));
  }

  private initShareClassData() {
    this.shareClassData = [
      this.dataService.getShareClasses('Shroder', this.selectedCurrency, true),
      this.dataService.getShareClasses('Shroder', this.selectedCurrency, false)
    ]

    this.shareClassNames = new Array<string>();
    this.shareClassData[0].forEach( (shareClass : ShareClassSummary)=> {
      this.shareClassNames.push(shareClass.className);
    });
    this.selectedShareClassName = this.shareClassNames[0];

    var legalFundSummaryLastNav : LegalFundPositionSummary = this.dataService.getLegalFund('Shroder', this.selectedCurrency, true);
    this.shareClassData[0].push(new ShareClassSummary('TOTAL', null, null, null, null, null, null, legalFundSummaryLastNav.positionValueInRequestedCurrency, legalFundSummaryLastNav.requestedCurrency, null));
    var legalFundSummaryForecasting : LegalFundPositionSummary = this.dataService.getLegalFund('Shroder', this.selectedCurrency, false);
    this.shareClassData[1].push(new ShareClassSummary('TOTAL', null, null, null, null, null, null, legalFundSummaryForecasting.positionValueInRequestedCurrency, legalFundSummaryForecasting.requestedCurrency, null));
  }

  private initSubPanel() {
    var shareClassData = this.shareClassData[this.selectedTabIndex];

    this.currencyPieData = new PieSerie("Currency repartition");

    var aggrCurrency = new Map<string, number>();
    for (var i=0; i<shareClassData.length-1; i++) {
      var position = shareClassData[i].positionValueInRequestedCurrency + (aggrCurrency.get(shareClassData[i].positionCurrency) || 0);
      aggrCurrency.set(shareClassData[i].positionCurrency, position);
    }

    aggrCurrency.forEach( (value: number, key: string) => {
      this.currencyPieData.addItem(new NamedValue(key, value));
    });



    this.dealerData = this.dataService.getDealerPositions('Shroder', this.selectedCurrency, (this.selectedTabIndex==0));
    this.dealerPieData = new PieSerie("Top 10 Dealer repartition");
    this.dealerData.forEach( (dealer : DealerPositionSummary) => {
      this.dealerPieData.addItem(new NamedValue(dealer.dealerName, dealer.positionValue));
    } );

    this.historyData = new Array<PlotSerie>();
    var shareClassPositionHistory = this.dataService.getLegalFundPositionHistory('Shroder', this.selectedCurrency);
    shareClassPositionHistory.forEach( (shareClassPositionHistory: ShareClassPositionHistory) => {
      this.historyData.push(new PlotSerie(shareClassPositionHistory.className, shareClassPositionHistory.history));
    });



    this.legalFundConsolidatedInterClassTransfer = new Array<PlotSerie>();
    this.legalFundConsolidatedInterClassTransfer.push(new PlotSerie('Total', this.dataService.getLegalFundConsolidatedInterShareClassesTransferHistory(this.selectedCurrency, true)));    

    this.initInterClassTransferData();
  }

  private initInterClassTransferData() {
    var incomeTransferHistory = this.dataService.getConsolidatedInterShareClassesTransferHistory(this.selectedCurrency, this.selectedShareClassName, true);
    var outcomeTransferHistory = this.dataService.getConsolidatedInterShareClassesTransferHistory(this.selectedCurrency, this.selectedShareClassName, false);
    var netTransferHistory = new Array<number>();

    for (var i=0; i<incomeTransferHistory.length; i++) {
      netTransferHistory[i] = incomeTransferHistory[i] + outcomeTransferHistory[i];
    }

    this.shareClassConsolidatedInterClassTransfer = new Array<PlotSerie>();
    this.shareClassConsolidatedInterClassTransfer.push(new PlotSerie('Cash In', incomeTransferHistory));
    this.shareClassConsolidatedInterClassTransfer.push(new PlotSerie('Cash Out', outcomeTransferHistory));
    this.shareClassConsolidatedInterClassTransfer.push(new PlotSerie('Net Transfer', netTransferHistory));

    this.counterpartyShareClassNames = new Array<string>();
    this.shareClassNames.forEach( (shareClassName: string) => {
      if (shareClassName!=this.selectedShareClassName) {
        this.counterpartyShareClassNames.push(shareClassName);
      }
    });
    this.selectedCounterpartyShareClassName = this.counterpartyShareClassNames[0]; 

    this.initCounterpartyInterClassTransferData();    
  }

  private initCounterpartyInterClassTransferData() {
    var incomeTransferHistory = this.dataService.getSpecificInterShareClassesTransferHistory(this.selectedCurrency, this.selectedShareClassName, this.selectedCounterpartyShareClassName, true);
    var outcomeTransferHistory = this.dataService.getSpecificInterShareClassesTransferHistory(this.selectedCurrency, this.selectedShareClassName, this.selectedCounterpartyShareClassName, false);
    var netTransferHistory = new Array<number>();

    for (var i=0; i<incomeTransferHistory.length; i++) {
      netTransferHistory[i] = incomeTransferHistory[i] + outcomeTransferHistory[i];
    }

    this.counterpartyShareClassConsolidatedInterClassTransfer = new Array<PlotSerie>();
    this.counterpartyShareClassConsolidatedInterClassTransfer.push(new PlotSerie('Cash In', incomeTransferHistory));
    this.counterpartyShareClassConsolidatedInterClassTransfer.push(new PlotSerie('Cash Out', outcomeTransferHistory));
    this.counterpartyShareClassConsolidatedInterClassTransfer.push(new PlotSerie('Net Transfer', netTransferHistory));
  }

  public onShareClassSelectionChange(newSelectedShareClassName: string) {
    this.selectedShareClassName = newSelectedShareClassName;
    this.initInterClassTransferData();
    this.shareClassDetailForTitleElem.forceSelection();
  }

  public onCounterpartyShareClassSelectionChange(newSelectedCounterpartyShareClassName: string) {
    this.selectedCounterpartyShareClassName = newSelectedCounterpartyShareClassName;
    this.initCounterpartyInterClassTransferData();
    this.counterpartyDetailWithTitleElem.forceSelection();
  }

  public onLegalFundSubPnlLevel1SelectionChanged(newSelectedSubPanelId: string) {
    if ((!newSelectedSubPanelId) || (newSelectedSubPanelId!='shareClassLevel')) {
        this.shareClassDetailForTitleElem.forceUnselection();
    }
  }

  public onInterClassMovLevel1SelectionChanged(newSelectedSubPanelId: string) {
    if (!newSelectedSubPanelId) {
        this.counterpartyDetailWithTitleElem.forceUnselection();
    }
  }
}

