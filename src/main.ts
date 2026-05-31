import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL } from './utils/constants';
import { IProduct, IBuyer } from './types';

const events = new EventEmitter();
const baseApi = new Api(API_URL);
const webLarekApi = new WebLarekApi(baseApi);

const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

events.on('catalog:changed', (data: IProduct[]) => {
    console.log('Событие: каталог обновлён. Количество товаров:', data.length || 0);
});

events.on('cart:changed', (data: IProduct[]) => {
    console.log('Событие: корзина изменена. Товаров в корзине:', data.length || 0);
});

events.on('buyer:changed', (data: IBuyer) => {
    console.log('Событие: данные покупателя изменены:', data);
});

// === ТЕСТИРОВАНИЕ РАБОТЫ С СЕРВЕРОМ ===
console.log('\n========== ПОЛУЧЕНИЕ ТОВАРОВ С СЕРВЕРА ==========');

webLarekApi.getProducts()
  .then(products => {
    console.log('1. Товары получены с сервера:', products);
    console.log('2. Количество полученных товаров:', products.length);
    
    // Сохраняем полученные товары в модель каталога
    catalogModel.setItems(products);
    console.log('3. Товары сохранены в каталог. Каталог после сохранения:', catalogModel.getItems());
    
    // Проверяем работу модели с реальными данными
    const firstProduct = catalogModel.getItem(products[0].id);
    console.log('4. Получение первого товара из каталога по id:', firstProduct);
    
    return products;
  })
  .catch(error => {
    console.error('Ошибка при получении товаров с сервера:', error);
  });

// === ТЕСТИРОВАНИЕ ОТПРАВКИ ЗАКАЗА (опционально) ===
console.log('\n========== ТЕСТИРОВАНИЕ ОТПРАВКИ ЗАКАЗА ==========');

// Пример данных для отправки заказа
const testOrderData = {
  payment: 'card' as const,
  email: 'test@example.com',
  phone: '+79991234567',
  address: 'г. Москва, ул. Тестовая, д. 1',
  total: 750,
  items: ['854cef69-976d-4c2a-a18c-2aa45046c390']
};

webLarekApi.postOrder(testOrderData)
  .then(result => {
    console.log('Результат оформления заказа:', result);
    console.log('ID заказа:', result.id);
    console.log('Сумма заказа:', result.total);
  })
  .catch(error => {
    console.error('Ошибка при отправке заказа:', error);
  });

