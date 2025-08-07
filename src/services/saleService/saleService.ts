import { toast } from "react-toastify";
import type { SaleItem, CreateSalePayload } from "../../types/saleItem";
import { api } from "../api/api";
import type { Sale, SalesData } from "../../types/sales";
import { AxiosError } from "axios";

class SalesService {
  private sale: SaleItem[] = [];

  getCart(): SaleItem[] {
    return this.sale;
  }

  addToCart(product: { id: number; name: string; sellingPrice: number; iva: number }): SaleItem[] {
    try {
      const existingItem = this.sale.find((item) => item.productId === product.id);

      if (existingItem) {
        this.sale = this.sale.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        this.sale = [
          ...this.sale,
          {
            productId: product.id,
            name: product.name,
            sellingPrice: product.sellingPrice,
            iva: product.iva,
            quantity: 1,
          },
        ];
      }

      return this.sale;
    } catch (error) {
      toast.error("Erro ao adicionar item ao carrinho.");
      console.error("addToCart Error:", error);
      return this.sale;
    }
  }

  removeFromCart(productId: number): SaleItem[] {
    try {
      this.sale = this.sale.filter((item) => item.productId !== productId);
      return this.sale;
    } catch (error) {
      toast.error("Erro ao remover item do carrinho.");
      console.error("removeFromCart Error:", error);
      return this.sale;
    }
  }

  updateQuantity(productId: number, newQuantity: number): SaleItem[] {
    try {
      if (newQuantity < 1) return this.sale;

      this.sale = this.sale.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      );

      return this.sale;
    } catch (error) {
      toast.error("Erro ao atualizar a quantidade.");
      console.error("updateQuantity Error:", error);
      return this.sale;
    }
  }

  calculateSubTotal(): number {
    try {
      return this.sale.reduce(
        (sum, item) => sum + item.sellingPrice * item.quantity,
        0
      );
    } catch (error) {
      toast.error("Erro ao calcular o subtotal.");
      console.error("calculateSubTotal Error:", error);
      return 0;
    }
  }

  calculateVAT(): number {
    try {
      return this.sale.reduce((sum, item) => {
        const itemSubtotal = item.sellingPrice * item.quantity;
        const itemVAT = itemSubtotal * item.iva;
        return sum + itemVAT;
      }, 0);
    } catch (error) {
      toast.error("Erro ao calcular o IVA.");
      console.error("calculateVAT Error:", error);
      return 0;
    }
  }

  calculateTotal(): number {
    try {
      const subtotal = this.calculateSubTotal();
      const vat = this.calculateVAT();
      return subtotal + vat;
    } catch (error) {
      toast.error("Erro ao calcular o total.");
      console.error("calculateTotal Error:", error);
      return 0;
    }
  }

  clearCart(): void {
    try {
      this.sale = [];
    } catch (error) {
      toast.error("Erro ao limpar o carrinho.");
      console.error("clearCart Error:", error);
    }
  }

  async getAllSales(): Promise<SalesData[] | undefined> {
    try {
      const response = await api.get("/sales/sales");
      console.log("Todas vendas:", response.data);
      return response.data;
    } catch (error) {
      toast.error("Erro ao buscar vendas.");
      console.error("getAllSales Error:", error);
    }
  }

  async createSale(cart: SaleItem[], clientName: string, amountPaid: number): Promise<void> {
    try {
      if (!Array.isArray(cart) || cart.length === 0) {
        toast.error("Carrinho inválido.");
        throw new Error("Carrinho inválido");
      }

      const subtotal = this.calculateSubTotal();
      const vat = this.calculateVAT();
      const total = subtotal + vat;
      const change = amountPaid - total;

      if (change < 0) {
        toast.error("Valor pago insuficiente.");
        throw new Error("Valor pago insuficiente.");
      }

      const payload: CreateSalePayload = {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        clientName,
        amountPaid,
        change,
      };

      console.log("Payload enviado:", payload);

      const response = await api.post("/sales", payload);
      toast.success("Venda realizada com sucesso!");
      return response.data;
    } catch (error) {
      const message =
        error instanceof AxiosError && error.response?.data?.message
          ? error.response.data.message
          : "Erro ao finalizar a venda.";
      toast.error(message);
      console.error("createSale Error:", error);
      throw error;
    }
  }


 async getRecent(): Promise<Sale[]> {
  try {
    const res = await api.get("/sales/recent");
    console.log("vendas recentes:", res.data);
    return res.data;
  } catch (error) {
    toast.error("Erro ao buscar últimas vendas.");
    console.error("getRecent Error:", error);
    return [];
  }
}

}

export default new SalesService();
