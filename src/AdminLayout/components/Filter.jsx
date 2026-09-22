import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../redux/thunks/adminProductsThunk'

function filter() {
    const { items } = useSelector((state) => state.adminProducts)
    const dispatch = useDispatch()
    const [selectedCategory, setSelectedCategory] = useState("all")

    useEffect(() => {
        dispatch(fetchProducts())
    })

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
                <option value={c}>{c}</option>
            ))}
        </select>
    </div>
  )
}

export default filter