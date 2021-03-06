import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../objects/product';
import {ProductService} from '../../services/product.service';
import {LoadingService} from '../../services/loading.service';
import {CartService} from '../../services/cart.service';
import {CartProduct} from '../../objects/cart-product';
import {UnsubscribeOnDestroyAdapter} from '../../utilities/unsubscribe-on-destroy-adapter';
import {DarkModeService} from '../../services/dark-mode.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.page.html',
    styleUrls: ['./product.page.scss'],
})
export class ProductPage extends UnsubscribeOnDestroyAdapter implements OnInit {
    public headerColor: string;

    public product: Product = new Product('-1', '', '', 0, '');
    public productLoaded: boolean;
    public quantity: number;
    public amount = new Array(20);

    constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private router: Router,
                private loadingService: LoadingService, private cartService: CartService, private darkModeService: DarkModeService) {
        super();

        this.quantity = 1;

        this.subscriptions.add(this.darkModeService.getHeaderColor().subscribe(headerColor => {
            this.headerColor = headerColor;
        }));
    }

    async ngOnInit() {
        await this.loadingService.showLoading(false);

        if (this.activatedRoute.snapshot.paramMap.has('id')) {
            const productId = this.activatedRoute.snapshot.paramMap.get('id');

            const product = await this.productService.getProductById(productId);

            if (product !== undefined) {
                this.product = product;
                this.productLoaded = true;
            }
        } else {
            await this.router.navigate(['/products']);
        }

        await this.loadingService.closeLoading();
    }

    async addToCart() {
        this.cartService.addToCart(new CartProduct(this.product, this.quantity));
    }
}
