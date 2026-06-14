export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
export interface IProduct {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}

export type TPayment = 'card' | 'cash';

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IBuyer {
  payment: TPayment | null;
  address: string;
  email: string;
  phone: string;
}

export interface IProductResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IHeader {
  counter: number;
}

export interface ICardBase {
  title: string;
  price: number | null;
}

export type TCardFullActions = {
  onButtonClick: () => void;
};

export interface ICardFull extends ICardBase {
  category: string;
  description: string;
  image: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export type TCardBasketActions = {
  onDelete: () => void;
};

export interface ICardBasket extends ICardBase {
  index: number;
}

export type TCardCatalogActions = {
  onSelect: () => void;
};

export interface ICardCatalog extends ICardBase {
  category: string;
  image: string;
}

export interface IBasket {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

export interface IFormState {
  valid: boolean;
  errors: string;
}

export interface IOrderForm {
  payment: TPayment | null;
  address: string;
}

export interface IContactsForm {
  email: string;
  phone: string;
}

export interface IModal {
  content: HTMLElement;
}

export interface ISuccess {
  total: number;
}