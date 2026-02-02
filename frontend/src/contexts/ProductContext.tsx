import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_URL } from "../constant";

// 1. Définition du modèle (doit correspondre à ta classe Product.cs)
export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const API_URL1 = `${API_URL}/Products`; // Ton URL Render

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // LIRE (GET)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Product[]>(API_URL1);
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    } finally {
      setLoading(false);
    }
  };

  // CRÉER (POST)
  const addProduct = async (newProduct: Omit<Product, "id">) => {
    try {
      const response = await axios.post<Product>(API_URL1, newProduct);
      setProducts((prev) => [...prev, response.data]); // Ajout local instantané
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  // METTRE À JOUR (PATCH/PUT)
  const updateProduct = async (id: number, updatedFields: Partial<Product>) => {
    try {
      // On récupère le produit actuel pour garder les données non modifiées (comme le Name)
      const currentProduct = products.find((p) => p.id === id);
      if (!currentProduct) return;

      // On crée l'objet "Product" complet à envoyer
      const productData = {
        ...currentProduct,
        ...updatedFields,
      };

      // On envoie l'objet complet au backend
      await axios.patch(`${API_URL1}/${id}`, productData);

      // Mise à jour locale du state
      setProducts((prev) => prev.map((p) => (p.id === id ? productData : p)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      throw error;
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, loading, fetchProducts, addProduct, updateProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProducts must be used within ProductProvider");
  return context;
};
