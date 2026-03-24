import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
};

export function SaveTemplateModal({ isOpen, onClose, onSave }: Props) {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Save as Template</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="sm" color="gray.600" mb={3}>
            Save the current invoice settings as a reusable template. Next time
            you create an invoice, you can load this template to pre-fill the
            form.
          </Text>
          <Input
            placeholder="Template name (e.g., Monthly Retainer)"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} isDisabled={!name.trim()}>
            Save Template
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
