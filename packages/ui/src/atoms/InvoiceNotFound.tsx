import { Container } from './Container';

export function InvoiceNotFound({ heading }: { heading?: string }) {
  return (
    <Container>
      <div className="flex flex-col gap-4 items-center rounded-2xl bg-white w-[calc(100%-2rem)] p-8 max-w-[27.5rem] mx-4">
        <h2 className="text-2xl text-center font-heading text-black">
          {heading || 'Invoice Not Found'}
        </h2>
      </div>
    </Container>
  );
}
