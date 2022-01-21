import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Order} from "../orderlist.component";
import {HttpClient} from "@angular/common/http";
import {UsernameToken} from "../../authorization/authorization.component";
import {Router} from "@angular/router";
import * as moment from 'moment';
import 'moment/locale/ru';

export class OrderItemInfo {
    constructor(
        public id: number,
        public orderId: number,
        public productId: number,
        public productName: string,
        public amount: number,
        public totalPrice: number
    ) {
    }
}

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

    @Input() orderId: any;
    @Input() orderUserId: any;
    @Input() orderDate: any;
    order?: Order;

    @Output() deletionDetector = new EventEmitter();

    orderItems: OrderItemInfo[] = [];

    constructor(
        private httpClient: HttpClient,
        private router: Router
    ) {
    }

    ngOnInit(): void {
        this.order = new Order(this.orderId, this.orderUserId, this.orderDate);

        this.httpClient.get<OrderItemInfo[]>(`http://localhost:8080/shop/order_${this.order.id}/orderItems`,
            {headers: UsernameToken.headerWithToken()})
            .subscribe(result => {
                if (result == null) {
                    this.router.navigate(UsernameToken.toAuth()).then();
                } else {
                    this.orderItems = result;
                }
            }, () => {
                this.router.navigate(UsernameToken.toAuth()).then();
            });
    }

    emitDeletionDetector() {
        this.deletionDetector.emit();
    }

    orderDateFormatted(date: Date): string {
        return moment(new Date('' + date)).format('L');
    }

    orderDatePast(date: Date): string {
        return moment(new Date('' + date)).fromNow();
    }

    getUsername(): string {
        return UsernameToken.username();
    }

    deleteOrder(orderId: number) {
        let confirmation = confirm(`Вы действительно хотите удалить заказ №${orderId}?`);
        if (!confirmation) return;
        this.httpClient.delete<boolean>(`http://localhost:8080/shop/deleteOrder/${orderId}`,
            {headers: UsernameToken.headerWithToken()})
            .subscribe(result => {
                    if (!result) {
                        alert('Произошла ошибка. Попробуйте позже или после перезагрузки страницы');
                    } else {
                        this.emitDeletionDetector();
                    }
                }, () => alert('Произошла ошибка. Попробуйте позже или после перезагрузки страницы')
            );
    }

    getTotalPrice() {
        let sum: number = 0;
        this.orderItems.forEach(order => {
            sum += order.totalPrice;
        });
        return sum;
    }
}

