import { Component, SimpleChange } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicTableComponent } from './table/table.component';
import { DefaultTableHeaderMetadata, DefaultTableColumnMetadata } from './table/render/default.render';
import { TableMetadata, TableColumnGroupMetadata } from './table/model/table.model';
import { TabGroupComponent, TabComponent } from './tab/tab.component';
import { DataService } from './service/general.service';
import { Currency, ShareClassSummary } from './service/general.model';
import { SubPanelTitleComponent, SubPanelGroupComponent, SubPanelComponent, PanelComponent } from './subpanel/subpanel.component';
import { PieGraphComponent } from './graph/graph.component';
import { PieSerie, NamedValue } from './graph/graph.model';
import { MyRootComponent } from './test/test.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public selectedCurrency : Currency;

  constructor(private dataService: DataService) {
    this.selectedCurrency = dataService.getSupportedCurrency("EUR");
  }

  public onCurrencySelectionChange(newSelectedCurrency: Currency) {
    this.selectedCurrency = newSelectedCurrency;
  }

}

