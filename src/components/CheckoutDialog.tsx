import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Check, CreditCard, Banknote, MapPin, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CartItem {
  id: number;
  name: string;
  weight: string;
  price: string;
  quantity: number;
}

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  cartItems: CartItem[];
  onConfirm: (orderId: string) => void;
}

export function CheckoutDialog({ open, onOpenChange, total, cartItems, onConfirm }: CheckoutDialogProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    complement: '',
    paymentMethod: 'dinheiro',
    deliveryMethod: 'retirada',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        complement: formData.complement,
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          weight: item.weight,
          price: item.price,
          quantity: item.quantity
        })),
        total
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-27b88f73/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(orderData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar pedido');
      }

      const result = await response.json();
      console.log('Order created successfully:', result);

      // Reset form
      setStep(1);
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        complement: '',
        paymentMethod: 'dinheiro',
        deliveryMethod: 'retirada',
      });

      onConfirm(result.orderId);

    } catch (err) {
      console.error('Error creating order:', err);
      setError(err instanceof Error ? err.message : 'Erro ao finalizar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Finalizar Pedido - Passo {step} de 3</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between mb-6">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span>Dados</span>
          </div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span>Entrega</span>
          </div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span>Pagamento</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone/WhatsApp *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(81) 99999-9999"
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label>Método de Entrega *</Label>
              <RadioGroup
                value={formData.deliveryMethod}
                onValueChange={(value) => handleInputChange('deliveryMethod', value)}
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="retirada" id="retirada" />
                  <Label htmlFor="retirada" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <div>
                        <p>Retirar na loja</p>
                        <p className="text-gray-500">Rua Ministro João Alberto, 521 - Caxangá</p>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="entrega" id="entrega" />
                  <Label htmlFor="entrega" className="flex-1 cursor-pointer">
                    <div>
                      <p>Entrega em domicílio</p>
                      <p className="text-gray-500">Taxa de entrega a calcular</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.deliveryMethod === 'entrega' && (
              <>
                <div>
                  <Label htmlFor="address">Endereço Completo *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Rua, número, bairro, cidade, CEP"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="complement">Complemento/Referência</Label>
                  <Input
                    id="complement"
                    value={formData.complement}
                    onChange={(e) => handleInputChange('complement', e.target.value)}
                    placeholder="Apto, bloco, ponto de referência"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Forma de Pagamento *</Label>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange('paymentMethod', value)}
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="dinheiro" id="dinheiro" />
                  <Label htmlFor="dinheiro" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4" />
                      <span>Dinheiro</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>PIX</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="cartao" id="cartao" />
                  <Label htmlFor="cartao" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Cartão (na entrega/retirada)</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3>Resumo do Pedido</h3>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de entrega:</span>
                <span>{formData.deliveryMethod === 'retirada' ? 'Grátis' : 'A calcular'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Total:</span>
                <span className="text-orange-600">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1" disabled={loading}>
              Voltar
            </Button>
          )}
          {step < 3 ? (
            <Button 
              onClick={handleNext} 
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={
                (step === 1 && (!formData.name || !formData.phone)) ||
                (step === 2 && formData.deliveryMethod === 'entrega' && !formData.address)
              }
            >
              Próximo
            </Button>
          ) : (
            <Button 
              onClick={handleConfirmOrder} 
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar Pedido'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
