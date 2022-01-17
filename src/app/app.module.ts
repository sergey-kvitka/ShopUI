import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AuthorizationComponent} from './authorization/authorization.component';
import {ProfileComponent} from './profile/profile.component';
import {CatalogComponent} from './catalog/catalog.component';
import {HttpClientModule} from "@angular/common/http";
import {OrderComponent} from './orderlist/order/order.component';
import {OrderlistComponent} from './orderlist/orderlist.component';
import {OrderItemComponent} from './orderlist/order/order-item/order-item.component';
import {ShoplistComponent} from "./shoplist/shoplist.component";

@NgModule({
    declarations: [
        AppComponent,
        AuthorizationComponent,
        ProfileComponent,
        CatalogComponent,
        OrderComponent,
        OrderlistComponent,
        OrderItemComponent,
        ShoplistComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}