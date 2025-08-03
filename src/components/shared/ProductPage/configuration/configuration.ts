
interface ratingFilterProps {
  id: number,
  value: number,
  name: string
}

interface conditionFilterProps {
    value: string,
    label: string
}


interface Brand {
  id: number;
  name: string;
}

interface Feature {
  id: number;
  name: string;
}

interface Manufacturer {
  id: number;
  name: string;
}

export interface CategoryData {
  id: number;
  name: string;
  brands: Brand[];
  features: Feature[];
  manufacturers: Manufacturer[];
}

export type Product = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number; 
  rating: number;
  orders: number;
  shipping: string;
  description: string;
  imgUrl: string;
};

export let conditionFilter: conditionFilterProps[] = [
    {
        value: "1",
        label: 'Any'
    },
    {
        value: "2",
        label: 'Refurbished'
    },
    {
        value: "3",
        label: 'Brand new'
    },
    {
        value: "4",
        label: 'Old items'
    },
]

export const productCategories: CategoryData[] = [
  {
    id: 0,
    name: 'All Categories',
    brands: [
      { id: 0, name: 'All Brands' }
    ],
    features: [
      { id: 0, name: 'All Features' }
    ],
    manufacturers: [
      { id: 0, name: 'All maufactures' },
    ],
  },
  {
    id: 1,
    name: 'Electronics',
    brands: [
      { id: 1, name: 'Samsung' },
      { id: 2, name: 'Sony' },
      { id: 7, name: 'LG' },
      { id: 8, name: 'Panasonic' },
      { id: 9, name: 'Dell' },
    ],
    features: [
      { id: 7, name: 'Smart Connectivity' },
      { id: 8, name: 'High Resolution' },
      { id: 9, name: 'Energy Efficient' },
      { id: 10, name: 'Portable' },
    ],
    manufacturers: [
      { id: 6, name: 'Samsung Electronics' },
      { id: 7, name: 'LG Electronics' },
      { id: 8, name: 'Sony Corporation' },
      { id: 9, name: 'TSMC' },
    ],
  },
  {
    id: 2,
    name: 'Mobile accessory',
    brands: [
      { id: 2, name: 'Samsung' },
      { id: 3, name: 'Apple' },
      { id: 4, name: 'Huawei' },
      { id: 5, name: 'Pocco' },
      { id: 6, name: 'Lenovo' },
    ],
    features: [
      { id: 2, name: 'Metallic' },
      { id: 3, name: 'Plastic cover' },
      { id: 4, name: '8GB Ram' },
      { id: 5, name: 'Super power' },
      { id: 6, name: 'Large Memory' },
    ],
    manufacturers: [
      { id: 2, name: 'Foxconn' },
      { id: 3, name: 'Luxshare Precision' },
      { id: 4, name: 'Goertek' },
      { id: 5, name: 'BYD Electronics' },
    ],
  },
  {
    id: 3,
    name: 'Smartphones',
    brands: [
      { id: 2, name: 'Samsung' },
      { id: 3, name: 'Apple' },
      { id: 4, name: 'Huawei' },
      { id: 5, name: 'Pocco' },
      { id: 10, name: 'Xiaomi' },
      { id: 11, name: 'Google' },
    ],
    features: [
      { id: 2, name: 'Metallic' },
      { id: 4, name: '8GB Ram' },
      { id: 5, name: 'Super power' },
      { id: 6, name: 'Large Memory' },
      { id: 11, name: 'OLED Display' },
      { id: 12, name: '5G Ready' },
    ],
    manufacturers: [
      { id: 2, name: 'Foxconn' },
      { id: 10, name: 'Pegatron' },
      { id: 11, name: 'Wistron' },
      { id: 5, name: 'BYD Electronics' },
      { id: 12, name: 'Wingtech' },
    ],
  },
  {
    id: 4,
    name: 'Modern tech',
    brands: [
      { id: 3, name: 'Apple' },
      { id: 11, name: 'Microsoft' },
      { id: 12, name: 'Google' },
      { id: 13, name: 'Amazon' },
      { id: 14, name: 'Tesla' },
    ],
    features: [
      { id: 13, name: 'AI Powered' },
      { id: 14, name: 'IoT Enabled' },
      { id: 15, name: 'Quantum Computing' },
      { id: 16, name: 'Augmented Reality' },
    ],
    manufacturers: [
      { id: 13, name: 'Intel' },
      { id: 14, name: 'NVIDIA' },
      { id: 15, name: 'AMD' },
      { id: 16, name: 'Qualcomm' },
    ],
  }
];

