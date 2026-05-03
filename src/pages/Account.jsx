import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
export default function Account(){ const [orders,setOrders]=useState([]); useEffect(()=>{api.myOrders().then(setOrders).catch(()=>{});},[]);
 return <div className='max-w-4xl mx-auto p-6'><h1 className='text-3xl font-bold mb-4'>My Orders</h1>{orders.map(o=><div key={o._id} className='p-3 border rounded mb-2'>#{o._id.slice(-6)} - ₹{o.total} - <b>{o.status}</b></div>)}</div>; }
