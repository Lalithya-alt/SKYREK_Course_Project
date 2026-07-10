import Order from '../models/Order.js';
import Product from '../models/product.js';

export async function createOrder(req, res) {
  try {
    console.log("🔍 CreateOrder - Incoming request:");
    console.log("   req.user:", req.user);
    console.log("   req.body:", req.body);

    if (req.user == null) {
        console.error("❌ No user authenticated");
        return res.status(401).json({ error: 'Unauthorized - Please login first' });
    }

    const rawItems = req.body.items || req.body.cart;
    console.log("📦 Raw items received:", rawItems);

    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      console.error("❌ Invalid items:", rawItems);
      return res.status(400).json({ error: 'Invalid order items - cart is empty or not an array' });
    }

    // Validate each item has productId and qty
    for (let i = 0; i < rawItems.length; i++) {
      if (!rawItems[i].productId) {
        console.error(`❌ Item ${i} missing productId:`, rawItems[i]);
        return res.status(400).json({ error: `Item ${i} is missing productId` });
      }
      if (!rawItems[i].qty) {
        console.error(`❌ Item ${i} missing qty:`, rawItems[i]);
        return res.status(400).json({ error: `Item ${i} is missing qty (quantity)` });
      }
    }

    // Sort by orderId descending for reliable last-order lookup
    let lastOrder = await Order.findOne().sort({ orderId: -1 }).exec();
    const newOrderNumber = lastOrder ? parseInt(lastOrder.orderId.replace('ORD', '')) + 1 : 1;
    const newOrderId = 'ORD' + String(newOrderNumber).padStart(6, '0');
    console.log("✅ New Order ID:", newOrderId);

    const orderData = {
        orderId: newOrderId,
        firstName: req.body.firstName || req.user.firstName,
        lastName: req.body.lastName || req.user.lastName,
        email: req.user.email,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2 || "",
        city: req.body.city,
        phone: req.body.phone,
        items: [],
        totalPrice: 0
    };

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'addressLine1', 'city', 'phone'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        console.error(`❌ Missing required field: ${field}`);
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    console.log("📋 Order data structure:", orderData);

    for (let i = 0; i < rawItems.length; i++) {
        const item = rawItems[i];
        console.log(`   Processing item ${i}:`, item);

        const productId = item.productId || (item.product && item.product.productId);
        // Use ?? to avoid falsiness issue with 0
        const qty = item.qty ?? item.quantity;

        if (!productId) {
            console.error(`❌ Item ${i}: Missing product ID`);
            return res.status(400).json({ error: 'Missing product ID in order items' });
        }

        if (!qty || qty < 1) {
            console.error(`❌ Item ${i}: Invalid quantity - ${qty}`);
            return res.status(400).json({ error: 'Invalid quantity for product: ' + productId });
        }

        const prod = await Product.findOne({ productId }).exec();
        console.log(`   Product lookup for ${productId}:`, prod ? "Found" : "NOT FOUND");

        if (prod == null) {
            console.error(`❌ Product not found: ${productId}`);
            return res.status(400).json({ error: 'Invalid product ID: ' + productId });
        }

        if (prod.isavailable === false) {
            console.error(`❌ Product unavailable: ${productId}`);
            return res.status(400).json({ error: 'Product is not available: ' + productId });
        }

        if (prod.stock < qty) {
            console.error(`❌ Insufficient stock for ${productId}: need ${qty}, have ${prod.stock}`);
            return res.status(400).json({ error: 'Insufficient stock for product: ' + productId });
        }

        orderData.items.push({
            product: {
                productId: prod.productId,
                name:      prod.name,
                image:     (prod.Images && prod.Images.length > 0) ? prod.Images[0] : "/default-product1.jpg",
                price:     prod.price
            },
            qty: qty
        });
        orderData.totalPrice += prod.price * qty;
        console.log(`   ✅ Item ${i} added, total now: ${orderData.totalPrice}`);
    }

    console.log("💾 Saving order to database...");
    const newOrder = new Order(orderData);
    await newOrder.save();
    console.log("✅ Order saved successfully:", newOrder._id);

    // Reduce stock for each product
    for (let i = 0; i < rawItems.length; i++) {
        const item = rawItems[i];
        const productId = item.productId || (item.product && item.product.productId);
        const qty = item.qty ?? item.quantity;

        await Product.findOneAndUpdate(
            { productId },
            { $inc: { stock: -qty } }
        ).exec();
        console.log(`   ✅ Stock reduced for ${productId} by ${qty}`);
    }

    console.log("✅ Order creation complete");
    res.status(201).json({ message: 'Order created successfully', order: newOrder });

  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
}

export async function getAllOrders(req, res) {

if(req.user == null) {
    console.error("❌ No user authenticated");
    return res.status(401).json({ error: 'Unauthorized - Please login first' });
  }

  try {

    if (!req.user.isAdmin) {

      // Non-admin user, fetch only their orders
      const pagesizeInString = req.params.pageSize||"10"
      const pageNumberInString = req.params.pageNumber||"1"
      const pageSize = parseInt(pagesizeInString);
      const pageNumber = parseInt(pageNumberInString);

      const orderCount = await Order.countDocuments({ email: req.user.email });
      const totalPages = Math.ceil(orderCount / pageSize);

      const orders = await Order.find({ email: req.user.email }).sort({ date: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize).exec();
      res.status(200).json({
        totalPages: totalPages,
        currentPage: pageNumber,
        orders: orders ,
        totalOrders: orderCount
      })

    }else{

      //Admin user, proceed to fetch orders with pagination
      const pagesizeInString = req.params.pageSize||"10"
      const pageNumberInString = req.params.pageNumber||"1"
      const pageSize = parseInt(pagesizeInString);
      const pageNumber = parseInt(pageNumberInString);

      const orderCount = await Order.countDocuments();
      const totalPages = Math.ceil(orderCount / pageSize);

      const orders = await Order.find().sort({ date: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize).exec();
      res.status(200).json({
        totalPages: totalPages,
        currentPage: pageNumber,
        orders: orders ,
        totalOrders: orderCount
      })

    } 
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
}

export async function updateOrderStatus(req, res) {
  if(req.user == null || !req.user.isAdmin) {
    console.error("❌ No user authenticated");
    return res.status(401).json({ error: 'Unauthorized - Please login first' });
  }
try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      console.error("❌ Missing status in request body");
      return res.status(400).json({ error: 'Missing status in request body' });
    }

    const order = await Order.findOne({ orderId }).exec();
    if (!order) {
      console.error(`❌ Order not found: ${orderId}`);
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    console.log(`✅ Order ${orderId} status updated to ${status}`);
    res.status(200).json({ message: 'Order status updated successfully', order });

}catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ error: 'Failed to update order status', message: error.message });
  }
}