import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { API_URL } from "../constant";

export interface DynamicField {
  id?: number;
  label: string;
  hinweis: string;
  type: string;
  isRequired: boolean;
  options?: string;
}

interface FormContextType {
  fields: DynamicField[];
  addField: () => void;
  updateField: (index: number, updatedField: DynamicField) => void;
  removeField: (index: number) => void;
  saveConfig: () => Promise<void>;
  loading: boolean;
  methods: UseFormReturn<any>; // On expose les méthodes de react-hook-form
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormularContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialisation de React Hook Form
  const methods = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/api/dynamicfieldsProduktEigenschaft`)
      .then((res) => setFields(res.data))
      .finally(() => setLoading(false));
  }, []);

  const addField = () => {
    setFields([
      ...fields,
      { label: "", hinweis: "", type: "text", isRequired: false },
    ]);
  };

  const updateField = (index: number, updatedField: DynamicField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const saveConfig = async () => {
    try {
      await axios.post(
        `${API_URL}/dynamicfieldsProduktEigenschaft/sync`,
        fields,
      );
      alert("Configuration enregistrée !");
    } catch (error) {
      console.error("Erreur de sauvegarde", error);
    }
  };

  return (
    <FormContext.Provider
      value={{
        fields,
        addField,
        updateField,
        removeField,
        saveConfig,
        loading,
        methods,
      }}
    >
      {/* On enveloppe les enfants avec FormProvider pour React Hook Form */}
      <FormProvider {...methods}>{children}</FormProvider>
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context)
    throw new Error("useFormConfig must be used within FormConfigProvider");
  return context;
};
