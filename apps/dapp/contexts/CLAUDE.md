# Dapp Contexts

React context providers for app-wide state.

## Key Files

- `OverlayContext.tsx` — manages modal visibility for invoice actions (deposit, lock, release, resolve, withdraw, addMilestones, depositTip). Provides `openModal(type)` and `closeModals()`. Types from `@smartinvoicexyz/types`.
- `FrameContext.tsx` — Farcaster Frame/Mini App SDK integration. Wraps `@farcaster/frame-sdk` to provide `isSDKLoaded`, `context`, `openUrl`, `close`, `addFrame`, and notification state. Falls back to browser APIs when not in a Farcaster client.

## Patterns

- Both contexts are provided in `_app.tsx` provider stack: `FrameProvider > OverlayContextProvider`
- `useOverlay()` hook is exported from `OverlayContext.tsx` for consuming components
- FrameContext has no exported consumer hook — use `React.useContext(FrameContext)` or add one if needed

## Gotchas

- OverlayContext resets ALL modals when opening one (mutual exclusivity by design)
- FrameContext calls `sdk.actions.ready({})` on load — must be loaded even for non-Farcaster usage
