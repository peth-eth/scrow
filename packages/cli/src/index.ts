#!/usr/bin/env node
import { Command } from 'commander';

import { createContract } from './commands/create.js';
import { depositFunds } from './commands/deposit.js';
import { releaseContract } from './commands/release.js';
import { listContracts, showStatus } from './commands/status.js';

const program = new Command();

program
  .name('scrow')
  .description('sCrow — crypto escrow contracts on Base')
  .version('0.1.0');

program
  .command('create')
  .description('Create a new escrow contract')
  .requiredOption('--client <address>', 'Client wallet address')
  .requiredOption('--provider <address>', 'Provider wallet address')
  .requiredOption('--token <symbol>', 'Payment token (USDC, USDT, DAI, WETH)')
  .requiredOption(
    '--milestones <amounts>',
    'Comma-separated milestone amounts (e.g. 500,300,200)',
  )
  .requiredOption('--title <title>', 'Contract title')
  .option('--description <desc>', 'Contract description')
  .option('--resolver <address>', 'Arbitrator address (default: sCrow)')
  .option('--safety-days <days>', 'Days until safety valve withdrawal', '30')
  .action(createContract);

program
  .command('release')
  .description('Release a milestone payment')
  .requiredOption('--contract <address>', 'Escrow contract address')
  .option('--milestone <index>', 'Milestone index (0-based, default: current)')
  .action(releaseContract);

program
  .command('deposit')
  .description('Deposit funds into an escrow contract')
  .requiredOption('--contract <address>', 'Escrow contract address')
  .requiredOption('--amount <amount>', 'Amount to deposit')
  .requiredOption('--token <symbol>', 'Token (ETH, USDC, USDT, DAI, WETH)')
  .action(depositFunds);

program
  .command('status')
  .description('View escrow contract details')
  .argument('<address>', 'Contract address')
  .action(showStatus);

program
  .command('list')
  .description('List contracts for a wallet address')
  .argument('<address>', 'Wallet address')
  .action(listContracts);

program.parse();
