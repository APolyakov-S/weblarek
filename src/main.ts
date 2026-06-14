import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';
import { Page } from './components/view/Page';
import { Header } from './components/view/Header';
import { Modal } from './components/view/Modal';
import { CatalogCard } from './components/view/CatalogCard';
import { PreviewCard } from './components/view/PreviewCard';
import { BasketCard } from './components/view/BasketCard';
import { BasketView } from './components/view/BasketView';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { SuccessView } from './components/view/SuccessView';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct } from './types';

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

const page = new Page(document.body);
const header = new Header(document.body, events);
const modal = new Modal(document.querySelector('.modal') as HTMLElement, () => {
    events.emit('modal:close');
});

const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

if (!cardTemplate) console.error('Шаблон #card-catalog не найден');
if (!previewTemplate) console.error('Шаблон #card-preview не найден');
if (!basketItemTemplate) console.error('Шаблон #card-basket не найден');
if (!basketTemplate) console.error('Шаблон #basket не найден');
if (!orderTemplate) console.error('Шаблон #order не найден');
if (!contactsTemplate) console.error('Шаблон #contacts не найден');
if (!successTemplate) console.error('Шаблон #success не найден');

let basketView: BasketView | null = null;
let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;

async function loadCatalog(): Promise<void> {
    try {
        const response = await webLarekApi.getProducts();
        catalogModel.setItems(response.items);
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
    }
}

events.on('catalog:changed', (items: IProduct[]) => {
    if (!cardTemplate) return;
    const cards = items.map((item: IProduct) => {
        const cardElement = cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!cardElement) return null;
        const card = new CatalogCard(cardElement, events);
        card.data = {
            id: item.id,
            title: item.title,
            price: item.price,
            category: item.category,
            image: CDN_URL + item.image
        };
        return card.render();
    }).filter((card): card is HTMLElement => card !== null);
    page.setCatalog(cards);
});

events.on('preview:changed', (item: IProduct) => {
    if (!previewTemplate) return;
    const isInBasket = basketModel.hasItem(item.id);
    const cardElement = previewTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!cardElement) return;
    const previewCard = new PreviewCard(cardElement, events);
    previewCard.data = {
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: CDN_URL + item.image,
        isInBasket: isInBasket
    };
    modal.open(previewCard.render());
});

events.on('card:select', (data: { id: string }) => {
    const item = catalogModel.getItem(data.id);
    if (item) {
        catalogModel.setPreview(item);
    }
});

events.on('card:add', (data: { id: string }) => {
    const item = catalogModel.getItem(data.id);
    if (item && item.price !== null) {
        basketModel.addItem(item);
        header.setCounter(basketModel.getCount());
        
        const previewItem = catalogModel.getPreview();
        if (previewItem && previewItem.id === data.id) {
            catalogModel.setPreview(previewItem);
        }
        modal.close();
    }
});

events.on('card:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
    header.setCounter(basketModel.getCount());
    
    const previewItem = catalogModel.getPreview();
    if (previewItem && previewItem.id === data.id) {
        catalogModel.setPreview(previewItem);
    }
});

events.on('basket:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
    header.setCounter(basketModel.getCount());
    events.emit('basket:changed', basketModel.getItems());
});

events.on('basket:changed', (items: IProduct[]) => {
    if (basketView && basketItemTemplate) {
        const cards = items.map((item: IProduct, index: number) => {
            const cardElement = basketItemTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
            if (!cardElement) return null;
            const card = new BasketCard(cardElement, events);
            card.data = {
                id: item.id,
                title: item.title,
                price: item.price,
                index: index + 1
            };
            return card.render();
        }).filter((card): card is HTMLElement => card !== null);
        basketView.setItems(cards);
        basketView.setTotal(basketModel.getTotal());
    }
});

events.on('header:basket', () => {
    if (!basketTemplate) return;
    const basketElement = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!basketElement) return;
    basketView = new BasketView(basketElement, events);
    events.emit('basket:changed', basketModel.getItems());
    modal.open(basketView.render());
});



events.on('basket:order', () => {
    events.emit('order:start');
});

events.on('order:start', () => {
    if (!orderTemplate) return;
    const orderElement = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!orderElement) return;
    orderForm = new OrderForm(orderElement, events);
    modal.open(orderForm.render());
});

events.on('order:submit', (data: { payment: 'card' | 'cash'; address: string }) => {
    orderModel.setPayment(data.payment);
    orderModel.setAddress(data.address);
    
    if (!contactsTemplate) return;
    const contactsElement = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!contactsElement) return;
    contactsForm = new ContactsForm(contactsElement, events);
    modal.open(contactsForm.render());
});

events.on('contacts:submit', async (data: { email: string; phone: string }) => {
    orderModel.setEmail(data.email);
    orderModel.setPhone(data.phone);
    
    const errors = orderModel.validate();
    if (Object.keys(errors).length > 0) {
        if (contactsForm) {
            contactsForm.setErrors(errors);
        }
        return;
    }
    
    try {
        const items = basketModel.getItems().map((item: IProduct) => item.id);
        const total = basketModel.getTotal();
        const orderRequest = orderModel.createRequest(items, total);
        
        const result = await webLarekApi.postOrder(orderRequest);
        
        basketModel.clear();
        orderModel.clear();
        header.setCounter(0);
        events.emit('basket:changed', []);
        
        if (!successTemplate) return;
        const successElement = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!successElement) return;
        const successView = new SuccessView(successElement, events);
        successView.total = result.total;
        modal.open(successView.render());
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
        if (contactsForm) {
            contactsForm.setErrors({ email: 'Ошибка сервера. Попробуйте позже.' });
        }
    }
});

events.on('success:close', () => {
    modal.close();
});

events.on('modal:close', () => {
    orderForm = null;
    contactsForm = null;
    basketView = null;
});

loadCatalog();