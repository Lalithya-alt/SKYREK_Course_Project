import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../Utils/api';
import uploadmedia from '../../Utils/mediaUpload';


export default function adminAddProductForm() {
  const navigate = useNavigate();

  const [productId, setProductId] = React.useState("")
  const [name, setName] = React.useState("")
  const [altNames, setAltNames] = React.useState([])
  const [description, setDescription] = React.useState("")
  const [price, setPrice] = React.useState("")
  const [labelledPrice, setLabelledPrice] = React.useState("")
  const [images, setImages] = React.useState([])
  const [isAvailable, setIsAvailable] = React.useState(true)
  const [category, setCategory] = React.useState("Graphic Card")
  const [stock, setStock] = React.useState("")
  const [brand, setBrand] = React.useState("nvidea")
  const [model, setModel] = React.useState("")

  async function handleSave() {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("you must login to add product")
      navigate("/login")
      return
    }

    // Validation
    if (!productId.trim()) {
      toast.error("Product ID is required");
      return;
    }
    if (!name.trim()) {
      toast.error("Product Name is required");
      return;
    }
    if (price === "" || isNaN(price) || Number(price) < 0) {
      toast.error("Valid Price is required");
      return;
    }
    if (stock === "" || isNaN(stock) || Number(stock) < 0) {
      toast.error("Valid Stock is required");
      return;
    }

    try {
      const imageUploadPromises = images.map((file) => uploadmedia(file));
      const imageUrls = await Promise.all(imageUploadPromises);

      const requestBody = {
        productId,
        name,
        altNAmes: altNames,
        description,
        price: Number(price),
        labelledprice: labelledPrice === "" ? 0 : Number(labelledPrice),
        Images: imageUrls,
        isavailable: isAvailable,
        category,
        stock: Number(stock),
        brand,
        model
      }

      // backend api call to save product
      await api.post("/products", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success("Product added successfully")
      navigate("/admin/products")

    } catch (error) {
      console.error("Error adding product:", error)
      toast.error(error.response?.data?.message || "Failed to add product")
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 flex justify-center p-6">

      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="w-full flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-slate-50">
          <h1 className="text-3xl font-bold text-slate-800">
            Add New Product
          </h1>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/products"
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-100 transition"
            >
              Cancel
            </Link>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 text-white font-medium shadow-lg hover:scale-105 transition cursor-pointer"
            >
              Save Product
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-8">

          {/* Product ID */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-700">
              Product ID
            </label>

            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="PD-001"
              className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Product Name */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-700">
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nvidia RTX 5090"
              className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Alternative Name */}
          <div className="flex flex-col gap-2 xl:col-span-2">
            <label className="font-semibold text-slate-700">
              Alternative Name
            </label>

            <input
              type="text"
              value={altNames.join(", ")}
              onChange={(e) =>
                setAltNames(
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
              placeholder="VGA, Graphics Card"
              className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-700">
              Price
            </label>

            <input
              type="number"
              value={price ?? ""}
              onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="0.00"
              className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Labelled Price */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-700">
              Labelled Price
            </label>

            <input
              type="number"
              value={labelledPrice ?? ""}
              onChange={(e) => setLabelledPrice(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="0.00"
              className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Availability */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-700">
              Availability
            </label>

            <select
              value={isAvailable}
              onChange={(e) =>
                setIsAvailable(e.target.value === "true")
              }
              className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>

          {/* Stock */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-700">
              Stock
            </label>

            <input
              type="number"
              value={stock ?? ""}
              onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="0"
              className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-700">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="Graphic Card">Graphic Card</option>
              <option value="Motherboard">Motherboard</option>
              <option value="CPU">CPU</option>
              <option value="RAM">RAM</option>
              <option value="Storage">Storage</option>
              <option value="SmartPhones">SmartPhones</option>
              <option value="Laptops">Laptops</option>
              <option value="Headphones">Headphones</option>
            </select>
          </div>

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-700">
              Brand
            </label>

            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="nvidea">Nvidia</option>
              <option value="amd">Samsung</option>
              <option value="intel">ASUS</option>
              <option value="dell">Dell</option>
              <option value="Apple">Apple</option>
              <option value="Google">Google</option>

            </select>
          </div>

          {/* Model */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-slate-700">
              Model
            </label>

            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Enter model"
              className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Image */}
          <div className="flex flex-col gap-2 xl:col-span-2">
            <label className="font-semibold text-slate-700">
              Product Images
            </label>

            <input
              multiple={true}
              type="file"
              onChange={(e) =>
                setImages(Array.from(e.target.files))
              }
              className="w-full p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 xl:col-span-4">
            <label className="font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={5}
              className="w-full p-4 rounded-2xl border border-slate-300 bg-slate-50 resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

        </div>
      </div>
    </div>
  )
}