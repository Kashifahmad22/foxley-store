import { useEffect, useState } from 'react'; import { api } from '@/lib/api';
const statuses=['pending','paid','shipped','delivered'];
export default function AdminOrders(){const [orders,setOrders]=useState([]);const load=()=>api.allOrders().then(setOrders); useEffect(load,[]);
return <div><h1 className='text-2xl font-bold mb-3'>Orders</h1>{orders.map(o=><div key={o._id} className='border p-2 my-2 flex justify-between items-center'><span>{o._id.slice(-6)} ₹{o.total}</span><select value={o.status} onChange={async(e)=>{await api.updateOrderStatus(o._id,e.target.value);load();}}>{statuses.map(s=><option key={s}>{s}</option>)}</select></div>)}</div>;}
