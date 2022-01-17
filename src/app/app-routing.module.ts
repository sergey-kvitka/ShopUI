import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthorizationComponent} from "./authorization/authorization.component";
import {ProfileComponent} from "./profile/profile.component";
import {OrderComponent} from "./orderlist/order/order.component";
import {ShoplistComponent} from "./shoplist/shoplist.component";
import {CatalogComponent} from "./catalog/catalog.component";
import {OrderlistComponent} from "./orderlist/orderlist.component";

const routes: Routes = [
  {path: 'authorization', component: AuthorizationComponent},
  {path: '', component: AuthorizationComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'orders', component: OrderlistComponent},
  {path: 'shoplist', component: ShoplistComponent},
  {path: 'catalog', component: CatalogComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
