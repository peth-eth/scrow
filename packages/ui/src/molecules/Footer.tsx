export function Footer() {
  return (
    <div className="bg-card w-full self-end z-[5]">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-20 py-4 text-muted-foreground gap-y-3">
        <a href="/" className="flex items-center gap-2">
          <img
            src="/scrow-logo.png"
            alt="sCrow"
            className="rounded-md"
            style={{ height: 24 }}
          />
          <span className="text-sm font-medium text-foreground">sCrow</span>
        </a>

        <p className="text-xs text-muted-foreground/60">
          Based on{' '}
          <a
            href="https://smartinvoice.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-muted-foreground"
          >
            smartinvoice.xyz
          </a>
          {' by Raid Guild. A resurrection by peth.eth, with love.'}
        </p>
      </div>
    </div>
  );
}
