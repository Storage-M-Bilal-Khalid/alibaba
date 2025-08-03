import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function OrderConfirmation() {
  const orderNumber = 'ORD123456';
  const totalPrice = 299.99;
  const deliveryDate = 'August 15, 2025';
  const shippingAddress = '123 Main Street, Karachi, Pakistan';
  const contactInfo = '+92 300 1234567';

  const items = [
    { name: 'Wireless Headphones', quantity: 1, price: 99.99 },
    { name: 'Gaming Mouse', quantity: 2, price: 49.99 },
    { name: 'Mechanical Keyboard', quantity: 1, price: 99.99 },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 sm:p-10 mt-10 mb-7 rounded-[5]">
      <div className="max-w-3xl w-full">
        <div className="flex flex-col items-center text-center mb-8">
          <CheckCircle className="h-16 w-16" style={{ color: '#0A74FF' }} />
          <h1 className="text-3xl font-bold mt-4" style={{ color: '#0A74FF' }}>Thank You for Your Order!</h1>
          <p className="text-gray-600 mt-2">Your order has been confirmed.</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: '#0A74FF' }}>Order Summary</h2>
              <p>Order Number: <span className="font-medium">{orderNumber}</span></p>
              <p>Total Price: <span className="font-medium">${totalPrice.toFixed(2)}</span></p>
              <p>Estimated Delivery: <span className="font-medium">{deliveryDate}</span></p>
            </div>

            <div>
              <h2 className="text-xl font-semibold" style={{ color: '#0A74FF' }}>Customer Information</h2>
              <p>Shipping Address: <span className="font-medium">{shippingAddress}</span></p>
              <p>Contact Info: <span className="font-medium">{contactInfo}</span></p>
            </div>

            <div>
              <h2 className="text-xl font-semibold" style={{ color: '#0A74FF' }}>Order Details</h2>
              <ul className="divide-y divide-gray-200">
                {items.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button style={{ backgroundColor: '#0A74FF' }} className="text-white hover:opacity-90 p-5">
            <Link href="/products">Continue Shopping</Link>
        </Button>
        </div>
      </div>
    </div>
  );
}