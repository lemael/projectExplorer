import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

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

const API_URL = "http://localhost:5297/api/Products"; // Ton URL Render

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // LIRE (GET)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Product[]>(API_URL);
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
      const response = await axios.post<Product>(API_URL, newProduct);
      setProducts((prev) => [...prev, response.data]); // Ajout local instantané
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };

  // METTRE À JOUR (PATCH/PUT)
  const updateProduct = async (id: number, updatedFields: Partial<Product>) => {
    try {
      await axios.patch(`${API_URL}/${id}`, updatedFields);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
      );
    } catch (error) {
      console.error("Erreur lors de la modif :", error);
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
