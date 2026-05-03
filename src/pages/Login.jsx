import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
export default function Login(){const [email,setEmail]=useState('');const [password,setPassword]=useState('');const nav=useNavigate();
const submit=async(e)=>{e.preventDefault();const d=await api.login({email,password});localStorage.setItem('foxley_token',d.token);localStorage.setItem('foxley_user',JSON.stringify(d.user));nav('/');};
return <form onSubmit={submit} className='max-w-md mx-auto p-6 space-y-3'><h1 className='text-2xl font-bold'>Login</h1><input className='border p-2 w-full' value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email'/><input type='password' className='border p-2 w-full' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password'/><button className='bg-black text-white px-4 py-2 rounded'>Login</button></form>}
