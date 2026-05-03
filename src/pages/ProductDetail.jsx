import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addToCart } from '@/lib/cart';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams(); const [product,setProduct]=useState();
  useEffect(()=>{api.product(id).then(setProduct).catch(()=>setProduct(null));},[id]);
  if(product===undefined) return <div className='p-8'>Loading...</div>; if(!product) return <div className='p-8'>Product not found</div>;
  return <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className='max-w-4xl mx-auto p-8 grid md:grid-cols-2 gap-8'><img src={product.images?.[0]||'https://via.placeholder.com/300'} className='rounded-2xl'/><div><h1 className='text-3xl font-bold'>{product.name}</h1><p className='mt-2'>{product.description}</p><p className='text-2xl font-bold mt-4'>₹{product.price}</p><button onClick={()=>addToCart({id:product._id,name:product.name,price:product.price,thumbnail:product.images?.[0]},1)} className='mt-5 bg-foxley-green text-white px-5 py-3 rounded-full'>Add to cart</button></div></motion.div>
}
