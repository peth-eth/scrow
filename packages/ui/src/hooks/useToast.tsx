import { UseToastReturn } from '@smartinvoicexyz/types';
import { toast as sonnerToast } from 'sonner';

export const useToast = (): UseToastReturn => {
  return {
    success(props) {
      sonnerToast.dismiss();
      sonnerToast.success(String(props.title ?? ''), {
        description: props.description ? String(props.description) : undefined,
        duration: props.duration ?? undefined,
        dismissible: props.isClosable ?? true,
      });
    },
    error(props) {
      sonnerToast.dismiss();
      sonnerToast.error(String(props.title ?? ''), {
        description: props.description ? String(props.description) : undefined,
        duration: props.duration ?? undefined,
        dismissible: props.isClosable ?? true,
      });
    },
    warning(props) {
      sonnerToast.dismiss();
      sonnerToast.warning(String(props.title ?? ''), {
        description: props.description ? String(props.description) : undefined,
        duration: props.duration ?? undefined,
        dismissible: props.isClosable ?? true,
      });
    },
    loading(props) {
      sonnerToast.dismiss();
      sonnerToast.loading(String(props.title ?? ''), {
        description: props.description ? String(props.description) : undefined,
        duration: props.duration ?? undefined,
        dismissible: props.isClosable ?? true,
      });
    },
    info(props) {
      sonnerToast.dismiss();
      sonnerToast.info(String(props.title ?? ''), {
        description: props.description ? String(props.description) : undefined,
        duration: props.duration ?? undefined,
        dismissible: props.isClosable ?? true,
      });
    },
  };
};
