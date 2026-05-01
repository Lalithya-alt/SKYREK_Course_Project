export default function ProductCard({ name, price, photo }) { //first letterr of each word should be capital
    

    return (
       <div className="border w-56 h-80 ">
            <h1 className="text-center font-bold text-2xl">{name}</h1>  {/* curly braces are used to write js code inside html */}
            <img src={photo} alt={name} className="w-40 h-40 image-center" />
            <p className="text-center">Rs.{price}</p>
       </div>
    )
}

