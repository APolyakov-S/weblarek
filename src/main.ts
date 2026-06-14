import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { CommunicationService } from './components/services/CommunicationService';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { Success } from './components/view/Success';
import { TPayment } from './types';
import { CardBasket } from './components/view/CardBasket';
import { CardCatalog } from './components/view/CardCatalog';
import { CardFull } from './components/view/CardFull';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';

const events = new EventEmitter()

const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

const api = new Api(API_URL);
const communication = new CommunicationService(api);

const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modal = new Modal(ensureElement<HTMLElement>('.modal'), events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardFullTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basket = new Basket(cloneTemplate<HTMLElement>(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
const success = new Success(cloneTemplate<HTMLElement>(successTemplate), events);

//Устанавливаем начальное состояние счётчика корзины
header.render({
  counter: cartModel.getItemsCount()
})

//Функция для рендера корзины
function renderBasket(): void {
  const basketItems = cartModel.getItems().map((product, index) => {
    const cardElement = cloneTemplate<HTMLButtonElement>(cardBasketTemplate);
    const card = new CardBasket(cardElement, {
      onDelete: () => {
        events.emit('basket:item-delete', { id: product.id });
      }
    });
    return card.render({
      ...product,
      index: index + 1
    });
  });

  const basketItemsCount = cartModel.getItemsCount();
  const isBasketEmpty = basketItemsCount === 0;

  basket.render({
    items: basketItems,
    total: cartModel.getTotalPrice(),
    buttonDisabled: isBasketEmpty
  });
}

//Устанавливаем начальное состояние корзины
renderBasket();

//Получаем список товаров с сервера
communication.getProducts()
  .then((data) => {
    catalogModel.setProducts(data.items);
  })
  .catch((error) => {
    console.log('Ошибка загрузки товаров', error);
  })

// Обрабатываем изменение каталога товаров
events.on('catalog:changed', () => {
  const cards = catalogModel.getProducts().map((product) => {
    const cardElement = cloneTemplate<HTMLButtonElement>(cardCatalogTemplate);
    const card = new CardCatalog(cardElement, {
      onSelect: () => {
        events.emit('card:select', { id: product.id });
      }
    });
    return card.render(product);
  });
  gallery.render({items: cards});
})

// Обрабатываем нажатие на карточку товара
events.on('card:select', (data: { id: string }) => {
  const product = catalogModel.getProductById(data.id);

  if (!product) return;

  catalogModel.setSelectedProduct(product);
})

// Обрабатываем изменение выбранного товара и открытие модального окна с выбранным товаром
events.on('product:selected', () => {
  const product = catalogModel.getSelectedProduct();

  if (!product) return;

  const isUnavailable = product.price === null;
  const inBasket = cartModel.hasItem(product.id);
  const cardElement = cloneTemplate<HTMLElement>(cardFullTemplate);
  const card = new CardFull(cardElement, {
    onButtonClick: () => {
      if (inBasket) {
      events.emit('basket:delete');
      }
      else {
      events.emit('basket:add');
      }
      modal.close();
    }
  });
  modal.render({
    content: card.render({
      ...product,
      inBasket,
      buttonText: isUnavailable
      ? 'Недоступно'
      : inBasket
        ? 'Удалить из корзины'
        : 'В корзину',
      buttonDisabled: isUnavailable
    })
  });

  modal.open();

})

// Обрабатываем нажатие на кнопку "Удалить из корзины" в окне отображения выбранного товара
events.on('basket:delete', () => {
  const product = catalogModel.getSelectedProduct();

  if (!product) return;

  cartModel.removeItem(product);

})

// Обрабатываем нажатие на кнопку "В корзину" в окне отображения выбранного товара
events.on('basket:add', () => {
  const product = catalogModel.getSelectedProduct();

  if (!product) return;

  cartModel.addItem(product);

})

// Обрабатываем изменение корзины
events.on('basket:changed', () => {

  header.render({
    counter: cartModel.getItemsCount()
  });

  renderBasket();

})

// Обрабатываем нажатие на кнопку удаления товара из корзины в окне корзины
events.on('basket:item-delete', (data: { id: string }) => {
  const product = catalogModel.getProductById(data.id);

  if (!product) return;

  cartModel.removeItem(product);

})

// Обрабатываем нажатие на кнопку корзины
events.on('basket:open', () => {

  modal.render({
    content: basket.render()
  });

  modal.open();

})

// Обрабатываем нажатие кнопки "Оформить" в окне корзины
events.on('basket:submit', () => {
  modal.render({
    content: orderForm.render({
      payment: null,
      address: '',
      valid: false,
      errors: ''
    })
  });
  modal.open()
})

// Обрабатываем изменение выбора способа оплаты
events.on('order.payment:change', (data: { payment: TPayment }) => {
  buyerModel.update({
    payment: data.payment
  });
});

// Обрабатываем изменение адреса доставки
events.on('order.address:change', (data: { address: string }) => {
  buyerModel.update({
    address: data.address
  });
});

//Обрабатываем изменение данных покупателя
events.on('buyer:changed', () => {
  const buyerData = buyerModel.getData();
  const errors = buyerModel.validate();

  orderForm.render({
    payment: buyerData.payment,
    address: buyerData.address,
    valid: !errors.payment && !errors.address,
    errors: errors.payment || errors.address || ''
  });
  contactsForm.render({
    email: buyerData.email,
    phone: buyerData.phone,
    valid: !errors.email && !errors.phone,
    errors: errors.email || errors.phone || ''
  });
});

//Обрабатываем нажатие кнопки "Далее" в форме оформления заказа
events.on('order:submit', () => {
    modal.render({
    content: contactsForm.render({
      ...buyerModel.getData(),
      valid: false,
      errors: ''
    })
  });
});

//Обрабатываем изменение email
events.on('contacts.email:change', (data: { email: string }) => {
  buyerModel.update({
    email: data.email
  });
});

//Обрабатываем изменение номера телефона
events.on('contacts.phone:change', (data: { phone: string }) => {
  buyerModel.update({
    phone: data.phone
  });
});

//Обрабатываем нажатие кнопки "Оплатить" в форме оформления заказа
events.on('contacts:submit', () => {

  //Отправляем заказ на сервер
  communication.createOrder({
    items: cartModel.getItems().map((item) => item.id),
    total: cartModel.getTotalPrice(),
    ...buyerModel.getData()
  })
  .then((result) => {
    cartModel.clearCart();
    buyerModel.clear();
    modal.render({
      content: success.render({
        total: result.total
      })
    });
  })
  .catch((error) => {
    console.log('Ошибка оформления заказа:', error);
  });
});

//Обрабатываем нажатие на кнопку "За новыми покупками!" в окне успешного оформления заказа
events.on('success:close', () => {
  modal.close();
})