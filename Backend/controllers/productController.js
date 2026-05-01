import Product from "../models/product.js"     

//create product
export async function createProduct(req, res){
    if(req.user == null){
        res.status(401).json({message: "Unauthorized"}) 
        return
    }

    if(!req.user.isAdmin){
        res.status(403).json({message: "Only admin can create products"})
        return
    }

    try{
        const existingProduct = await Product.findOne({productId: req.body.productId})
        if(existingProduct != null){
            res.status(400).json({message: "Product with the same productId already exists"})
            return
        }

        const Product = new Product(req.body)

        await Product.save()
        res.json({message: "Product created successfully", product: Product})

    }catch(err){
        res.status(500).json({message: "Internal Server Error"})
    }
}

//retreive products
export async function getProducts(req, res){
    try{
        if(req.user != null && req.user.isAdmin){
            const products = await Product.find()
            res.json(products)
        }else{
            const products = await Product.find({isavailable: true})
            res.json(products)
        }

    }catch(err){
        res.status(500).json({message: err.message})
    }
}

//update
export async function updateProduct(req, res){
        if(req.user != null && req.user.isAdmin){
            try{
                if(req.body.productId != null){
                    res.status(400).json({message: "ProductId cannot be updated"})
                    return
                }
                await Product.updateOne({productId: req.params.productId}, req.body)
            }catch(err){
                res.status(500).json({message: err.message})
            }
        }
}

//delete
export async function deleteProduct(req, res){
    if(req.user != null && req.user.isAdmin){
        try{
            const product = await Product.findOne({productId: req.params.productId})
            if(product == null){
                res.status(404).json({message: "Product not found"})
                return
            }

            await Product.deleteOne({productId: req.params.productId})
            res.json({message: "Product deleted successfully"})

        }catch(err){
            res.status(500).json({message: err.message})
        }
    }
}
  

export async function getproductById(req, res){
    try{
        const product = await Product.findOne({productId: req.params.productId})    
        if(product == null){
            res.status(404).json({message: "Product not found"})
            return
        }

        if(product.isavailable){
            res.json(product)
        }else{
            if(req.user != null && req.user.isAdmin){
                res.json(product)
            }else{
            res.status(403).json({message: "Only admin can access unavailable products details"})
        }
    }
    }catch(err){
        res.status(500).json({message: err.message})
    }

}