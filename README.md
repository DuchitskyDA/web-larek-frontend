# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

В данном проекте будет реализован паттерн MVP.
Данные о приложении будет хранить в себе модель,
выполнять логику презентер, выводить данные будет представление.

### Base

1. Класс api. Реализует методы запросов на сервер get, post
2. Класс EventEmitter
   Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
   о наступлении события.
   Класс имеет методы on , off , emit — для подписки на событие, отписки от события и уведомления
   подписчиков о наступлении события соответственно.
   Дополнительно реализованы методы onAll и offAll — для подписки на все события и сброса всех
   подписчиков.
   Интересным дополнением является метод trigger , генерирующий заданное событие с заданными
   аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
   классы будут генерировать события, не будучи при этом напрямую зависимыми от
   класса EventEmitter .
3. AppAPI наследует Api
   cdn: string - сервер; </br>
   getProductItem(): Promise<IProduct[]> - возвращает список продуктов </br>
   order(order: IOrder & IOrderForm): Promise<IOrderResult> - возвращает список купленных товаров и их полную
   стоимость </br>

### Model

Основная модель состоит из трех частей OrderData, BasketData, ProductsData. </br>

### class OrderData

formErrors: FormErrors - ошибки валидации формы </br>
orderForm: IOrderForm - форма с данными покупателя </br>
order: IOrder - данные о выбранном товаре и сумме покупок </br>

setItem(item: IProduct) : void - Добавляет товар в order </br>
removeItem(item: string): void - Убирает из order </br>

validateDeliveryForm: bool - валидация форм и генерация события формы </br>

setOrderForm(field: keyof IOrderForm, value: string) - выбирает поля формы и генерация события о готовом заказе </br>

### class BasketData

basket: IProduct[] = [] - товары в корзине </br>

addToBasket(item: IProduct): void - добавляет товар в корзину  </br>
deleteFromBasket(item: IProduct): void - удаляет конкретный товар </br>
fullClearBasket(): void - удаляет все товары </br>
Каждый метод генерирует события изменения счетчика корзины и изменение всей корзины </br>

### class ProductsData

productList: IProduct[] - список всех продуктов с сервера </br>
preview: string | null - превью конкретного продукта </br>
setProductList(data: IProduct[]): void - получение данных с сервера </br>
setPreview(item: IProduct) - выбор карточки для превью </br>

### View

### Form

Класс создания форм, расширяет класс Component </br>
_submit - кнопка </br>
_errors - ошибки валидации </br>

onInputChange(field: keyof T, value: string): void - генерирует событие изменения инпута </br>
valid: boolean - валидна ли форма </br>
errors: string - текст ошибки </br>
render(state: Partial<T> & IFormState): HTMLFormElement - рендерит форму </br>

### Modal

Класс создания модалки, расширяет класс Component </br>
_closeButton: HTMLButtonElement - кнопка закрыть </br>
_content: HTMLElement - контент модалки </br>
open(): void - открывает модалку </br>
close(): void - закрывает </br>
render(data: IModalData): HTMLElement - рендерит модалку, принимаю нужный контент </br>

### Component

Абстрактный класс создания комонента </br>
toggleClass(element: HTMLElement, className: string, force?: boolean): void - меняет класс </br>
setText(element: HTMLElement, value: unknown): void - устанавливает текст </br>
setDisabled(element: HTMLElement, state: boolean): void - статус блокировки </br>

### Card

Класс создания карточки, наследует Component </br>
_basketId: HTMLElement - номер в корзине </br>
_title: HTMLElement - тайтл </br>
_image: HTMLImageElement - изображение </br>
_description: HTMLElement - описание </br>
_button: HTMLButtonElement - кнопка </br>
_category: HTMLElement - категория </br>
_price: HTMLElement - стоимость </br>

categoryColor(value: string): string - вешает класс с цветом в соответсвтии с данными карточки </br>

### Basket

Класс описывающий корзину, наследует класс Component.  </br>
_list: HTMLElement - список товаров в корзине </br>
_total: HTMLElement - итоговая стоимость </br>
_button: HTMLElement - кнопка заказа, генерирующая события открытия заказа </br>

selected(items: IProduct[]): void - глушит кнопку оформления заказа, если корозина пуста </br>

### Order

Класс описывающий форму заказа товара, наследует Form </br>
methodBtns: HTMLButtonElement[] - кнопки выбора метода оплаты </br>

phone(value: string): void - устанавилвает номер телефона </br>
email(value: string): void - устанавилвает почту </br>
address(value: string): void - адрес покупателя </br>
setSelectedBtn(value: string): void - вешает нужный класс на кнопку выбранного способа оплаты и генерирует евент
изменения заказа </br>

### Page

Класс, описывающий корзину, каталог с товарами, счетчик на корзине и управляющий обложкой страницы </br>
_counter: HTMLElement - счетчик на корзине; </br>
_catalog: HTMLElement - список товаров; </br>
_wrapper: HTMLElement - обложка страницы; </br>
_basket: HTMLElement - корзина; </br>

locked(value: boolean): void - добавляет/убирает класс с обложки, если открыто превью товара, блокирая прокрутку
страницы, в случае, если превью открыто </br>

### Success

Класс описывающий окно успешно совершенной покупки, наследует Component </br>
protected _total: HTMLElement - сумма совершенной покупки </br>
close: HTMLElement - кнопка закрытия модалки и перехода к новым покупкам </br>

### Основные интерфейсы

1. IProduct - карточка товара </br>
   id: string - id </br>
   description: string - описание </br>
   image: string - картинка </br>
   title: string - тайтл </br>
   category: string - категория </br>
   price: number - стоимость </br>

2. IProductsData - Модель данных товара </br>
   productList: IProduct[] - список всех товаров </br>
   preview: string | null - карточка для превью </br>
3. IBasketData - Модель данных корзины </br>
   basket: IProduct[] - список товаров в корзине </br>
4. IOrderForm - форма заказа товаров, где клиент вводит свои данные </br>
   payment: string - способ оплаты </br>
   address: string - адрес </br>
   email: string - почта </br>
   phone: string - номер </br>
5. IOrder - Данные о товаре в заказе
   total: number - сумма товаров
   items: string[] - список товаров по id
6. IOrderResult - ответ от сервера, после покупки
   id: string - id
   total: number - сумма заказа
7. FormErrors - ошибки валидации в форме