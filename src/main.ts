import '../src/scss/styles.scss';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL } from './utils/constants';

// === ТЕСТИРОВАНИЕ С МОКОВЫМИ ДАННЫМИ ===
console.log('========== ТЕСТИРОВАНИЕ С МОКОВЫМИ ДАННЫМИ ==========');

// Моковые данные
const mockProducts = [
    {
        id: "mock1",
        description: "Моковый товар 1",
        image: "image1.jpg",
        title: "Мок Товар 1",
        category: "софт-скилс",
        price: 1000
    },
    {
        id: "mock2",
        description: "Моковый товар 2",
        image: "image2.jpg",
        title: "Мок Товар 2",
        category: "хард-скилс",
        price: 2000
    }
];

// Тестирование CatalogModel
const catalogModel = new CatalogModel();
console.log('1. CatalogModel - начальное состояние getItems():', catalogModel.getItems());
catalogModel.setItems(mockProducts);
console.log('2. CatalogModel - после setItems(), getItems():', catalogModel.getItems());
console.log('3. CatalogModel - getItem("mock1"):', catalogModel.getItem("mock1"));
catalogModel.setPreview(mockProducts[0]);
console.log('4. CatalogModel - после setPreview(), getPreview():', catalogModel.getPreview());

// Тестирование CartModel
const cartModel = new CartModel();
console.log('\n5. CartModel - начальное состояние getItems():', cartModel.getItems());
console.log('6. CartModel - getCount():', cartModel.getCount());
console.log('7. CartModel - getTotal():', cartModel.getTotal());
cartModel.addItem(mockProducts[0]);
cartModel.addItem(mockProducts[1]);
cartModel.addItem(mockProducts[0]);
console.log('8. CartModel - после addItem() x3, getItems():', cartModel.getItems());
console.log('9. CartModel - getCount():', cartModel.getCount());
console.log('10. CartModel - getTotal():', cartModel.getTotal());
cartModel.removeItem("mock1");
console.log('11. CartModel - после removeItem("mock1"), getItems():', cartModel.getItems());
console.log('12. CartModel - hasItem("mock1"):', cartModel.hasItem("mock1"));
console.log('13. CartModel - hasItem("mock2"):', cartModel.hasItem("mock2"));
cartModel.clear();
console.log('14. CartModel - после clear(), getItems():', cartModel.getItems());

// Тестирование BuyerModel
const buyerModel = new BuyerModel();
console.log('\n15. BuyerModel - начальное состояние getBuyerData():', buyerModel.getBuyerData());
console.log('16. BuyerModel - validate():', buyerModel.validate());
buyerModel.setPayment('card');
buyerModel.setAddress('г. Москва, ул. Тестовая, д. 1');
console.log('17. BuyerModel - после setPayment() и setAddress(), getBuyerData():', buyerModel.getBuyerData());
console.log('18. BuyerModel - validate():', buyerModel.validate());
buyerModel.setEmail('test@example.com');
buyerModel.setPhone('+79991234567');
console.log('19. BuyerModel - после setEmail() и setPhone(), getBuyerData():', buyerModel.getBuyerData());
console.log('20. BuyerModel - validate():', buyerModel.validate());
buyerModel.clear();
console.log('21. BuyerModel - после clear(), getBuyerData():', buyerModel.getBuyerData());
console.log('22. BuyerModel - validate():', buyerModel.validate());

// === ТЕСТИРОВАНИЕ С РЕАЛЬНЫМИ ДАННЫМИ С СЕРВЕРА ===
console.log('\n========== ТЕСТИРОВАНИЕ С РЕАЛЬНЫМИ ДАННЫМИ ==========');

const baseApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(baseApi);

webLarekApi.getProducts()
    .then(response => {
        console.log('23. WebLarekApi.getProducts() - получен ответ от сервера:', response);
        console.log('24. Количество товаров:', response.items.length);
        
        catalogModel.setItems(response.items);
        console.log('25. CatalogModel - после setItems() с реальными данными, getItems():', catalogModel.getItems());
    })
    .catch(error => {
        console.error('Ошибка при получении товаров:', error);
    });