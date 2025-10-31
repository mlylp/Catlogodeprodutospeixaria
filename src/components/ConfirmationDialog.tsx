import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Check, Phone } from 'lucide-react';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfirmationDialog({ open, onOpenChange }: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Pedido Confirmado!</DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-green-600 mb-2">Seu pedido foi recebido com sucesso!</h3>
          <p className="text-gray-600 mb-4">
            Entraremos em contato em breve para confirmar os detalhes.
          </p>
          
          <div className="bg-orange-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-center gap-2 text-orange-700">
              <Phone className="w-5 h-5" />
              <span>WhatsApp: (81) 9638-0257</span>
            </div>
          </div>

          <p className="text-gray-500">
            Você receberá uma confirmação pelo WhatsApp informado.
          </p>
        </div>

        <Button 
          onClick={() => onOpenChange(false)} 
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Fechar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
