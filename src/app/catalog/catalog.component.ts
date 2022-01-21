import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UsernameToken} from "../authorization/authorization.component";
import * as moment from 'moment';
import 'moment/locale/ru';
import {ShopList} from "../shoplist/shoplist.component";

export class CatalogProduct {
    constructor(
        public productId: number,
        public productName: string,
        public productTypeName: string,
        public attributesAndValues: Map<string, string[]>,
        public amount: number,
        public price: number,
    ) {
    }
}

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

    catalogProductsByTypeName: Map<string, CatalogProduct[]> = new Map<string, CatalogProduct[]>();

    constructor(
        private httpClient: HttpClient,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.httpClient.get<string>('http://localhost:8080/shop/validateToken',
            {headers: UsernameToken.headerWithToken()})
            .subscribe(res => {
                if (!res) this.router.navigate(['/authorization']).then();
            }, () => this.router.navigate(['/authorization']).then());

        this.httpClient.get<CatalogProduct[]>('http://localhost:8080/shop/getCatalog',
            {headers: UsernameToken.headerWithToken()}).subscribe(
            result => {
                this.catalogProductsByTypeName = this.sortProductsInMap(result);
            }
        );
    }

    private sortProductsInMap(catalogProducts: CatalogProduct[]): Map<string, CatalogProduct[]> {
        let productTypeSet: Set<string> = new Set<string>();
        let result: Map<string, CatalogProduct[]> = new Map<string, CatalogProduct[]>();
        catalogProducts.forEach(product => {
            productTypeSet.add(product.productTypeName);
        });
        productTypeSet.forEach(productType => {
            let arr: CatalogProduct[] = [];
            catalogProducts.forEach(product => {
                if (product.productTypeName == productType) {
                    arr.push(product);
                }
            });
            result.set(productType, arr);
        });
        return result;
    }

    getValue(values: string[]): string {
        let absent = 'не указано';
        if (values == undefined) return absent;
        if (values[1] != '') return moment(new Date(values[1])).format('LL');
        return values[0] == '' ? absent : values[0];
    }

    addToShopList(product: CatalogProduct) {
        // @ts-ignore
        let amountToAdd: number | null = document.getElementById(`input_${product.productId}`).value;
        if (amountToAdd == null) {
            amountToAdd = 0;
        }
        amountToAdd = Math.round(amountToAdd);
        if (amountToAdd < 0) {
            return alert('Нельзя добавить отрицательное количество продуктов');
        }
        if (amountToAdd == 0) return;

        let productFromShopList = ShopList.getProduct(product.productId);
        if (((productFromShopList == null) ? 0 : productFromShopList.amount)
            + amountToAdd > product.amount) {
            return alert('Количество товара в корзине не может быть больше количества на складе');
        }
        ShopList.addProduct(product, amountToAdd);
    }

    removeFromShopList(productId: number) {
        ShopList.deleteProduct(productId);
    }

    getProductFromShopList(id: number) {
        return ShopList.getProduct(id);
    }
}
