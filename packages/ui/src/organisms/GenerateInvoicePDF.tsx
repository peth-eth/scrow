import { PDFViewer } from '@react-pdf/renderer';
import { InvoiceDetails } from '@smartinvoicexyz/types';
import { ButtonHTMLAttributes, useEffect, useState } from 'react';

import { Button } from '../atoms/Button';
import { InvoicePDF } from '../molecules';

interface GenerateInvoicePDFProps {
  invoice: Partial<InvoiceDetails>;
  buttonText: string;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

export function GenerateInvoicePDF({
  invoice,
  buttonText,
  buttonProps,
}: GenerateInvoicePDFProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const { address } = invoice || {};

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col items-stretch">
      <Button
        variant="outline"
        size="sm"
        onClick={onOpen}
        className="px-2 py-1 text-xs uppercase border-primary text-primary font-normal font-mono hover:bg-primary/10"
        {...buttonProps}
      >
        {buttonText}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <div
            className="relative bg-card rounded-lg w-[100vw] max-w-[80rem] h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 text-foreground">
              <h3 className="font-semibold">Smart Invoice {address}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="p-1 text-foreground"
                aria-label="Close"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z" />
                </svg>
              </Button>
            </div>

            <div className="h-[calc(90vh-60px)] px-4 pb-4">
              <PDFViewer
                className="app"
                style={{
                  margin: '0 auto',
                  width: '100%',
                  height: '95%',
                }}
              >
                <InvoicePDF invoice={invoice} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface GenerateInvoicePDFMenuItemProps {
  invoice: Partial<InvoiceDetails>;
  text: string;
  onClick?: () => void;
  className?: string;
}

export function GenerateInvoicePDFMenuItem({
  invoice,
  text,
  ...props
}: GenerateInvoicePDFMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const { address } = invoice || {};

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col items-stretch">
      <Button
        variant="ghost"
        onClick={onOpen}
        className="w-full text-left px-4 py-2 text-sm"
        {...props}
      >
        {text}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <div
            className="relative bg-card rounded-lg w-[100vw] max-w-[80rem] h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 text-foreground">
              <h3 className="font-semibold">Smart Invoice {address}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="p-1 text-foreground"
                aria-label="Close"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z" />
                </svg>
              </Button>
            </div>

            <div className="h-[calc(90vh-60px)] px-4 pb-4">
              <PDFViewer
                className="app"
                style={{
                  margin: '0 auto',
                  width: '100%',
                  height: '95%',
                }}
              >
                <InvoicePDF invoice={invoice} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
