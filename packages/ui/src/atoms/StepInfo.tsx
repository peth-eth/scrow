import {
  Box,
  Flex,
  Heading,
  Icon,
  IconButton,
  Spacer,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ESCROW_STEPS } from '@smartinvoicexyz/constants';
import { hashCode } from '@smartinvoicexyz/utils';

import { BackArrowIcon } from '../icons/ArrowIcons';

const TOTAL_STEPS = 5;

function StepCircle({
  step,
  label,
  isCompleted,
  isCurrent,
}: {
  step: number;
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
}) {
  const showLabel = useBreakpointValue({ base: false, md: true });
  const circleSize = useBreakpointValue({ base: '28px', md: '36px' }) ?? '32px';
  const fontSize = useBreakpointValue({ base: 'xs', md: 'sm' }) ?? 'sm';

  let bg = 'gray.200';
  let color = 'gray.500';
  let borderColor = 'gray.200';

  if (isCompleted) {
    bg = 'blue.400';
    color = 'white';
    borderColor = 'blue.400';
  } else if (isCurrent) {
    bg = 'white';
    color = 'blue.400';
    borderColor = 'blue.400';
  }

  return (
    <Flex direction="column" align="center" minW="0">
      <Flex
        align="center"
        justify="center"
        w={circleSize}
        h={circleSize}
        borderRadius="full"
        bg={bg}
        color={color}
        border="2px solid"
        borderColor={borderColor}
        fontWeight="bold"
        fontSize={fontSize}
        flexShrink={0}
      >
        {isCompleted ? '✓' : step}
      </Flex>
      {showLabel && (
        <Text
          fontSize="xs"
          color={isCurrent ? 'blue.500' : isCompleted ? 'blue.400' : 'gray.400'}
          fontWeight={isCurrent ? '600' : '400'}
          mt={1}
          textAlign="center"
          lineHeight="short"
          maxW="80px"
        >
          {label}
        </Text>
      )}
    </Flex>
  );
}

function ConnectorLine({ isCompleted }: { isCompleted: boolean }) {
  return (
    <Box
      flex="1"
      h="2px"
      bg={isCompleted ? 'blue.400' : 'gray.200'}
      alignSelf="flex-start"
      mt={{ base: '13px', md: '17px' }}
      mx={1}
    />
  );
}

export function StepInfo({
  stepNum,
  stepsDetails,
  goBack,
}: {
  stepNum: number;
  stepsDetails: typeof ESCROW_STEPS;
  goBack: (() => void) | undefined;
}) {
  const maxW = useBreakpointValue({ base: '100%' });

  const headingSize = useBreakpointValue({
    base: 'md',
    sm: 'lg',
    md: 'xl',
    lg: 'xl',
  });

  const stepTitle = stepsDetails[stepNum].step_title;
  const stepDetails = stepsDetails[stepNum].step_details;

  const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => ({
    num: i + 1,
    label: stepsDetails[i + 1]?.step_title ?? `Step ${i + 1}`,
  }));

  return (
    <Stack spacing="1rem" maxW={maxW} align="stretch">
      {/* Progress bar */}
      <Flex align="flex-start" w="100%" px={{ base: 0, md: 4 }} pt={2}>
        {steps.map((s, i) => (
          <Flex key={s.num} align="flex-start" flex={i < TOTAL_STEPS - 1 ? 1 : undefined}>
            <StepCircle
              step={s.num}
              label={s.label}
              isCompleted={s.num < stepNum}
              isCurrent={s.num === stepNum}
            />
            {i < TOTAL_STEPS - 1 && (
              <ConnectorLine isCompleted={s.num < stepNum} />
            )}
          </Flex>
        ))}
      </Flex>

      {/* Header with back button and title */}
      <Flex justify="space-between" my={2} align="center">
        {stepNum !== 1 && stepNum !== 5 && !!goBack ? (
          <IconButton
            icon={
              <Icon
                as={BackArrowIcon}
                color="white"
                width="2rem"
                height="1.5rem"
              />
            }
            variant="ghost"
            bg="gray.200"
            p={2}
            onClick={() => goBack()}
            cursor="pointer"
            aria-label="back"
          />
        ) : (
          <Spacer maxW="50px" />
        )}

        <Heading color="#323C47" size={headingSize}>
          Step {stepNum}: {stepTitle}
        </Heading>

        <Spacer maxW="50px" />
      </Flex>

      {/* Step details */}
      {stepDetails.map((detail: string) => (
        <Text color="grey" fontSize="sm" key={hashCode(detail)}>
          {detail}
        </Text>
      ))}
    </Stack>
  );
}
