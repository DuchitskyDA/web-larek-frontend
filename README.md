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

### Model

Основная модель состоит из четырех частей Product, UserOrder, Cart, User. </br>

### class Product

getProductList(): Product[] </br>
getProduct(id: String): Product </br>
addToCart(id: string): void </br>

### class Cart

cartItems: Product[]

removeFromCart(id: string): void </br>
getTotalPrice(data: Product[]): number </br>

### class User

setPaymentMethod(): string </br>
setPhoneNumber(): string </br>
setAddress(): string </br>
setEmail: string </br>

setUserData(payMethod: string, pnumber: string, address: string, email: string) </br>

### class UserOrder

orderProducts(userData: [] ,orderedItems: []): postResponse </br>

### View

### class Card

template: HTMLTemplateElement </br>
createCard(item: Product): HTMLElement </br>
render(element: HTMLElement, template: HTMLTemplateElement): HTMLElement </br>
addToCart(id: string): void </br>

### class Modal

products: Product[]
getPaymentMethod(): string </br>
getPhoneNumber(): string </br>
getAddress(): string </br>
getEmail(): string </br>
basicCount: number

container: HTMLElement </br>
cartItems: Product[] </br>
userData: Map<key: string, value: string> </br>

openModal(): void </br>
closeModal(): void </br>
removeFromCart(id: string): Products[] </br>
setCount(id): void </br>
createModal(container: HTMLElement | HTMLFormElement, : Object): HTMLElement </br>
renderModal(element: HTMLElement): HTMLElement </br>

purchase(items: Product[], data: Object) </br>

В роли контроллера выступает index.ts
В нем будут взаимодействовать Model и View слои