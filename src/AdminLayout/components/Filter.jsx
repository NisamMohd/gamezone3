import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../redux/thunks/adminProductsThunk'

function Filter() {
    const { items } = useSelector((state) => state.adminProducts)
    const dispatch = useDispatch()
    const [selectedCategory, setSelectedCategory] = useState("all")

    useEffect(() => {
        dispatch(fetchProducts())
    },[])

    const categories = useMemo(() => {
        return items.reduce((acc, item) => {
            if(item.category && !acc.includes(item.category)){
                acc.push(item.category)
            }
            return acc
        }, [])
    },[items])
    
    const filteredProducts = useMemo(() => {
        return items.filter((product) => {
            const matchesCategory = 
                selectedCategory === 'all' || 
                product.category?.toLowerCase() === selectedCategory.toLowerCase()

            return matchesCategory;
        })
    },[items,selectedCategory])
  return (
    <div className='text-white'>
        <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
        >
            <option value="all">
                All categories
            </option>
            {categories.map((c) => (
                <option value={c} className='text-black'>{c}</option>
            ))}
        </select>

        {filteredProducts.map((item) => (
            <div className=" flex gap-2 h-12 bg-slate-950 rounded border border-white/10 p-1 flex items-center justify-start shrink-0">
                <img src={item.image} alt="" className="max-h-full max-w-full object-contain"/>
                <span>{item.title}</span>
            </div>
        ))}
    </div>
  )
}

export default Filter