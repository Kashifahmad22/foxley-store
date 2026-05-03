import { useEffect, useState } from 'react'; import { api } from '@/lib/api';
export default function AdminDashboard(){const [orders,setOrders]=useState([]); useEffect(()=>{api.allOrders().then(setOrders).catch(()=>{});},[]); const revenue=orders.reduce((a,b)=>a+b.total,0);
return <div><h1 className='text-2xl font-bold'>Admin Dashboard</h1><p>Total Orders: {orders.length}</p><p>Revenue: ₹{revenue}</p></div>;}
