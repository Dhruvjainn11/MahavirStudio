// src/app/order-confirmation/page.js
import { Suspense } from 'react';
import OrderConfirmationClient from './OrderConfirmationClient.jsx';

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationClient />
    </Suspense>
  );
}