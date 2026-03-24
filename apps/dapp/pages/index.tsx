import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ChakraNextLink, Container, useMediaStyles } from '@smartinvoicexyz/ui';
import React from 'react';

const STEPS = [
  {
    number: '1',
    title: 'Create Invoice',
    description:
      'Set milestones, pick an arbitrator, and share with your client.',
  },
  {
    number: '2',
    title: 'Client Deposits',
    description:
      'Funds are locked in escrow until milestones are completed.',
  },
  {
    number: '3',
    title: 'Get Paid',
    description:
      'Release funds as you deliver. Disputes? Your arbitrator has it covered.',
  },
];

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <VStack
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={6}
      spacing={3}
      textAlign="center"
      _hover={{ borderColor: 'blue.1', shadow: 'md' }}
      transition="all 0.2s"
    >
      <Flex
        align="center"
        justify="center"
        bg="blue.1"
        color="white"
        borderRadius="full"
        w="40px"
        h="40px"
        fontSize="lg"
        fontWeight="bold"
        fontFamily="mono"
      >
        {number}
      </Flex>
      <Heading fontSize="lg" color="gray.700">
        {title}
      </Heading>
      <Text fontSize="sm" color="gray.500" lineHeight="tall">
        {description}
      </Text>
    </VStack>
  );
}

function Home() {
  const { primaryButtonSize } = useMediaStyles();

  return (
    <Container overlay>
      <VStack spacing={16} py={12} w="100%" maxW="800px" px={4}>
        {/* Hero */}
        <VStack spacing={4} textAlign="center">
          <Heading
            fontWeight={700}
            fontSize={{ base: '2xl', md: '4xl' }}
            color="gray.700"
            lineHeight="shorter"
          >
            Secure Escrow for Web3 Freelancers
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="gray.500"
            maxW="560px"
          >
            Get paid safely with milestone-based escrow, community arbitration,
            and transparent fees.
          </Text>
        </VStack>

        {/* How It Works */}
        <VStack spacing={6} w="100%">
          <Heading fontSize="xl" color="gray.600" textTransform="uppercase">
            How It Works
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="100%">
            {STEPS.map(step => (
              <StepCard key={step.number} {...step} />
            ))}
          </SimpleGrid>
        </VStack>

        {/* Fee Transparency */}
        <Box
          bg="gray.50"
          borderRadius="lg"
          px={6}
          py={4}
          w="100%"
          textAlign="center"
        >
          <Text fontSize="sm" color="gray.600" fontFamily="mono">
            1% platform fee on releases &middot; 5% arbitration fee only if
            disputed
          </Text>
        </Box>

        {/* CTA Buttons */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          w="100%"
          justify="center"
          align="center"
        >
          <ChakraNextLink href="/create">
            <Button size={primaryButtonSize} minW="250px" paddingY={6}>
              Create Invoice
            </Button>
          </ChakraNextLink>
          <ChakraNextLink href="/invoices">
            <Button
              size={primaryButtonSize}
              minW="250px"
              paddingY={6}
              variant="outline"
            >
              View Existing Invoices
            </Button>
          </ChakraNextLink>
        </Flex>
      </VStack>
    </Container>
  );
}

export default Home;