export const ratingFilter: ratingFilterProps[] = [
  { id: 1, value: 5, name: '5 Stars' },
  { id: 2, value: 4, name: '4 Stars' },
  { id: 3, value: 3, name: '3 Stars' },
  { id: 4, value: 2, name: '2 Stars' },
  { id: 5, value: 1, name: '1 Star' },
]

export const ALL_PRODUCTS: Product[] = [
  { id: 1, name: "GoPro HERO6 4K Action Camera - Black", price: 998.00, originalPrice: 1128.00, rating: 4, orders: 154, shipping: "Free Shipping", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.", imgUrl: "/Image/tech/1.jpg" },
  { id: 2, name: "Canon Camera EOS 2000, Black 10x zoom", price: 850.00, rating: 3, orders: 210, shipping: "Free Shipping", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imgUrl: "/Image/tech/2.jpg" },
  { id: 3, name: "Smartwatch X500 Pro, Silver", price: 249.99, originalPrice: 299.99, rating: 4, orders: 320, shipping: "Free Shipping", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.", imgUrl: "/Image/tech/3.jpg" },
  { id: 4, name: "DJI Mavic Air 2 Drone, White", price: 799.00, rating: 5, orders: 95, shipping: "Free Shipping", description: "Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.", imgUrl: "/Image/tech/4.jpg" },
  { id: 5, name: "Bose QuietComfort 35 II Headphones", price: 299.00, originalPrice: 349.00, rating: 4, orders: 450, shipping: "Free Shipping", description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione.", imgUrl: "/Image/tech/5.jpg" },
  { id: 6, name: "Samsung 55-inch QLED 4K TV", price: 1200.00, rating: 5, orders: 75, shipping: "Free Shipping", description: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.", imgUrl: "/Image/tech/6.jpg" },
  { id: 7, name: "Apple MacBook Air M1, Gold", price: 1099.00, originalPrice: 1199.00, rating: 4, orders: 180, shipping: "Free Shipping", description: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.", imgUrl: "/Image/tech/7.jpg" },
  { id: 8, name: "Logitech MX Master 3 Wireless Mouse", price: 99.00, rating: 5, orders: 600, shipping: "Free Shipping", description: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.", imgUrl: "/Image/tech/8.jpg" },
  { id: 9, name: "Kindle Paperwhite E-reader, Black", price: 129.99, rating: 4, orders: 280, shipping: "Free Shipping", description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias.", imgUrl: "/Image/tech/9.jpg" },
  { id: 10, name: "Philips Hue Smart Light Starter Kit", price: 179.00, originalPrice: 199.00, rating: 3, orders: 110, shipping: "Free Shipping", description: "Excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.", imgUrl: "/Image/tech/10.jpg" },
  { id: 11, name: "GoPro HERO7 Black Action Camera", price: 349.00, rating: 4, orders: 190, shipping: "Free Shipping", description: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.", imgUrl: "/Image/tech/1.jpg" },
  { id: 12, name: "Canon Camera EOS 250D, Black 18x zoom", price: 699.00, originalPrice: 750.00, rating: 4, orders: 130, shipping: "Free Shipping", description: "Id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis.", imgUrl: "/Image/tech/2.jpg" },
  { id: 13, name: "Fitbit Charge 5 Fitness Tracker", price: 149.95, rating: 4, orders: 410, shipping: "Free Shipping", description: "Debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur.", imgUrl: "/Image/tech/3.jpg" },
  { id: 14, name: "Anker Portable Charger Power Bank", price: 45.00, rating: 5, orders: 700, shipping: "Free Shipping", description: "Sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.", imgUrl: "/Image/tech/4.jpg" },
  { id: 15, name: "Sony WH-1000XM4 Noise Cancelling Headphones", price: 348.00, originalPrice: 399.00, rating: 5, orders: 250, shipping: "Free Shipping", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", imgUrl: "/Image/tech/5.jpg" },
  { id: 16, name: "LG 65-inch OLED C1 Series 4K TV", price: 1899.00, rating: 5, orders: 50, shipping: "Free Shipping", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", imgUrl: "/Image/tech/6.jpg" },
  { id: 17, name: "Dell XPS 13 Laptop, Platinum Silver", price: 1199.00, rating: 4, orders: 160, shipping: "Free Shipping", description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", imgUrl: "/Image/tech/7.jpg" },
  { id: 18, name: "Razer DeathAdder V2 Gaming Mouse", price: 69.99, originalPrice: 79.99, rating: 4, orders: 550, shipping: "Free Shipping", description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", imgUrl: "/Image/tech/8.jpg" },
  { id: 19, name: "Amazon Echo Dot (4th Gen), Charcoal", price: 49.99, rating: 4, orders: 900, shipping: "Free Shipping", description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.", imgUrl: "/Image/tech/9.jpg" },
  { id: 20, name: "Google Nest Hub Max, Chalk", price: 229.00, originalPrice: 250.00, rating: 4, orders: 100, shipping: "Free Shipping", description: "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.", imgUrl: "/Image/tech/10.jpg" },
  { id: 21, name: "GoPro HERO8 Black Action Camera", price: 399.00, rating: 4, orders: 200, shipping: "Free Shipping", description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.", imgUrl: "/Image/tech/1.jpg" },
  { id: 22, name: "Canon EOS M50 Mark II Camera, White", price: 649.00, originalPrice: 700.00, rating: 4, orders: 140, shipping: "Free Shipping", description: "Consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.", imgUrl: "/Image/tech/2.jpg" },
  { id: 23, name: "Garmin Fenix 6 Pro Smartwatch", price: 599.00, rating: 5, orders: 80, shipping: "Free Shipping", description: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.", imgUrl: "/Image/tech/3.jpg" },
  { id: 24, name: "SanDisk Extreme Portable SSD 1TB", price: 159.00, originalPrice: 180.00, rating: 4, orders: 380, shipping: "Free Shipping", description: "Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.", imgUrl: "/Image/tech/4.jpg" },
  { id: 25, name: "HyperX Cloud II Gaming Headset", price: 79.99, rating: 4, orders: 650, shipping: "Free Shipping", description: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.", imgUrl: "/Image/tech/5.jpg" },
  { id: 26, name: "TCL 50-inch 5-Series Roku TV", price: 449.00, originalPrice: 499.00, rating: 3, orders: 120, shipping: "Free Shipping", description: "Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit.", imgUrl: "/Image/tech/6.jpg" },
  { id: 27, name: "HP Spectre x360 14 Laptop, Nightfall Black", price: 1499.00, rating: 5, orders: 90, shipping: "Free Shipping", description: "In ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.", imgUrl: "/Image/tech/7.jpg" },
  { id: 28, name: "SteelSeries Apex Pro TKL Gaming Keyboard", price: 179.99, rating: 4, orders: 290, shipping: "Free Shipping", description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.", imgUrl: "/Image/tech/8.jpg" },
  { id: 29, name: "Ring Video Doorbell 4, Satin Nickel", price: 199.99, originalPrice: 220.00, rating: 4, orders: 170, shipping: "Free Shipping", description: "Deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.", imgUrl: "/Image/tech/9.jpg" },
  { id: 30, name: "JBL Flip 5 Portable Bluetooth Speaker", price: 119.95, rating: 4, orders: 500, shipping: "Free Shipping", description: "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.", imgUrl: "/Image/tech/10.jpg" },
];