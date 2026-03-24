import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  DEFAULT_ARBITRATOR_FC_USERNAME,
  ESCROW_STEPS,
  KLEROS_COURTS,
  KnownResolverType,
} from '@smartinvoicexyz/constants';
import { FormInvoice } from '@smartinvoicexyz/types';
import { Checkbox, Input, Select } from '@smartinvoicexyz/ui';
import {
  escrowDetailsSchema,
  getResolverInfo,
  getResolverString,
} from '@smartinvoicexyz/utils';
import { useCallback, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useChainId } from 'wagmi';

import { FarcasterArbitratorPicker } from './FarcasterArbitratorPicker';

export function EscrowDetailsForm({
  invoiceForm,
  updateStep,
}: {
  invoiceForm: UseFormReturn;
  updateStep: (_i?: number) => void;
}) {
  const chainId = useChainId();
  const { watch, setValue } = invoiceForm;
  const {
    provider,
    client,
    resolverType,
    resolverAddress,
    isResolverTermsChecked,
    klerosCourt,
  } = watch();

  const localForm = useForm({
    resolver: yupResolver(escrowDetailsSchema(chainId)),
    defaultValues: {
      client,
      provider,
      resolverAddress,
      resolverType: resolverType || ('custom' as KnownResolverType),
      isResolverTermsChecked,
      klerosCourt: klerosCourt || 1,
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    setValue: setLocalValue,
  } = localForm;

  const onSubmit = (values: Partial<FormInvoice>) => {
    setValue('client', values?.client);
    setValue('provider', values?.provider);
    setValue('resolverType', values?.resolverType);
    setValue('resolverAddress', values?.resolverAddress);
    setValue('isResolverTermsChecked', values?.isResolverTermsChecked);
    setValue('klerosCourt', values?.klerosCourt);
    updateStep();
  };

  const buttonSize = useBreakpointValue({ base: 'sm', sm: 'md', md: 'lg' });

  // Arbitrator mode: 'farcaster' (default), 'kleros', or 'custom'
  const [arbitratorMode, setArbitratorMode] = useState<string>(
    resolverType === 'kleros' ? 'kleros' : 'farcaster',
  );

  const handleArbitratorModeChange = (mode: string) => {
    setArbitratorMode(mode);
    if (mode === 'kleros') {
      setLocalValue('resolverType', 'kleros');
    } else {
      setLocalValue('resolverType', 'custom');
    }
  };

  const handleFarcasterSelect = useCallback(
    (address: string) => {
      setLocalValue('resolverAddress', address);
      setLocalValue('resolverType', 'custom');
    },
    [setLocalValue],
  );

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4} w="100%">
        <Stack spacing={4}>
          <Input
            label="Client Address"
            tooltip="This is the wallet address your client uses to access the invoice, pay with, & release escrow funds. Ensure your client has full control of this address."
            placeholder="0x..."
            name="client"
            localForm={localForm}
            registerOptions={{ required: true }}
          />
        </Stack>

        <Stack spacing={4}>
          <Input
            label="Service Provider Address"
            tooltip="This is your controlling address. You use it to access this invoice, manage transactions, and receive funds released from escrow. Ensure you have full control over this address."
            placeholder="0x..."
            name="provider"
            localForm={localForm}
            registerOptions={{ required: true }}
          />
        </Stack>

        <Stack gap={4}>
          <Text fontWeight="bold" fontSize="sm">
            Arbitration Provider
          </Text>

          <Flex gap={2}>
            <Button
              size="sm"
              variant={arbitratorMode === 'farcaster' ? 'solid' : 'outline'}
              onClick={() => handleArbitratorModeChange('farcaster')}
            >
              Community
            </Button>
            <Button
              size="sm"
              variant={arbitratorMode === 'kleros' ? 'solid' : 'outline'}
              onClick={() => handleArbitratorModeChange('kleros')}
            >
              Kleros
            </Button>
            <Button
              size="sm"
              variant={arbitratorMode === 'custom' ? 'solid' : 'outline'}
              onClick={() => handleArbitratorModeChange('custom')}
            >
              Custom Address
            </Button>
          </Flex>

          {arbitratorMode === 'farcaster' && (
            <FarcasterArbitratorPicker
              onSelect={handleFarcasterSelect}
              defaultUsername={DEFAULT_ARBITRATOR_FC_USERNAME}
            />
          )}

          {arbitratorMode === 'kleros' && (
            <>
              <Alert bg="yellow.500" borderRadius="md" color="white">
                <AlertIcon color="whiteAlpha.800" />
                <Box>
                  <AlertTitle fontSize="sm">
                    Only choose Kleros if total invoice value is greater than
                    1000 USD
                  </AlertTitle>
                  <AlertDescription fontSize="sm">
                    Smart Invoice will only escalate claims to Kleros that are
                    linked to smart escrows holding tokens with a minimum value
                    of 1000 USD at the time of locking the funds.
                  </AlertDescription>
                </Box>
              </Alert>

              <Select
                name="klerosCourt"
                tooltip="This kleros court will be used in case of dispute."
                label="Kleros Court"
                localForm={localForm}
              >
                {KLEROS_COURTS.map(
                  (court: { id: number; name: string }) => (
                    <option key={court.id} value={court.id}>
                      {court.name}
                    </option>
                  ),
                )}
              </Select>

              <Checkbox
                name="isResolverTermsChecked"
                localForm={localForm}
                options={[
                  <Text>
                    {`I agree to ${getResolverString('kleros', chainId)}`}
                    &apos;s{' '}
                    <Link
                      href={getResolverInfo('kleros', chainId)?.termsUrl}
                      isExternal
                      textDecor="underline"
                    >
                      terms of service
                    </Link>
                  </Text>,
                ]}
              />
            </>
          )}

          <Alert status="info" borderRadius="md" fontSize="sm">
            <AlertIcon />
            <AlertDescription>
              If a dispute occurs, the arbitrator receives a 5% resolution fee
              from the disputed funds.
            </AlertDescription>
          </Alert>

          {arbitratorMode === 'custom' && (
            <Input
              name="resolverAddress"
              tooltip="This arbitrator will be used in case of dispute."
              label="Arbitration Provider Address"
              placeholder="0x..."
              localForm={localForm}
            />
          )}
        </Stack>

        <Grid templateColumns="1fr" gap="1rem" w="100%" marginTop="20px">
          <Button
            type="submit"
            isDisabled={!isValid}
            textTransform="uppercase"
            size={buttonSize}
            fontWeight="bold"
          >
            Next: {ESCROW_STEPS[2].next}
          </Button>
        </Grid>
      </Stack>
    </Box>
  );
}
