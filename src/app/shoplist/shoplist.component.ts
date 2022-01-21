import {Component, OnInit} from '@angular/core';
import {CatalogProduct} from "../catalog/catalog.component";
import {HttpClient} from "@angular/common/http";
import {UsernameToken} from "../authorization/authorization.component";
import {Router} from "@angular/router";

export class ShopList {

    private static readonly LC_SHOP_LIST_KEY: string = 'ls-shop-list-product-';
    private static readonly LC_SHOP_LIST_ITEMS_IDS_KEY: string = 'ls-shop-list-all-ids'
    private static readonly SEPARATOR: string = '%%//%%';

    private static checkIDList() {
        if (localStorage.getItem(this.LC_SHOP_LIST_ITEMS_IDS_KEY) == null) {
            localStorage.setItem(this.LC_SHOP_LIST_ITEMS_IDS_KEY, '');
        }
    }

    private static getIDList() {
        this.checkIDList();
        let result = localStorage.getItem(this.LC_SHOP_LIST_ITEMS_IDS_KEY);
        if (result == '') return [];
        // @ts-ignore
        return result.split(this.SEPARATOR);
    }

    private static addIDToList(id: string) {
        let arr = this.getIDList();
        if (!arr.includes(id)) {
            arr.push(id);
            localStorage.setItem(this.LC_SHOP_LIST_ITEMS_IDS_KEY, arr.join(this.SEPARATOR));
        }
    }

    private static deleteIDFromList(id: string) {
        let arr = this.getIDList();
        if (arr.includes(id)) {
            arr.splice(arr.indexOf(id), 1);
            localStorage.setItem(this.LC_SHOP_LIST_ITEMS_IDS_KEY, arr.join(this.SEPARATOR));
        }
    }

    public static addProduct(product: CatalogProduct, amount: number) {
        if (amount == 0) return;
        let shopListProductStr = localStorage.getItem(this.LC_SHOP_LIST_KEY + product.productId);
        let newProduct = shopListProductStr == null;
        let shopListProduct: (string | number)[] =
            shopListProductStr == null
                ? [product.productName, product.productTypeName, product.price, 0]
                : shopListProductStr.split(this.SEPARATOR);
        if (!newProduct &&
            ([product.productName, product.productTypeName, product.price] !=
                [shopListProduct[0], shopListProduct[1], shopListProduct[2]])) {

            [shopListProduct[0], shopListProduct[1], shopListProduct[2]] =
                [product.productName, product.productTypeName, product.price]
        }
        shopListProduct[3] = (+shopListProduct[3]) + amount;
        this.addIDToList('' + product.productId);
        localStorage.setItem(this.LC_SHOP_LIST_KEY + product.productId, shopListProduct.join(this.SEPARATOR));
    }

    public static deleteProduct(productId: number) {
        this.deleteIDFromList('' + productId);
        localStorage.removeItem(this.LC_SHOP_LIST_KEY + productId);
    }

    public static clearShopList() {
        let arr = this.getIDList();
        arr.forEach(id => {
            this.deleteProduct(+id);
        });
        localStorage.setItem(this.LC_SHOP_LIST_ITEMS_IDS_KEY, '');
    }

    public static getProducts(): ShopListProduct[] {
        let products: ShopListProduct[] = [];
        this.getIDList().forEach(id => {
            if (!localStorage.getItem(this.LC_SHOP_LIST_KEY + id) != null) {
                // @ts-ignore
                let productFromLS: (string | number)[] = localStorage
                    .getItem(this.LC_SHOP_LIST_KEY + id).split(this.SEPARATOR);

                products.push(new ShopListProduct(
                    +id,
                    '' + productFromLS[0],
                    '' + productFromLS[1],
                    +productFromLS[2],
                    +productFromLS[3]
                ));
            }
        });
        return products;
    }

    public static getProduct(id: number): ShopListProduct | null {
        if (localStorage.getItem(this.LC_SHOP_LIST_KEY + id) == null) return null;
        // @ts-ignore
        let productFromLS: (string | number)[] = localStorage
            .getItem(this.LC_SHOP_LIST_KEY + id).split(this.SEPARATOR);
        if (productFromLS == null) return null;

        return new ShopListProduct(
            id,
            '' + productFromLS[0],
            '' + productFromLS[1],
            +productFromLS[2],
            +productFromLS[3]
        );
    }
}

export class ShopListProduct {
    constructor(
        public productId: number,
        public productName: string,
        public productTypeName: string,
        public price: number,
        public amount: number
    ) {
    }
}

export class ProductAmountDto {
    constructor(
        public productId: number,
        public amount: number
    ) {
    }
}

@Component({
    selector: 'app-shoplist',
    templateUrl: './shoplist.component.html',
    styleUrls: ['./shoplist.component.css']
})
export class ShoplistComponent implements OnInit {

    products: ShopListProduct[] = [];

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

        this.products = ShopList.getProducts();
    }

    getSum(): number {
        let sum = 0;
        this.products.forEach(product => {
            sum += product.amount * product.price;
        })
        return sum;
    }

    removeFromShopList(productId: number) {
        ShopList.deleteProduct(productId);
        this.ngOnInit();
    }

    addOrder(products: ShopListProduct[]) {
        let productAmountDtoArr: ProductAmountDto[] = [];
        products.forEach(product => {
            productAmountDtoArr.push(new ProductAmountDto(product.productId, product.amount));
        });

        this.httpClient.post<string>(`http://localhost:8080/shop/addOrder`,
            productAmountDtoArr,
            {headers: UsernameToken.headerWithToken()})
            .subscribe(
                result => {
                    if (result) {
                        ShopList.clearShopList();
                        alert('Заказ оформлен успешно! (см. раздел "Заказы")');
                        this.ngOnInit();
                    } else this.router.navigate(['/authorization']).then();
                },
                error => {
                    if (error.error.text == undefined) {
                        this.router.navigate(['/authorization']).then();
                    }
                    alert(error.error.text);
                }
            );
    }
}
