import { useCallback, useEffect, useState } from 'react';

export type InvoiceTemplate = {
  id: string;
  name: string;
  createdAt: number;
  data: {
    title?: string;
    description?: string;
    document?: string;
    milestones?: { value: string; title?: string; description?: string }[];
    token?: string;
    resolverType?: string;
    resolverAddress?: string;
  };
};

const STORAGE_KEY = 'scrow-invoice-templates';

const loadTemplates = (): InvoiceTemplate[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistTemplates = (templates: InvoiceTemplate[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
};

export const useInvoiceTemplates = () => {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  const saveTemplate = useCallback(
    (name: string, data: InvoiceTemplate['data']) => {
      const template: InvoiceTemplate = {
        id: `tmpl_${Date.now()}`,
        name,
        createdAt: Date.now(),
        data,
      };
      const updated = [...loadTemplates(), template];
      persistTemplates(updated);
      setTemplates(updated);
      return template;
    },
    [],
  );

  const deleteTemplate = useCallback((id: string) => {
    const updated = loadTemplates().filter(t => t.id !== id);
    persistTemplates(updated);
    setTemplates(updated);
  }, []);

  const getTemplate = useCallback((id: string) => {
    return loadTemplates().find(t => t.id === id) ?? null;
  }, []);

  return { templates, saveTemplate, deleteTemplate, getTemplate };
};
