import { useState } from 'react';
import { Fish, Shell, Waves, ShoppingCart, Phone, MapPin, Clock, Mail, Trash2, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ProductCard } from './components/ProductCard';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Separator } from './components/ui/separator';
import { CheckoutDialog } from './components/CheckoutDialog';
import { ConfirmationDialog } from './components/ConfirmationDialog';
import { AdminPanel } from './components/AdminPanel';
import { Toaster } from './components/ui/sonner';

interface Product {
  id: number;
  name: string;
  weight: string;
  price: string;
  imageUrl: string;
}

interface CartItem extends Product {
  quantity: number;
}

const productsData = {
  postas: [
    {
      id: 1,
      name: 'Salmão em Posta',
      weight: '500g',
      price: 'R$ 42,90',
      imageUrl: 'https://images.unsplash.com/photo-1559589312-e8e79a2be650?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBzdGVhayUyMGZpc2h8ZW58MXx8fHwxNzYxOTUwMjA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      name: 'Atum em Posta',
      weight: '400g',
      price: 'R$ 38,90',
      imageUrl: 'https://images.unsplash.com/photo-1583953595980-e58272121563?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW5hJTIwc3RlYWt8ZW58MXx8fHwxNzYxOTUwMjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      name: 'Bacalhau em Posta',
      weight: '600g',
      price: 'R$ 89,90',
      imageUrl: 'https://images.unsplash.com/photo-1664288377740-1bec924cd622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2QlMjBmaWxsZXR8ZW58MXx8fHwxNzYxOTUwMjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 4,
      name: 'Merluza em Posta',
      weight: '450g',
      price: 'R$ 28,90',
      imageUrl: 'https://images.unsplash.com/photo-1664288377740-1bec924cd622?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2QlMjBmaWxsZXR8ZW58MXx8fHwxNzYxOTUwMjEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ],
  inteiros: [
    {
      id: 5,
      name: 'Dourada Inteira',
      weight: '800g - 1kg',
      price: 'R$ 52,90/kg',
      imageUrl: 'https://images.unsplash.com/photo-1611764060952-db319bcfb686?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMGZyZXNoJTIwZmlzaHxlbnwxfHx8fDE3NjE5NTAyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 6,
      name: 'Robalo Inteiro',
      weight: '1kg - 1.5kg',
      price: 'R$ 68,90/kg',
      imageUrl: 'https://images.unsplash.com/photo-1674574752509-1754d8098241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWElMjBiYXNzJTIwZmlzaHxlbnwxfHx8fDE3NjE5MTMxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 7,
      name: 'Pargo Inteiro',
      weight: '900g - 1.2kg',
      price: 'R$ 48,90/kg',
      imageUrl: 'https://images.unsplash.com/photo-1716816211582-ef70b1cd2e70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBzbmFwcGVyJTIwZmlzaHxlbnwxfHx8fDE3NjE5NTAyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 8,
      name: 'Sardinha Inteira',
      weight: '400g',
      price: 'R$ 18,90/kg',
      imageUrl: 'https://images.unsplash.com/photo-1611764060952-db319bcfb686?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aG9sZSUyMGZyZXNoJTIwZmlzaHxlbnwxfHx8fDE3NjE5NTAyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ],
  crustaceos: [
    {
      id: 9,
      name: 'Camarão Sete Barbas',
      weight: '500g',
      price: 'R$ 45,90',
      imageUrl: 'https://images.unsplash.com/photo-1504309250229-4f08315f3b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNocmltcHxlbnwxfHx8fDE3NjE5NTAyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 10,
      name: 'Lagosta Viva',
      weight: '700g - 900g',
      price: 'R$ 159,90/kg',
      imageUrl: 'https://images.unsplash.com/photo-1738342570928-c64e62946dcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2JzdGVyJTIwc2VhZm9vZHxlbnwxfHx8fDE3NjE5MTMxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 11,
      name: 'Caranguejo Inteiro',
      weight: '600g',
      price: 'R$ 58,90',
      imageUrl: 'https://images.unsplash.com/photo-1625248442085-10a1a2563dd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFiJTIwc2VhZm9vZHxlbnwxfHx8fDE3NjE4ODI2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 12,
      name: 'Camarão Tigre',
      weight: '400g',
      price: 'R$ 62,90',
      imageUrl: 'https://images.unsplash.com/photo-1504309250229-4f08315f3b5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNocmltcHxlbnwxfHx8fDE3NjE5NTAyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ],
  moluscos: [
    {
      id: 13,
      name: 'Mexilhão Fresco',
      weight: '1kg',
      price: 'R$ 24,90',
      imageUrl: 'https://images.unsplash.com/photo-1561821546-64ee29fd9e3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMG11c3NlbHN8ZW58MXx8fHwxNzYxOTUwMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 14,
      name: 'Ostras Frescas',
      weight: '12 unidades',
      price: 'R$ 78,90',
      imageUrl: 'https://images.unsplash.com/photo-1562009956-c5093f408a88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxveXN0ZXJzJTIwc2VhZm9vZHxlbnwxfHx8fDE3NjE5NTAyMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 15,
      name: 'Vôngole (Amêijoas)',
      weight: '800g',
      price: 'R$ 32,90',
      imageUrl: 'https://images.unsplash.com/photo-1448043552756-e747b7a2b2b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNsYW1zfGVufDF8fHx8MTc2MTk1MDIxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 16,
      name: 'Polvo Fresco',
      weight: '1.2kg',
      price: 'R$ 89,90/kg',
      imageUrl: 'https://images.unsplash.com/photo-1448043552756-e747b7a2b2b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNsYW1zfGVufDF8fHx8MTc2MTk1MDIxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ]
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productTab, setProductTab] = useState('postas');
  const [infoTab, setInfoTab] = useState('carrinho');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R$', '').replace(',', '.').split('/')[0].trim());
      return total + (price * item.quantity);
    }, 0);
  };

  const handleConfirmOrder = (orderId: string) => {
    setCurrentOrderId(orderId);
    setCheckoutOpen(false);
    setConfirmationOpen(true);
    setCart([]);
  };

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="min-h-screen bg-blue-950 relative overflow-hidden">
      {/* Shrimp Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="shrimp-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <g fill="#FF8C42" opacity="0.6">
                <path d="M20,30 Q25,28 30,30 Q32,25 35,24 Q37,22 38,25 Q39,28 37,30 Q35,32 32,31 Q29,30 28,35 Q26,40 20,38 Q15,36 15,32 Q15,28 20,30 Z" />
                <ellipse cx="36" cy="26" rx="1" ry="1.5" fill="#FF6B1A" />
                <path d="M20,32 L18,34 M22,33 L21,36 M25,33 L24,36" stroke="#FF6B1A" strokeWidth="0.5" fill="none" />
                
                <path d="M85,75 Q90,73 95,75 Q97,70 100,69 Q102,67 103,70 Q104,73 102,75 Q100,77 97,76 Q94,75 93,80 Q91,85 85,83 Q80,81 80,77 Q80,73 85,75 Z" />
                <ellipse cx="101" cy="71" rx="1" ry="1.5" fill="#FF6B1A" />
                <path d="M85,77 L83,79 M87,78 L86,81 M90,78 L89,81" stroke="#FF6B1A" strokeWidth="0.5" fill="none" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#shrimp-pattern)" />
        </svg>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-8 shadow-lg relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Waves className="w-10 h-10" />
            <h1 className="text-center">Peixaria Central do Camarão</h1>
          </div>
          <p className="text-center text-orange-100">Frutos do mar frescos todos os dias</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Products Tabs */}
        <div className="mb-6">
          <Tabs value={productTab} onValueChange={setProductTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 bg-white/95 shadow-md">
              <TabsTrigger value="postas" className="flex items-center gap-2">
                <Fish className="w-4 h-4" />
                <span className="hidden sm:inline">Peixe em Posta</span>
                <span className="sm:hidden">Postas</span>
              </TabsTrigger>
              <TabsTrigger value="inteiros" className="flex items-center gap-2">
                <Fish className="w-4 h-4" />
                <span className="hidden sm:inline">Peixe Inteiro</span>
                <span className="sm:hidden">Inteiros</span>
              </TabsTrigger>
              <TabsTrigger value="crustaceos" className="flex items-center gap-2">
                <Waves className="w-4 h-4" />
                <span className="hidden sm:inline">Crustáceos</span>
                <span className="sm:hidden">Crustáceos</span>
              </TabsTrigger>
              <TabsTrigger value="moluscos" className="flex items-center gap-2">
                <Shell className="w-4 h-4" />
                <span className="hidden sm:inline">Moluscos</span>
                <span className="sm:hidden">Moluscos</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="postas">
              <div className="mb-4">
                <h2 className="text-white">Peixes em Posta</h2>
                <p className="text-orange-200">Postas frescas cortadas na hora</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData.postas.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    weight={product.weight}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="inteiros">
              <div className="mb-4">
                <h2 className="text-white">Peixes Inteiros</h2>
                <p className="text-orange-200">Peixes frescos e inteiros, direto da costa</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData.inteiros.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    weight={product.weight}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="crustaceos">
              <div className="mb-4">
                <h2 className="text-white">Crustáceos</h2>
                <p className="text-orange-200">Camarões, lagostas e caranguejos frescos</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData.crustaceos.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    weight={product.weight}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="moluscos">
              <div className="mb-4">
                <h2 className="text-white">Moluscos</h2>
                <p className="text-orange-200">Mexilhões, ostras e muito mais</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData.moluscos.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    weight={product.weight}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Info Tabs (Carrinho, Contatos, Localização, Admin) */}
        <div className="mt-12">
          <Tabs value={infoTab} onValueChange={setInfoTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 bg-white/95 shadow-md">
              <TabsTrigger value="carrinho" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Carrinho</span>
                <span className="sm:hidden">Carrinho</span>
                {cartItemsCount > 0 && (
                  <Badge className="ml-1 bg-orange-500">{cartItemsCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="contatos" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Contatos</span>
                <span className="sm:hidden">Contatos</span>
              </TabsTrigger>
              <TabsTrigger value="localizacao" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Localização</span>
                <span className="sm:hidden">Local</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
                <span className="sm:hidden">Admin</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="carrinho">
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6" />
                    Meu Carrinho
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Seu carrinho está vazio</p>
                      <p className="text-gray-400">Adicione produtos das seções acima</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="text-gray-900">{item.name}</h3>
                            <p className="text-gray-600">{item.weight}</p>
                            <p className="text-orange-600">{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between items-center pt-4">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-orange-600">
                          R$ {getTotal().toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600"
                        onClick={() => setCheckoutOpen(true)}
                      >
                        Finalizar Pedido
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contatos">
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-6 h-6" />
                    Contatos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <p className="text-gray-900">WhatsApp / Celular</p>
                      <p className="text-gray-600">(81) 9638-0257</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <p className="text-gray-900">E-mail</p>
                      <p className="text-gray-600">peixariacdc@gmail.com</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <p className="text-gray-900">Horário de Funcionamento</p>
                      <p className="text-gray-600">Terça a Sábado: 8h às 17h</p>
                      <p className="text-gray-600">Domingo: 8h às 16h</p>
                      <p className="text-red-600">Segunda: Fechado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="localizacao">
              <Card className="bg-white/95">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    Localização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <p className="text-gray-900">Endereço</p>
                      <p className="text-gray-600">Rua Ministro João Alberto, 521</p>
                      <p className="text-gray-600">Caxangá - Recife - PE</p>
                    </div>
                  </div>
                  <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-2" />
                      <p>Mapa da localização</p>
                      <p className="text-gray-400">Rua Ministro João Alberto, 521 - Caxangá</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      Estamos localizados no bairro Caxangá em Recife-PE. 
                      Fácil acesso e próximo a principais avenidas da região.
                      Venha nos visitar e conhecer nossos produtos frescos!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <AdminPanel />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 mt-12 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-200">© 2025 Peixaria Central do Camarão - Produtos frescos diariamente</p>
        </div>
      </footer>

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        total={getTotal()}
        cartItems={cart}
        onConfirm={handleConfirmOrder}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        orderId={currentOrderId}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
