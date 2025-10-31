import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Health check endpoint
app.get('/make-server-27b88f73/health', (c) => {
  return c.json({ status: 'ok', message: 'Server is running' });
});

// Create a new order
app.post('/make-server-27b88f73/orders', async (c) => {
  try {
    const body = await c.req.json();
    const { 
      name, 
      phone, 
      email, 
      address, 
      complement, 
      deliveryMethod, 
      paymentMethod, 
      items, 
      total 
    } = body;

    // Validate required fields
    if (!name || !phone || !items || !total) {
      return c.json({ 
        error: 'Missing required fields: name, phone, items, total' 
      }, 400);
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create order object
    const order = {
      orderId,
      customer: {
        name,
        phone,
        email: email || '',
        address: address || '',
        complement: complement || ''
      },
      deliveryMethod,
      paymentMethod,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Store order in KV store
    await kv.set(`order:${orderId}`, order);
    
    // Also store customer info for future reference
    const customerId = phone.replace(/\D/g, ''); // Use phone as customer ID (digits only)
    const existingCustomer = await kv.get(`customer:${customerId}`);
    
    if (!existingCustomer) {
      const customer = {
        customerId,
        name,
        phone,
        email: email || '',
        address: address || '',
        complement: complement || '',
        firstOrderDate: new Date().toISOString(),
        totalOrders: 1
      };
      await kv.set(`customer:${customerId}`, customer);
    } else {
      // Update customer info and increment order count
      const updatedCustomer = {
        ...existingCustomer,
        name,
        phone,
        email: email || existingCustomer.email,
        address: address || existingCustomer.address,
        complement: complement || existingCustomer.complement,
        totalOrders: (existingCustomer.totalOrders || 0) + 1,
        lastOrderDate: new Date().toISOString()
      };
      await kv.set(`customer:${customerId}`, updatedCustomer);
    }

    // Store order reference in customer's order list
    const customerOrdersKey = `customer_orders:${customerId}`;
    const customerOrders = await kv.get(customerOrdersKey) || [];
    customerOrders.push(orderId);
    await kv.set(customerOrdersKey, customerOrders);

    console.log(`Order created successfully: ${orderId}`);

    return c.json({ 
      success: true, 
      orderId,
      message: 'Pedido criado com sucesso!' 
    }, 201);

  } catch (error) {
    console.error('Error creating order:', error);
    return c.json({ 
      error: 'Failed to create order', 
      details: error.message 
    }, 500);
  }
});

// Get order by ID
app.get('/make-server-27b88f73/orders/:orderId', async (c) => {
  try {
    const orderId = c.req.param('orderId');
    const order = await kv.get(`order:${orderId}`);

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    return c.json({ success: true, order });

  } catch (error) {
    console.error('Error fetching order:', error);
    return c.json({ 
      error: 'Failed to fetch order', 
      details: error.message 
    }, 500);
  }
});

// Get all orders (with optional limit)
app.get('/make-server-27b88f73/orders', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const allOrders = await kv.getByPrefix('order:');
    
    // Sort by creation date (newest first)
    const sortedOrders = allOrders
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);

    return c.json({ 
      success: true, 
      orders: sortedOrders,
      count: sortedOrders.length 
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json({ 
      error: 'Failed to fetch orders', 
      details: error.message 
    }, 500);
  }
});

// Get customer by phone
app.get('/make-server-27b88f73/customers/:phone', async (c) => {
  try {
    const phone = c.req.param('phone');
    const customerId = phone.replace(/\D/g, '');
    const customer = await kv.get(`customer:${customerId}`);

    if (!customer) {
      return c.json({ error: 'Customer not found' }, 404);
    }

    // Get customer's orders
    const orderIds = await kv.get(`customer_orders:${customerId}`) || [];
    const orders = [];
    
    for (const orderId of orderIds) {
      const order = await kv.get(`order:${orderId}`);
      if (order) {
        orders.push(order);
      }
    }

    return c.json({ 
      success: true, 
      customer,
      orders 
    });

  } catch (error) {
    console.error('Error fetching customer:', error);
    return c.json({ 
      error: 'Failed to fetch customer', 
      details: error.message 
    }, 500);
  }
});

// Update order status
app.patch('/make-server-27b88f73/orders/:orderId/status', async (c) => {
  try {
    const orderId = c.req.param('orderId');
    const { status } = await c.req.json();

    if (!status) {
      return c.json({ error: 'Status is required' }, 400);
    }

    const order = await kv.get(`order:${orderId}`);

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`order:${orderId}`, updatedOrder);

    console.log(`Order ${orderId} status updated to: ${status}`);

    return c.json({ 
      success: true, 
      order: updatedOrder,
      message: 'Status atualizado com sucesso!' 
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return c.json({ 
      error: 'Failed to update order status', 
      details: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);
