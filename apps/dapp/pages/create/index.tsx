import {
  ESCROW_STEPS,
  INVOICE_TYPES,
  TOASTS,
} from '@smartinvoicexyz/constants';
import {
  EscrowDetailsForm,
  FormConfirmation,
  PaymentsForm,
  ProjectDetailsForm,
  RegisterSuccess,
} from '@smartinvoicexyz/forms';
import { useInvoiceCreate, useInvoiceTemplates } from '@smartinvoicexyz/hooks';
import { Container, StepInfo, useToast } from '@smartinvoicexyz/ui';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Address, Hex } from 'viem';
import { useChainId } from 'wagmi';

import { SaveTemplateModal } from '../../components/SaveTemplateModal';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

export function CreateInvoiceEscrow() {
  const invoiceForm = useForm();
  const toast = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [txHash, setTxHash] = useState<Hex>();

  const [invoiceId, setInvoiceId] = useState<Address>();
  const chainId = useChainId();
  const [currentChainId, setCurrentChainId] = useState(chainId);
  const { templates, saveTemplate } = useInvoiceTemplates();
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // Pre-fill from query params (e.g. from Farcaster bot link)
  useEffect(() => {
    const { client, amount, token } = router.query;
    if (client && typeof client === 'string') {
      invoiceForm.setValue('client', client);
    }
    if (amount && typeof amount === 'string') {
      invoiceForm.setValue('milestones', [{ title: 'Milestone 1', amount }]);
    }
    if (token && typeof token === 'string') {
      invoiceForm.setValue('token', token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    if (chainId !== currentChainId) {
      setCurrentChainId(chainId);
      setCurrentStep(1);
    }
  }, [chainId, currentChainId]);

  const nextStepHandler = () => {
    setCurrentStep(currentStep + 1);
  };

  const goBackHandler = () => {
    setCurrentStep(currentStep - 1);
  };

  const onTxSuccess = (result: Address) => {
    toast.success(TOASTS.useInvoiceCreate.success);
    setInvoiceId(result as Address);
    nextStepHandler();
  };

  const { writeAsync, isLoading } = useInvoiceCreate({
    invoiceForm,
    toast,
    onTxSuccess,
  });

  const handleSubmit = async () => {
    const hash = await writeAsync?.();
    setTxHash(hash);
  };

  const TEMPLATE_FIELDS = [
    'title',
    'description',
    'document',
    'milestones',
    'token',
    'resolverType',
    'resolverAddress',
  ] as const;

  const loadTemplate = (templateId: string) => {
    const tmpl = templates.find(t => t.id === templateId);
    if (!tmpl) return;
    TEMPLATE_FIELDS.forEach(field => {
      if (tmpl.data[field]) invoiceForm.setValue(field, tmpl.data[field]);
    });
    toast.success({ title: `Template "${tmpl.name}" loaded` });
  };

  const handleSaveTemplate = (name: string) => {
    const values = invoiceForm.getValues();
    const data = Object.fromEntries(TEMPLATE_FIELDS.map(f => [f, values[f]]));
    saveTemplate(name, data);
    toast.success({ title: `Template "${name}" saved` });
    setSaveModalOpen(false);
  };

  return (
    <Container overlay>
      <div className="my-8 flex w-[95%] max-w-[45rem] flex-col items-center justify-center gap-8 px-4">
        <div className="flex w-full flex-col gap-4 md:w-auto md:gap-4">
          <h1 className="text-center text-xl font-bold md:text-2xl">
            Create an Escrow Contract
          </h1>

          {currentStep === 1 && templates.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  Load Template
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {templates.map(t => (
                  <DropdownMenuItem
                    key={t.id}
                    onClick={() => loadTemplate(t.id)}
                  >
                    {t.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <p
            className="w-full text-center italic text-muted-foreground"
            style={{ textIndent: 20 }}
          >
            Note: All contract data will be stored publicly on IPFS and can be
            viewed by anyone. If you have privacy concerns, we recommend taking
            care to add permissions to your project agreement document.
          </p>

          <div className="flex w-full flex-col justify-between rounded-lg bg-card p-4">
            <StepInfo
              stepNum={currentStep}
              stepsDetails={ESCROW_STEPS}
              goBack={isLoading ? undefined : goBackHandler}
            />
            {currentStep === 1 && (
              <ProjectDetailsForm
                invoiceForm={invoiceForm}
                updateStep={nextStepHandler}
                type={INVOICE_TYPES.Escrow}
              />
            )}

            {currentStep === 2 && (
              <EscrowDetailsForm
                invoiceForm={invoiceForm}
                updateStep={nextStepHandler}
              />
            )}

            {currentStep === 3 && (
              <PaymentsForm
                invoiceForm={invoiceForm}
                updateStep={nextStepHandler}
              />
            )}

            {currentStep === 4 && (
              <>
                <FormConfirmation
                  invoiceForm={invoiceForm}
                  handleSubmit={handleSubmit}
                  canSubmit={!!writeAsync}
                  isLoading={isLoading}
                  type={INVOICE_TYPES.Escrow}
                />
                <div className="mt-4 flex justify-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSaveModalOpen(true)}
                  >
                    Save as Template
                  </Button>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <RegisterSuccess
                invoiceId={invoiceId as Address}
                txHash={txHash as Address}
              />
            )}
          </div>
        </div>
      </div>

      <SaveTemplateModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveTemplate}
      />
    </Container>
  );
}

export default CreateInvoiceEscrow;

export const getServerSideProps = async () => ({ props: {} });
