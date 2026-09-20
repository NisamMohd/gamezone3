import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addProduct } from '../redux/thunks/addProductThunk'

function AddProducts() {

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: '',
    price: '',
    stock: '',
    isDisabled: false
  })

  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()

     try {
      await dispatch(addProduct(formData)).unwrap()
      setFormData({
        title: '',
        image: '',
        category: '',
        price: '',
        stock: '',
        isDisabled: false
      })
    } catch (err) {
      console.error('Failed to add product:', err)
    }
  }

  return (
    <div className='w-full max-w-2xl mx-auto text-white py-2 sm:py-4'>
      <div
        className='relative w-full bg-zinc-900/80 border border-cyan-500/30 p-4 sm:p-6 md:p-8'
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)' }}
      >
        {/* corner accents */}
        <div className='absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400' />
        <div className='absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-pink-500' />

        <h2 className='text-lg sm:text-xl font-semibold tracking-widest uppercase text-cyan-400 mb-6 font-[Rajdhani]'>
          Add Product
        </h2>

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1.5'>
            <label htmlFor='title' className='text-xs uppercase tracking-wider text-zinc-400'>
              Title
            </label>
            <input
              id='title'
              type="text"
              name='title'
              placeholder='Product title'
              value={formData.title}
              onChange={handleChange}
              className='bg-black/40 border border-cyan-500/40 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label htmlFor='image' className='text-xs uppercase tracking-wider text-zinc-400'>
              Image URL
            </label>
            <input
              id='image'
              type="text"
              name='image'
              placeholder='https://example.com/image.jpg'
              value={formData.image}
              onChange={handleChange}
              className='bg-black/40 border border-cyan-500/40 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label htmlFor='category' className='text-xs uppercase tracking-wider text-zinc-400'>
              Category
            </label>
            <input
              id='category'
              type="text"
              name='category'
              placeholder='e.g. Console, Controller, Headset'
              value={formData.category}
              onChange={handleChange}
              className='bg-black/40 border border-cyan-500/40 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors'
            />
          </div>

          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1 flex flex-col gap-1.5'>
              <label htmlFor='price' className='text-xs uppercase tracking-wider text-zinc-400'>
                Price (₹)
              </label>
              <input
                id='price'
                type="text"
                name='price'
                placeholder='Price in ₹'
                value={formData.price}
                onChange={handleChange}
                className='w-full bg-black/40 border border-cyan-500/40 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors'
              />
            </div>

            <div className='flex-1 flex flex-col gap-1.5'>
              <label htmlFor='stock' className='text-xs uppercase tracking-wider text-zinc-400'>
                Stock
              </label>
              <input
                id='stock'
                type="text"
                name='stock'
                placeholder='Stock quantity'
                value={formData.stock}
                onChange={handleChange}
                className='w-full bg-black/40 border border-cyan-500/40 px-3 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-colors'
              />
            </div>
          </div>

          <label htmlFor='isDisabled' className='flex items-center gap-2 text-sm text-zinc-400 mt-1 cursor-pointer select-none'>
            <input
              id='isDisabled'
              type="checkbox"
              name='isDisabled'
              checked={formData.isDisabled}
              onChange={handleChange}
              className='accent-pink-500 w-4 h-4'
            />
            Disabled
          </label>

          <button
            type="submit"
            className='mt-4 w-full sm:w-auto self-start px-6 bg-cyan-500/10 border border-cyan-400 text-cyan-300 uppercase text-sm tracking-wider py-2.5 hover:bg-cyan-400 hover:text-black transition-colors'
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%, 0 12px)' }}
          >
            Save Product
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddProducts