import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Loader2, Package, User, Phone, MapPin, Calendar, RefreshCw } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface OrderItem {
  id: number;
  name: string;
  weight: string;
  price: string;
  quantity: number;
}

interface Order {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    complement: string;
  };
  deliveryMethod: string;
  paymentMethod: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export function AdminPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-27b88f73/orders`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-27b88f73/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (response.ok) {
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId
              ? { ...order, status: newStatus }
              : order
          )
        );
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'preparing':
        return 'bg-purple-500';
      case 'ready':
        return 'bg-green-500';
      case 'delivered':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'preparing':
        return 'Preparando';
      case 'ready':
        return 'Pronto';
      case 'delivered':
        return 'Entregue';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-white">Painel de Pedidos</h2>
        <Button
          onClick={fetchOrders}
          variant="outline"
          size="sm"
          disabled={loading}
          className="bg-white"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Atualizar
        </Button>
      </div>

      {loading && orders.length === 0 ? (
        <Card className="bg-white/95">
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-orange-500 mb-4" />
            <p className="text-gray-500">Carregando pedidos...</p>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="bg-white/95">
          <CardContent className="py-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.orderId} className="bg-white/95">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-gray-900">
                      Pedido #{order.orderId}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {new Date(order.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <Badge className={getStatusBadgeColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{order.customer.phone}</span>
                  </div>
                  {order.customer.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{order.customer.email}</span>
                    </div>
                  )}
                  {order.deliveryMethod === 'entrega' && order.customer.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <div className="text-gray-600">
                        <p>{order.customer.address}</p>
                        {order.customer.complement && (
                          <p className="text-gray-500">{order.customer.complement}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <p className="text-gray-700 mb-2">Itens do Pedido:</p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-gray-600"
                      >
                        <span>
                          {item.quantity}x {item.name} ({item.weight})
                        </span>
                        <span>{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Details */}
                <div className="space-y-1 text-gray-600">
                  <div className="flex justify-between">
                    <span>Entrega:</span>
                    <span>
                      {order.deliveryMethod === 'retirada' ? 'Retirada' : 'Delivery'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pagamento:</span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-orange-600">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Status Update */}
                <div className="flex gap-2 items-center">
                  <span className="text-gray-600">Status:</span>
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.orderId, value)}
                    disabled={updating === order.orderId}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="preparing">Preparando</SelectItem>
                      <SelectItem value="ready">Pronto</SelectItem>
                      <SelectItem value="delivered">Entregue</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  {updating === order.orderId && (
                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
