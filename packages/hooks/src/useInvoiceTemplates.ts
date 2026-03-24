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

const persistTemplates = (list: InvoiceTemplate[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
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
      setTemplates(prev => {
        const updated = [...prev, template];
        persistTemplates(updated);
        return updated;
      });
      return template;
    },
    [],
  );

  const deleteTemplate = useCallback((id: string) => {
    setTemplates(prev => {
      const updated = prev.filter(t => t.id !== id);
      persistTemplates(updated);
      return updated;
    });
  }, []);

  const getTemplate = useCallback(
    (id: string) => templates.find(t => t.id === id) ?? null,
    [templates],
  );

  return { templates, saveTemplate, deleteTemplate, getTemplate };
};
