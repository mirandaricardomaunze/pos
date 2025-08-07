import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductService } from '../../services/productService/productService';
import type { SaleItem } from '../../types/saleItem';
import type { ProductFormData } from '../../types/product';
import Input from '../../components/ui/input';
import { PlusIcon, MinusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/userContext/usercontext';
import saleService from '../../services/saleService/saleService';
import LoadingSpinner from '../../components/loading/LoadingSpinner';
import { ShoppingCartIcon } from '@heroicons/react/16/solid';
import type { Company } from '../../types/company';
import companyService from '../../services/companyService/companyService';

const SalePage: React.FC = () => {
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [cart, setCart] = useState<SaleItem[]>(saleService.getCart());
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [company,setCompany]=useState<Company>();
  const { user } = useAuth();

  const total = saleService.calculateTotal();
  const iva = saleService.calculateVAT();
  const subTotal = saleService.calculateSubTotal();
  const change = amountPaid - total;

  const companyId = useMemo(() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user).companyId : null;
    } catch {
      return null;
    }
  }, []);
    
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const data = await ProductService.getProductByCompanyId(Number(companyId));
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);


useEffect(()=>{
   const fetchCompanyName= async()=>{
      const companyData=await companyService.getCompanyById(Number(companyId))
      setCompany(companyData)
   }
   fetchCompanyName();
},[])





  const handleAddToCart = (product: ProductFormData) => {
    if (typeof product.id !== 'number') {
      toast.error('Produto inválido: ID ausente');
      return;
    }
    const updatedCart = saleService.addToCart({
      id: product.id,
      name: product.name,
      sellingPrice: product.sellingPrice,
      iva: product.iva,
    });
    setCart(updatedCart);
  };

  const handleRemoveFromCart = (productId: number) => {
    const updatedCart = saleService.removeFromCart(productId);
    setCart(updatedCart);
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    const updatedCart = saleService.updateQuantity(productId, newQuantity);
    setCart(updatedCart);
  };

  const handlePrintReceipt = () => {
  const receiptWindow = window.open('', '_blank');
  if (!receiptWindow) return;

  // Formatação para recibo térmico (80mm)
  const receiptHtml = `
    <html>
      <head>
        <title>Recibo de Venda</title>
        <style>
          @page { size: 80mm auto; margin: 0; }
          body { 
            font-family: 'Courier New', monospace;
            font-size: 12px;
            width: 80mm;
            margin: 0 auto;
            padding: 5px;
            color: #000;
          }
          .header {
            text-align: center;
            margin-bottom: 10px;
          }
          .header h2 {
            font-size: 14px;
            font-weight: bold;
            margin: 5px 0;
          }
          .divider {
            border-top: 1px dashed #000;
            margin: 5px 0;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
          }
          .item-name {
            flex: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .item-qty {
            flex: 1;
            text-align: center;
          }
          .item-price {
            flex: 1;
            text-align: right;
          }
          .total-row {
            font-weight: bold;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 10px;
            font-size: 11px;
          }
          .text-center {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>${company?.name || 'MINHA EMPRESA'}</h2>
          <div>NUIT: ${company?.Nuit || '00.000.000/0000-00'}</div>
          <div>${company?.address || 'Endereço da Empresa'}</div>
          <div class="divider"></div>
          <h2>RECIBO DE VENDA</h2>
          <div>${new Date().toLocaleString('pt-BR')}</div>
        </div>

        <div class="divider"></div>
        
        <div>
          <div class="item-row">
            <span><strong>Operador:</strong></span>
            <span>${user?.name || '---'}</span>
          </div>
          <div class="item-row">
            <span><strong>Cliente:</strong></span>
            <span>${clientName || 'Consumidor Final'}</span>
          </div>
        </div>

        <div class="divider"></div>

        <div>
          ${cart.map(item => `
            <div class="item-row">
              <span class="item-name">${item.name}</span>
              <span class="item-qty">${item.quantity}x</span>
              <span class="item-price">Mtn ${item.sellingPrice.toFixed(2)}</span>
            </div>
            <div class="item-row">
              <span class="item-name"></span>
              <span class="item-qty"></span>
              <span class="item-price">Mtn ${(item.quantity * item.sellingPrice).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>

        <div class="divider"></div>

        <div>
          <div class="item-row">
            <span>SubTotal:</span>
            <span>Mtn ${subTotal.toFixed(2)}</span>
          </div>
          <div class="item-row">
            <span>IVA:</span>
            <span>Mtn ${iva.toFixed(2)}</span>
          </div>
          <div class="item-row total-row">
            <span>TOTAL:</span>
            <span>Mtn ${total.toFixed(2)}</span>
          </div>
        </div>

        <div class="divider"></div>

        <div>
          <div class="item-row">
            <span>Valor Pago:</span>
            <span>Mtn ${amountPaid.toFixed(2)}</span>
          </div>
          <div class="item-row">
            <span>Troco:</span>
            <span>Mtn ${change.toFixed(2)}</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="footer">
          <div>Obrigado pela sua compra!</div>
          <div>Volte sempre</div>
          <div class="divider"></div>
          <div>${company?.phone || '(00) 0000-0000'}</div>
          <div>${company?.email || 'email@empresa.com'}</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 200);
          }
        </script>
      </body>
    </html>
  `;

  receiptWindow.document.open();
  receiptWindow.document.write(receiptHtml);
  receiptWindow.document.close();
};

  const handleFinishSale = async () => {
    if (amountPaid < total) {
      toast.error('Valor pago é insuficiente');
      return;
    }

    try {
      await saleService.createSale(cart, clientName, amountPaid);
      saleService.clearCart();
      setCart([]);
      setClientName('');
      setAmountPaid(0);
      toast.success('Venda finalizada com sucesso!');

      setTimeout(() => {
        handlePrintReceipt();
      }, 1000);
    } catch (error) {
      toast.error('Erro ao finalizar a venda');
    }
  };

  if (isLoading) return <LoadingSpinner/>;
  if (error) return <div>Error: {error}</div>;

  const filteredProducts = searchTerm
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 print:bg-white p-6 gap-6">
      {/* Products Section */}
      <div className="w-full md:w-2/3 space-y-6">
      <div className="relative bg-white p-5 rounded-xl shadow-sm border border-gray-200">
      <div className="absolute inset-y-0 left-6 bottom-3  flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>

      <Input
        type="text"
        placeholder="Buscar produtos..."
        className="w-full pl-12 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-h-[70vh] overflow-y-auto pr-2">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-200 cursor-pointer group"
              onClick={() => handleAddToCart(product)}
            >
              <div className="h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
              <p className="text-blue-600 font-semibold mt-1">
                Mtn {product.sellingPrice.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Estoque: <span className="font-medium">{product.quantity || 0}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit sticky top-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3 flex items-center">
          <span className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
            <ShoppingCartIcon className=' w-5 h-5'/>
          </span>
          Carrinho de Compras
        </h2>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Cliente</label>
          <Input
            type="text"
            placeholder="Digite o nome do cliente"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>

        <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium text-blue-600">
                    Mtn {item.sellingPrice.toFixed(2)}
                  </span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="text-sm text-gray-500">Qtd: {item.quantity}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateQuantity(item.productId, item.quantity - 1);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateQuantity(item.productId, item.quantity + 1);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromCart(item.productId);
                  }}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-3 border-t border-gray-200 pt-4">
          <div className="flex justify-between text-gray-700">
            <span>SubTotal:</span>
            <span className="font-medium">Mtn {subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>IVA:</span>
            <span className="font-medium">Mtn {iva.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3 mt-2">
            <span>Total:</span>
            <span>Mtn {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="mt-5 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Valor Pago:</label>
            <input
              type="number"
              className="border border-gray-300 p-2 rounded-lg w-32 focus:ring-2 focus:ring-blue-500"
              value={amountPaid}
              onChange={(e) => setAmountPaid(parseFloat(e.target.value))}
              min={0}
              step={0.01}
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Troco:</label>
            <span className={`font-semibold ${change < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {change >= 0 ? `Mtn ${change.toFixed(2)}` : 'Valor insuficiente'}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-all shadow-sm hover:shadow-md
            ${cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'}`}
          onClick={handleFinishSale}
          disabled={cart.length === 0}
        >
          Finalizar Venda
        </button>
      </div>
    </div>
  );
};

export default SalePage;