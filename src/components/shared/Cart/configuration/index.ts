interface SaveForLaterProduct {
    id: string;
    name: string;
    price: string;
    imgUrl: string;
}

export const saveForLaterProducts: SaveForLaterProduct[] = [
    {
        id: 'product-1',
        name: 'Iphone 16 pro max',
        price: '120.00',
        imgUrl: '/Image/tech/1.jpg',
    },
    {
        id: 'product-2',
        name: 'Oppo Mobile',
        price: '66.50',
        imgUrl: '/Image/tech/2.jpg',
    },
    {
        id: 'product-3',
        name: 'Apple Watch Series Space Gray',
        price: '99.50',
        imgUrl: '/Image/tech/3.jpg',
    },
    {
        id: 'product-4',
        name: 'New Summer Men\'s castrol T-Shirts',
        price: '99.50',
        imgUrl: '/Image/cloth/4.jpg',
    }
];