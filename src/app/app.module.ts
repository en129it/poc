import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DynamicTableComponent, TableCell, TableHeaderCell, CellDirective } from './table/table.component';
import { DefaultTableHeaderMetadata, DefaultTableHeaderCellRenderer, DefaultTableColumnMetadata, DefaultTableCellRenderer } from './table/render/default.render';
import { TabGroupComponent, TabComponent, TabBodyComponent } from './tab/tab.component';
import { DataService } from './service/general.service';
import { SubPanelService } from './service/subpanel.service';
import { Currency, ShareClassSummary } from './service/general.model';
import { MenuComponent } from './menu/menu.component';
import { SubPanelTitleComponent, SubPanelGroupComponent, SubPanelComponent, PanelComponent } from './subpanel/subpanel.component';
import { PieGraphComponent } from './graph/graph.component';
import { LegalFundPanel } from './legalFund.panel';
import { AccountSearchPanel } from './accountSearch.panel';
import { TileComponent, TileGroupComponent, TileItemComponent } from './tile/tile.component';
import { AutoCompleteComponent } from './widget.component';
import { MyRootComponent, MyOtherComponent, MyComponent, MyDirective } from './test/test.component';

const appRoutes: Routes = [
 { path: '', component: LegalFundPanel },
 { path: 'legalFund', component: LegalFundPanel },
 { path: 'accountSearch', component : AccountSearchPanel }
];

@NgModule({
  declarations: [
    AppComponent, DynamicTableComponent, TableCell, TableHeaderCell, DefaultTableHeaderCellRenderer, DefaultTableCellRenderer, CellDirective,
    TabGroupComponent, TabComponent, TabBodyComponent, MenuComponent, SubPanelTitleComponent, SubPanelGroupComponent, SubPanelComponent, PanelComponent, PieGraphComponent,
    LegalFundPanel, AccountSearchPanel, TileComponent, TileGroupComponent, TileItemComponent, AutoCompleteComponent,
    MyRootComponent, MyOtherComponent, MyComponent, MyDirective
  ],
  entryComponents: [
    DefaultTableHeaderCellRenderer, DefaultTableCellRenderer
  ],
  imports: [
    BrowserModule, FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [DataService, SubPanelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
