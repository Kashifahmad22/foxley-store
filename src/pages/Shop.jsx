import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

export default function Shop() {
  const [query, setQuery] = useState('');
  const [all,setAll]=useState([]);
  useEffect(()=>{api.products().then(setAll).catch(()=>setAll([]));},[]);
  const products = useMemo(() => all.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())), [query, all]);
  return <div className="max-w-7xl mx-auto px-4 py-10"><h1 className='text-3xl font-black mb-4'>Shop</h1><input value={query} onChange={(e)=>setQuery(e.target.value)} className='border rounded px-3 py-2 mb-6'/><div className='grid grid-cols-2 md:grid-cols-4 gap-4'>{products.map(p=><Link key={p._id} to={`/product/${p._id}`} className='bg-white rounded-xl p-3'><img src={p.images?.[0]||'https://via.placeholder.com/300'} className='aspect-square w-full rounded'/><p className='font-bold mt-2'>{p.name}</p><p>₹{p.price}</p></Link>)}</div></div>
}
