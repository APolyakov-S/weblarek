import './scss/styles.scss';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';
import { PageView } from './components/view/PageView';
import { CatalogCard } from './components/view/CatalogCard';
import { PreviewCard } from './components/view/PreviewCard';
import { BasketCard } from './components/view/BasketCard';
import { ModalView } from './components/view/ModalView';
import { OrderForm, IOrderFormData } from './components/view/OrderForm';
import { ContactsForm, IContactsFormData } from './components/view/ContactsForm';
import { SuccessView } from './components/view/SuccessView';
import { API_URL } from './utils/constants';
import { IProduct, IOrderData } from './types';

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

const pageView = new PageView(document.body, events);
const modalView = new ModalView(document.body, events);

const cardTemplate = document.querySelector('#card') as HTMLTemplateElement;
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketItemTemplate = document.querySelector('#basket-item') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;

async function loadCatalog(): Promise<void> {
    try {
        const response = await webLarekApi.getProducts();
        catalogModel.setItems(response.products || response.items);
    } catch (error) {
        console.error('Ошибка загрузки каталога:', error);
    }
}

events.on('catalog:changed', (items: IProduct[]) => {
    const cards = items.map((item: IProduct) => {
        const card = new CatalogCard(cardTemplate, events);
        card.data = {
            id: item.id,
            title: item.title,
            price: item.price,
            category: item.category,
            image: item.image
        };
        return card.render();
    });
    pageView.render({ catalog: cards, counter: basketModel.getCount() });
});

events.on('preview:changed', (item: IProduct) => {
    const isInBasket = basketModel.hasItem(item.id);
    const previewCard = new PreviewCard(previewTemplate, events);
    previewCard.data = {
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.image,
        isInBasket: isInBasket
    };
    modalView.render({ content: previewCard.render() });
});

events.on('card:select', (data: { id: string }) => {
    const item = catalogModel.getItem(data.id);
    if (item) {
        catalogModel.setPreview(item);
    }
});

events.on('product:addToBasket', (data: { id: string }) => {
    const item = catalogModel.getItem(data.id);
    if (item) {
        basketModel.addItem(item);
        pageView.render({ catalog: undefined, counter: basketModel.getCount() });
        
        const previewItem = catalogModel.getPreview();
        if (previewItem && previewItem.id === data.id) {
            catalogModel.setPreview(previewItem);
        }
    }
});

events.on('product:removeFromBasket', (data: { id: string }) => {
    basketModel.removeItem(data.id);
    pageView.render({ catalog: undefined, counter: basketModel.getCount() });
    
    const previewItem = catalogModel.getPreview();
    if (previewItem && previewItem.id === data.id) {
        catalogModel.setPreview(previewItem);
    }
});

events.on('basket:open', () => {
    const items = basketModel.getItems();
    const basketContainer = document.createElement('div');
    basketContainer.classList.add('basket');
    
    const basketList = document.createElement('ul');
    basketList.classList.add('basket__list');
    
    if (items.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Корзина пуста';
        emptyMessage.classList.add('basket__empty');
        basketList.appendChild(emptyMessage);
    } else {
        items.forEach((item: IProduct, index: number) => {
            const card = new BasketCard(basketItemTemplate, events);
            card.data = {
                id: item.id,
                title: item.title,
                price: item.price,
                index: index + 1
            };
            basketList.appendChild(card.render());
        });
    }
    
    const totalPrice = basketModel.getTotal();
    const totalElement = document.createElement('p');
    totalElement.classList.add('basket__total');
    totalElement.textContent = `${totalPrice} синапсов`;
    
    const orderButton = document.createElement('button');
    orderButton.classList.add('basket__button');
    orderButton.textContent = 'Оформить заказ';
    orderButton.disabled = items.length === 0;
    orderButton.addEventListener('click', () => {
        events.emit('order:start');
    });
    
    basketContainer.appendChild(basketList);
    basketContainer.appendChild(totalElement);
    basketContainer.appendChild(orderButton);
    
    modalView.render({ content: basketContainer });
});

events.on('order:start', () => {
    orderForm = new OrderForm(orderTemplate, events);
    orderForm.data = {
        payment: 'card',
        address: ''
    };
    modalView.render({ content: orderForm.render() });
});

events.on('order:submit', (data: IOrderFormData) => {
    orderModel.setPayment(data.payment);
    orderModel.setAddress(data.address);
    
    contactsForm = new ContactsForm(contactsTemplate, events);
    contactsForm.data = {
        email: '',
        phone: ''
    };
    modalView.render({ content: contactsForm.render() });
});

events.on('contacts:submit', async (data: IContactsFormData) => {
    orderModel.setEmail(data.email);
    orderModel.setPhone(data.phone);
    
    const errors = orderModel.validate();
    if (Object.keys(errors).length > 0) {
        if (contactsForm) {
            contactsForm.showErrors(errors);
        }
        return;
    }
    
    try {
        const orderData: IOrderData = {
            items: basketModel.getItems().map((item: IProduct) => item.id),
            total: basketModel.getTotal(),
            payment: orderModel.getOrderData().payment,
            email: orderModel.getOrderData().email,
            phone: orderModel.getOrderData().phone,
            address: orderModel.getOrderData().address
        };
        
        const result = await webLarekApi.postOrder(orderData);
        
        basketModel.clear();
        orderModel.clear();
        
        const successView = new SuccessView(successTemplate, events);
        successView.total = result.total;
        modalView.render({ content: successView.render() });
        
        pageView.render({ catalog: undefined, counter: 0 });
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
        if (contactsForm) {
            contactsForm.showErrors({ form: 'Ошибка сервера. Попробуйте позже.' });
        }
    }
});

events.on('form:changed', (data: IOrderFormData | IContactsFormData) => {
    if ('payment' in data && orderForm) {
        orderForm.validate();
    }
    if ('email' in data && contactsForm) {
        contactsForm.validate();
    }
});

events.on('success:close', () => {
    modalView.close();
});

events.on('modal:close', () => {
    orderForm = null;
    contactsForm = null;
});

loadCatalog();