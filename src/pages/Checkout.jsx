import { useState } from 'react';
import { api } from '@/lib/api';
import { clearCart, getCart, getCartTotal } from '@/lib/cart';

export default function Checkout(){
  const [loading,setLoading]=useState(false); const cart=getCart(); const total=getCartTotal(cart);
  const placeOrder=async()=>{setLoading(true); const rzpOrder=await api.createPaymentOrder(total);
    const options={key: import.meta.env.VITE_RAZORPAY_KEY_ID, amount: rzpOrder.amount, currency:'INR', name:'Foxley', order_id: rzpOrder.id,
      handler: async (response)=>{const verify=await api.verifyPayment(response); if(verify.valid){await api.createOrder({items: cart.map(i=>({product:i.product_id,quantity:i.quantity,price:i.price,name:i.product_name})),total,status:'paid'}); clearCart(); alert('Order placed');}}, prefill:{} };
    new window.Razorpay(options).open(); setLoading(false);
  };
  return <div className='max-w-3xl mx-auto p-6'><h1 className='text-3xl font-bold'>Checkout</h1><p>Total ₹{total}</p><button disabled={loading||!cart.length} onClick={placeOrder} className='mt-4 bg-foxley-green text-white px-4 py-2 rounded'>Pay with Razorpay</button></div>
}
