import './App.css'
import ProductCard from './components/productCard'

function App() {
  return (
    <div className='w-175 h-175 bg-yellow-300 relative'>
    
    <div className='w-150 h-150 bg-gray-400 flex flex-row justify-evenly items-center'>
      
      <div className='w-25 h-25 bg-blue-700'></div>
      <div className='w-25 h-25 fixed top-0 left-0 bg-red-700'></div>
      <div className='w-25 h-25 bg-white'></div>
      <div className='w-25 h-25 bg-green-700'></div>
      <div className='w-25 h-25 absolute top-0 left-150 bg-black'></div>

    </div>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores nemo consequuntur vel repudiandae hic quidem laudantium laborum quod nesciunt aut natus sed sunt ex corrupti, earum necessitatibus culpa expedita? Velit?</p>
    
    </div>
  )
}

export default App
