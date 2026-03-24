import { ReactNode } from 'react';

export type ModalType =
  | 'networkChange'
  | 'deposit'
  | 'lock'
  | 'release'
  | 'resolve'
  | 'withdraw'
  | 'addMilestones'
  | 'depositTip';

export type Modals = Record<ModalType, boolean>;

export const ModalTypes: Record<string, ModalType> = {
  NETWORK_CHANGE: 'networkChange' as ModalType,
  DEPOSIT: 'deposit' as ModalType,
  LOCK: 'lock' as ModalType,
  RELEASE: 'release' as ModalType,
  RESOLVE: 'resolve' as ModalType,
  WITHDRAW: 'withdraw' as ModalType,
  ADD_MILESTONES: 'addMilestones' as ModalType,
  TIP: 'depositTip' as ModalType,
};

export type OverlayContextType = {
  modals: Modals;
  openModal: (type: ModalType) => void;
  closeModals: () => void;
};

export type ToastProps = {
  title: string | ReactNode;
  description?: string | ReactNode;
  iconName?: string;
  iconColor?: string;
  closeToast?: () => void;
  descriptionNoOfLines?: number;
  status?: string;
  id?: string;
  duration?: number | null;
  isClosable?: boolean;
  position?: string;
};

export interface UseToastReturn {
  success: (_props: Omit<ToastProps, 'status'>) => void;
  error: (_props: Omit<ToastProps, 'status'>) => void;
  warning: (_props: Omit<ToastProps, 'status'>) => void;
  loading: (_props: Omit<ToastProps, 'status'>) => void;
  info: (_props: Omit<ToastProps, 'status'>) => void;
}
