import React from 'react'
import { Link } from 'react-router-dom';


export default function adminAddProductForm() {

const[productId, setProductId] = React.useState("")
const[name, setName] = React.useState("")
const[altNames, setAltNames] = React.useState([])
const[description, setDescription] = React.useState("")
const[price, setPrice] = React.useState(0)
const[labelledPrice, setLabelledPrice] = React.useState(0)
const[images, setImages] = React.useState([])
const[isAvailable, setIsAvailable] = React.useState(true)
const[category, setCategory] = React.useState("")
const[stock, setStock] = React.useState(0)
const[brand, setBrand] = React.useState("")
const[model, setModel] = React.useState("")


  return (
    <div className='w-full h-full flex items-center flex-col'>
        <div className='w-full h-25 bg-white shadow-2xl rounded-lg flex p-4'>
            <h1 className='text-2xl font-semibold'>Add New Product</h1>

           <div className="flex flex-1 justify-end items-center gap-4 h-full">
              <Link to="/admin/products" className="px-5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium shadow-sm hover:bg-slate-100 hover:shadow-md transition-all duration-200">
              Cancel
              </Link>

             <Link to="/admin/products" className="px-5 py-2 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 text-white font-medium shadow-lg hover:from-emerald-600 hover:to-green-700 hover:shadow-xl transition-all duration-200">
              Save
            </Link>

          
            </div>
        </div>

          <div className="w-full h-[300px] flex gap-4 p-4">
            <div className='w-[25%] h-[70px] flex flex-col'>
                <label className='font-semibold'>Product ID</label>
                <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder='PD-001'
                    className="border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>

            <div className='w-[25%] h-[70px] flex flex-col'>
                <label className='font-semibold'>Product Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Nvidea RTX 5090'
                    className="border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className='w-[50%] h-[70px] flex flex-col'>
                <label className='font-semibold'>Alternative Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='VGA, Graphics Card'
                    className="border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
      
          </div>
    </div>
  )
}

