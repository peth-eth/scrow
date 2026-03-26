export type UseCase = {
  slug: string;
  title: string;
  metaDescription: string;
  heroQuestion: string;
  definition: string;
  howItWorks: { step: string; detail: string }[];
  scenarios: string[];
  ctaText: string;
};

export const USE_CASES: UseCase[] = [
  {
    slug: 'freelancer-payments',
    title: 'Freelancer Payments',
    metaDescription:
      'sCrow locks client funds in a smart contract before work begins. Milestone payments, onchain arbitration, sub-cent fees on Base.',
    heroQuestion:
      'How do freelancers get paid in crypto without getting stiffed?',
    definition:
      "sCrow is a crypto escrow platform that locks client funds in a smart contract before work begins. The freelancer sees the money is there. The client knows it won't release until milestones are hit. If something goes wrong, a third-party arbitrator resolves it onchain. This matters for cross-border work where bank wires cost $30\u201350 per transfer, take 3\u20135 business days, and require both parties to share banking details. With sCrow, a designer in Lagos and a startup in Berlin can escrow USDC on Base with sub-cent transaction fees and settlement in under 2 seconds. The contract generates a downloadable PDF both parties can reference. Platform fee is 1% on release. Arbitration costs 5%, charged only if there\u2019s a dispute.",
    howItWorks: [
      {
        step: 'Agree on scope and milestones',
        detail:
          'Client and freelancer define deliverables, payment amounts per milestone, and pick an arbitrator both trust.',
      },
      {
        step: 'Client deposits into escrow',
        detail:
          'The full project amount goes into a smart contract on Base. Funds are visible onchain but untouchable.',
      },
      {
        step: 'Deliver and release per milestone',
        detail:
          'After each deliverable, the client releases that milestone\u2019s payment. The freelancer gets paid immediately.',
      },
      {
        step: 'Dispute if needed',
        detail:
          'If either side disagrees, the arbitrator reviews and splits the funds. Settled onchain, not in court.',
      },
    ],
    scenarios: [
      'A developer building a website for a client they met online',
      'A translator handling a batch of documents for a company overseas',
      'A video editor working with a YouTuber in a different country',
      'Any freelancer tired of \"the check is in the mail\"',
    ],
    ctaText: 'Escrow your next freelance gig',
  },
  {
    slug: 'otc-trades',
    title: 'OTC Crypto Trades',
    metaDescription:
      'Safe OTC crypto trades without a middleman. sCrow escrows funds in a smart contract so neither party has to send first.',
    heroQuestion: 'How do you do a safe OTC crypto trade without a middleman?',
    definition:
      'Over-the-counter crypto trades happen when two people agree to swap tokens at a set price outside of an exchange. The problem: someone has to send first. Discord DMs, Telegram groups, and crypto Twitter are full of OTC scam stories where one party sends and the other disappears. sCrow removes that risk. Both parties create an escrow contract specifying the amount and token. The buyer deposits funds. Once the seller confirms delivery (or the buyer verifies receipt), funds release. If either side doesn\u2019t deliver, an arbitrator steps in. This works for any ERC-20 token on Base. Skip KYC, exchange fees, and withdrawal limits. Two wallets, a smart contract, and an optional arbitrator. Platform fee: 1% on release.',
    howItWorks: [
      {
        step: 'Agree on price and terms',
        detail:
          'Buyer and seller set the token, amount, and rate. Both pick an arbitrator.',
      },
      {
        step: 'Buyer deposits into escrow',
        detail:
          'USDC, ETH, or any ERC-20 goes into the smart contract. Seller can verify the deposit onchain.',
      },
      {
        step: 'Seller delivers',
        detail:
          'Seller sends the agreed tokens to the buyer\u2019s wallet. Buyer confirms receipt.',
      },
      {
        step: 'Funds release',
        detail:
          'Buyer releases escrow to the seller. If there\u2019s a disagreement, the arbitrator decides.',
      },
    ],
    scenarios: [
      'Buying tokens at a discount from a large holder',
      'Swapping tokens that aren\u2019t listed on major exchanges',
      'Selling a large position without moving the market price',
      'Any trade where you don\u2019t want to trust a stranger\u2019s DM promise',
    ],
    ctaText: 'Escrow your next OTC trade',
  },
  {
    slug: 'bounties',
    title: 'Bounties & Contests',
    metaDescription:
      'Run crypto bounties that actually pay out. sCrow locks the reward upfront so contributors can verify funds before doing work.',
    heroQuestion: 'How do you run a crypto bounty that actually pays out?',
    definition:
      'Bug bounties, design contests, and open-source contributions share the same trust problem: contributors do the work, then hope the poster pays. sCrow puts the money up front. The bounty poster deposits the reward into an escrow contract before anyone starts working. Contributors can verify the funds are locked onchain. When a submission is accepted, the poster releases the escrowed funds to the winner\u2019s wallet. If the poster ghosts or disputes quality, an arbitrator reviews the work and decides. This applies to security researchers submitting vulnerability reports, designers competing in logo contests, or developers building features. The funds sit in a smart contract on Base, not in someone\u2019s wallet where they can be spent on something else. 1% platform fee on release.',
    howItWorks: [
      {
        step: 'Post the bounty and deposit the reward',
        detail:
          'Describe the task, set the reward amount, and deposit into escrow. Share the contract link publicly.',
      },
      {
        step: 'Contributors verify and work',
        detail:
          'Anyone can check onchain that the funds are locked. They submit their work knowing the money is there.',
      },
      {
        step: 'Accept and release',
        detail:
          'The poster reviews submissions and releases the reward to the winner.',
      },
      {
        step: 'Arbitrate if contested',
        detail:
          'If the poster rejects a valid submission, the contributor can trigger arbitration.',
      },
    ],
    scenarios: [
      'A security bounty for finding vulnerabilities in a smart contract',
      'A design contest for a new brand identity',
      'An open-source feature bounty on GitHub',
      'A data labeling task with verified payout',
    ],
    ctaText: 'Post a bounty with guaranteed payout',
  },
  {
    slug: 'agent-payments',
    title: 'AI Agent Payments',
    metaDescription:
      'Crypto escrow for AI agents. sCrow gives agents a programmable payment primitive with milestone tracking and arbitration on Base.',
    heroQuestion: 'How do AI agents pay for services using crypto escrow?',
    definition:
      'AI agents increasingly need to pay for things: API calls, compute time, data sets, or human labor. But agents can\u2019t sign legal contracts or chase down unpaid invoices. sCrow gives agents a programmable escrow primitive. An agent creates a contract by navigating to /create with query parameters \u2014 client address, amount, and token. Funds lock in a smart contract. When the service is delivered, the agent or its operator releases payment. sCrow\u2019s contracts are readable by any software that can query Base. The subgraph indexes every contract\u2019s state, so agents can look up balances, milestone status, and dispute history through standard GraphQL. Reading is free and permissionless. Contract creation requires a wallet transaction on Base. This is the payment layer for autonomous software \u2014 code paying code, with a human arbitrator as the fallback.',
    howItWorks: [
      {
        step: 'Agent creates a contract via URL',
        detail:
          'Pass ?client=0x...&amount=500&token=USDC to /create. The form pre-fills. Operator signs the transaction.',
      },
      {
        step: 'Funds lock onchain',
        detail:
          'The service provider (human or agent) can verify the deposit via the subgraph or directly onchain.',
      },
      {
        step: 'Service delivered, payment released',
        detail:
          'The agent\u2019s operator releases funds per milestone. Or an automated script triggers release on delivery confirmation.',
      },
      {
        step: 'Dispute resolution',
        detail:
          'If the agent\u2019s operator and the provider disagree, a human arbitrator resolves it.',
      },
    ],
    scenarios: [
      'An AI agent hiring a human to label training data',
      'Two agents settling a compute-for-data exchange',
      'An autonomous trading bot paying for premium market data',
      'A coding agent paying a security auditor to review its output',
    ],
    ctaText: 'Set up agent payments',
  },
  {
    slug: 'p2p-sales',
    title: 'Peer-to-Peer Sales',
    metaDescription:
      'Safely buy or sell anything to a stranger with crypto escrow. Buyer deposits, seller delivers, funds release on confirmation.',
    heroQuestion:
      'How do you safely buy or sell something to a stranger with crypto?',
    definition:
      'Selling a laptop on a forum. Buying concert tickets from someone on Reddit. Trading a gaming account. Every peer-to-peer sale between strangers has the same question: who sends first? With sCrow, the buyer deposits the agreed amount into escrow. The seller ships the item or delivers the service. The buyer confirms receipt and funds release to the seller. If the item never arrives or doesn\u2019t match the description, an arbitrator decides who gets the money. This isn\u2019t limited to physical goods. It works for any transaction where two people who don\u2019t know each other need someone neutral holding the money until both sides are satisfied. The arbitrator can be anyone both parties agree on: a mutual friend, a professional service, or a community moderator. All on Base, settled in seconds.',
    howItWorks: [
      {
        step: 'Agree on the sale and arbitrator',
        detail:
          'Buyer and seller set the price, describe the item in the contract, and choose a trusted arbitrator.',
      },
      {
        step: 'Buyer deposits into escrow',
        detail:
          'Funds lock in the smart contract. Seller can verify the deposit before shipping.',
      },
      {
        step: 'Seller delivers',
        detail:
          'Ship the item, transfer the account, or provide the service. Share proof with the buyer.',
      },
      {
        step: 'Confirm and release',
        detail:
          'Buyer confirms receipt. Funds release. If there\u2019s a problem, the arbitrator steps in.',
      },
    ],
    scenarios: [
      'Buying used electronics from a stranger online',
      'Selling event tickets to someone you don\u2019t know',
      'Trading gaming accounts or in-game items',
      'Any Craigslist-style transaction where trust is zero',
    ],
    ctaText: 'Escrow your next sale',
  },
  {
    slug: 'art-commissions',
    title: 'Art & Creative Commissions',
    metaDescription:
      'Escrow payments for art commissions with milestones. Pay per phase: sketch, draft, final. Artist sees the funds. Client only pays for approved work.',
    heroQuestion: 'How do you escrow payments for commissioned artwork?',
    definition:
      'Art commissions (digital illustrations, music production, video editing, 3D modeling) follow a predictable pattern: client pays upfront, artist delivers weeks later, and one side ends up unhappy. sCrow adds milestones. A portrait commission might split into three payments: sketch approval, color draft, and final delivery. The client deposits the full amount upfront into escrow. After each milestone, the client releases that portion to the artist. The artist always knows the money exists. The client only pays for approved work. If the artist disappears after the sketch phase, the remaining funds stay locked until the client withdraws after the safety valve date. This works for any creative work where delivery happens in phases and both parties want protection.',
    howItWorks: [
      {
        step: 'Define milestones and deposit',
        detail:
          'Client and artist agree on phases (e.g., sketch, draft, final). Client deposits the total into escrow.',
      },
      {
        step: 'Artist delivers phase by phase',
        detail:
          'After completing each milestone, the artist shares the work for review.',
      },
      {
        step: 'Client releases per milestone',
        detail:
          'Approved? Release that milestone\u2019s payment. Not satisfied? Discuss revisions or escalate to arbitration.',
      },
      {
        step: 'Safety valve protection',
        detail:
          'If the project stalls, the client can withdraw remaining funds after the deadline passes.',
      },
    ],
    scenarios: [
      'Commissioning a custom illustration or character design',
      'Hiring a musician to produce a track',
      'Paying a video editor for a multi-revision project',
      'Any creative work where deliverables come in stages',
    ],
    ctaText: 'Set up milestone payments for your commission',
  },
  {
    slug: 'digital-asset-sales',
    title: 'Domain & Digital Asset Sales',
    metaDescription:
      'Safely buy domains, accounts, and digital goods with crypto escrow. sCrow holds funds until ownership transfers and the buyer verifies.',
    heroQuestion:
      'How do you safely buy a domain name or digital account with crypto?',
    definition:
      'Domain names, social media accounts, SaaS subscriptions, game accounts, software licenses. These change hands constantly, and fraud is common. The seller shows a screenshot, the buyer sends crypto, and the credentials never arrive. sCrow puts escrow between the two parties. Buyer deposits funds into the contract. Seller transfers the asset. Buyer confirms the transfer worked \u2014 logged in, verified ownership, DNS propagated. Funds release. If the seller provides dead credentials or the domain has hidden liens, the arbitrator rules in the buyer\u2019s favor. The contract\u2019s description field can specify exactly what\u2019s being sold: \"domain.com including registrar access, DNS records, and email forwarding config.\" Both parties agree on the same terms before any money moves.',
    howItWorks: [
      {
        step: 'List the asset and terms',
        detail:
          'Seller specifies what\u2019s included (credentials, DNS, associated accounts). Buyer reviews.',
      },
      {
        step: 'Buyer deposits',
        detail:
          'Agreed price goes into escrow. Seller sees the funds are locked.',
      },
      {
        step: 'Seller transfers the asset',
        detail:
          'Hand over credentials, push the domain transfer, or reassign the account.',
      },
      {
        step: 'Buyer verifies and releases',
        detail:
          'Buyer confirms everything works. Releases funds. Disputes go to the arbitrator.',
      },
    ],
    scenarios: [
      'Buying a premium domain name from an individual seller',
      'Purchasing a social media account with an established following',
      'Transferring a SaaS subscription or software license',
      'Any digital property sale where \"send first\" is the sticking point',
    ],
    ctaText: 'Escrow your digital asset purchase',
  },
  {
    slug: 'wager-settlement',
    title: 'Wager & Bet Settlement',
    metaDescription:
      'Settle bets with crypto escrow. Both parties deposit, an agreed arbitrator calls the winner, funds release. No bookmaker, 1% fee.',
    heroQuestion: 'How do you settle a bet with crypto escrow?',
    definition:
      'Two friends bet on the Super Bowl. A poker group needs a side pot. Someone on Twitter wants to put money behind their prediction. The common thread: both parties need to deposit money upfront, and someone neutral needs to call the winner. sCrow handles this. Both parties deposit their wager into the same escrow contract. They agree on an arbitrator before the event \u2014 a trusted friend, a sports data provider, or any wallet address both sides accept. After the event, the arbitrator releases all funds to the winner. If the arbitrator goes silent past the safety valve date, depositors can withdraw their own funds. No bookmaker margin. The only fee is 1% on the release. Two wallets, one contract, one call.',
    howItWorks: [
      {
        step: 'Set the terms and arbitrator',
        detail:
          'Both parties agree on the bet, the amount, and who will decide the outcome.',
      },
      {
        step: 'Both sides deposit',
        detail:
          'Each party deposits their wager into the same escrow contract.',
      },
      {
        step: 'Event happens',
        detail:
          'Wait for the game, the election, the market close \u2014 whatever was bet on.',
      },
      {
        step: 'Arbitrator releases to the winner',
        detail:
          'The agreed arbitrator sends all funds to the winning party. Safety valve protects against inactive arbitrators.',
      },
    ],
    scenarios: [
      'A sports bet between friends with real stakes',
      'A prediction market position settled by a trusted data source',
      'A public Twitter bet where both sides actually put up money',
      'Any wager where \"I\u2019ll pay you later\" isn\u2019t good enough',
    ],
    ctaText: 'Put your money where your mouth is',
  },
];

export function getUseCaseBySlug(slug: string): UseCase | undefined {
  return USE_CASES.find(uc => uc.slug === slug);
}

export function getAllUseCaseSlugs(): string[] {
  return USE_CASES.map(uc => uc.slug);
}
