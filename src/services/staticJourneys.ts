import { Stage } from '../types';

export const fashionStages: Stage[] = [
  {
    id: 1, name: 'Trend Analysis & Niche', type: 'normal', phase: 'Idea',
    objective: 'Identify your fashion niche and target audience',
    tasks: ['Research current trends', 'Define target demographic', 'Create mood boards'],
    realWorldResources: [
      { title: 'WGSN', description: 'Trend forecasting', link: 'https://www.wgsn.com' }
    ],
    simulation: {
      scenario: 'A major trend is emerging, but it contradicts your initial vision. What do you do?',
      options: [
        { text: 'Pivot completely to the new trend', impact: { budget: -500, trust: 10, impact: 15 }, feedback: 'You caught the wave, but it cost time to pivot.' },
        { text: 'Blend the trend with your vision', impact: { budget: -200, trust: 20, impact: 25 }, feedback: 'A great compromise! You stayed true while being relevant.' },
        { text: 'Ignore the trend', impact: { budget: 0, trust: -10, impact: -5 }, feedback: 'You saved money, but investors are questioning your market awareness.' }
      ]
    },
    realWorldCostEstimate: '$500', simulationCost: 500
  },
  {
    id: 2, name: 'Elevator Pitch', type: 'pitch', phase: 'Idea',
    objective: 'Pitch your brand to an angel investor',
    tasks: ['Draft pitch', 'Practice delivery', 'Refine value prop'],
    realWorldResources: [],
    simulation: { scenario: 'Mock Pitch', options: [] },
    realWorldCostEstimate: '$0', simulationCost: 0
  },
  {
    id: 3, name: 'Sourcing Materials', type: 'normal', phase: 'Resources',
    objective: 'Find reliable fabric suppliers',
    tasks: ['Contact suppliers', 'Order swatches', 'Test durability'],
    realWorldResources: [],
    simulation: {
      scenario: 'Your preferred eco-friendly fabric is delayed by 3 months.',
      options: [
        { text: 'Wait for it', impact: { budget: -1000, trust: 10, impact: -10 }, feedback: 'Delayed launch, but kept your promise.' },
        { text: 'Use standard fabric', impact: { budget: 500, trust: -20, impact: 10 }, feedback: 'Cheaper, but hurts brand identity.' },
        { text: 'Find a local alternative', impact: { budget: -500, trust: 15, impact: 20 }, feedback: 'Costly but great for your brand story.' }
      ]
    },
    realWorldCostEstimate: '$2000', simulationCost: 2000
  },
  {
    id: 4, name: 'Pre-seed Pitch Deck', type: 'ppt-pitch', phase: 'Investors',
    objective: 'Present your pitch deck',
    tasks: ['Design deck', 'Financial modeling', 'Rehearse'],
    realWorldResources: [],
    simulation: { scenario: 'Pitch', options: [] },
    realWorldCostEstimate: '$500', simulationCost: 500
  },
  {
    id: 5, name: 'First Production Run', type: 'crisis', phase: 'Resources',
    objective: 'Manage the first manufacturing order',
    tasks: ['Finalize tech packs', 'Pay deposit', 'Quality control check'],
    realWorldResources: [],
    simulation: {
      scenario: 'The factory messed up the sizing on 30% of your first batch.',
      options: [
        { text: 'Sell them as irregulars', impact: { budget: 1000, trust: -15, impact: 5 }, feedback: 'Recouped cash but hurt reputation.' },
        { text: 'Remake the batch', impact: { budget: -3000, trust: 10, impact: 10 }, feedback: 'Expensive, but ensures quality.' },
        { text: 'Donate them for PR', impact: { budget: -1000, trust: 25, impact: 20 }, feedback: 'Lost money but gained massive goodwill.' }
      ]
    },
    realWorldCostEstimate: '$5000', simulationCost: 5000
  },
  {
    id: 6, name: 'Influencer Marketing', type: 'normal', phase: 'Growth',
    objective: 'Launch marketing campaign',
    tasks: ['Identify influencers', 'Send PR packages', 'Track ROI'],
    realWorldResources: [],
    simulation: {
      scenario: 'A major influencer wants $5000 for a single post.',
      options: [
        { text: 'Pay them', impact: { budget: -5000, trust: 10, impact: 30 }, feedback: 'High risk, high reward. It drove traffic.' },
        { text: 'Negotiate for affiliate %', impact: { budget: -500, trust: 15, impact: 20 }, feedback: 'Smart negotiation. Lower risk.' },
        { text: 'Focus on micro-influencers', impact: { budget: -1000, trust: 20, impact: 25 }, feedback: 'Great organic grassroots growth.' }
      ]
    },
    realWorldCostEstimate: '$2000', simulationCost: 2000
  },
  {
    id: 7, name: 'Growth Pitch', type: 'pitch', phase: 'Growth',
    objective: 'Pitch for a bridge round',
    tasks: ['Update metrics', 'Prepare answers', 'Pitch'],
    realWorldResources: [],
    simulation: { scenario: 'Pitch', options: [] },
    realWorldCostEstimate: '$0', simulationCost: 0
  },
  {
    id: 8, name: 'Demo Day Video', type: 'video-pitch', phase: 'Investors',
    objective: 'Record a video pitch for a major accelerator',
    tasks: ['Script video', 'Record', 'Edit'],
    realWorldResources: [],
    simulation: { scenario: 'Pitch', options: [] },
    realWorldCostEstimate: '$0', simulationCost: 0
  },
  {
    id: 9, name: 'Retail Distribution', type: 'normal', phase: 'Scale',
    objective: 'Get your clothes into physical stores',
    tasks: ['Pitch buyers', 'Fulfill wholesale', 'Merchandising'],
    realWorldResources: [],
    simulation: {
      scenario: 'A big retailer wants exclusives but demands a 60% margin.',
      options: [
        { text: 'Accept for the volume', impact: { budget: 5000, trust: 20, impact: 30 }, feedback: 'Huge volume but tight margins.' },
        { text: 'Counter with 50%', impact: { budget: 2000, trust: 10, impact: 15 }, feedback: 'They accepted a smaller pilot.' },
        { text: 'Walk away, focus on DTC', impact: { budget: -1000, trust: 15, impact: 10 }, feedback: 'Kept your margins but missed brand exposure.' }
      ]
    },
    realWorldCostEstimate: '$5000', simulationCost: 5000
  },
  {
    id: 10, name: 'Series A Raise', type: 'normal', phase: 'Scale',
    objective: 'Finalize your Series A funding',
    tasks: ['Due diligence', 'Term sheet negotiation', 'Close round'],
    realWorldResources: [],
    simulation: {
      scenario: 'Two term sheets: One with high valuation but bad terms, one lower valuation but great partners.',
      options: [
        { text: 'Take the money (High Val)', impact: { budget: 20000, trust: -10, impact: 20 }, feedback: 'You have cash, but the board is tough.' },
        { text: 'Take the partners (Low Val)', impact: { budget: 10000, trust: 30, impact: 25 }, feedback: 'Less dilution, great mentorship. Smart play.' },
        { text: 'Pit them against each other', impact: { budget: 15000, trust: 10, impact: 30 }, feedback: 'Risky, but you got the best of both.' }
      ]
    },
    realWorldCostEstimate: '$10000', simulationCost: 10000
  }
];

export const foodStages: Stage[] = [
  {
    id: 1, name: 'Recipe Development', type: 'normal', phase: 'Idea',
    objective: 'Finalize your core food product/menu',
    tasks: ['Taste testing', 'Cost out ingredients', 'Shelf-life testing'],
    realWorldResources: [],
    simulation: {
      scenario: 'Your signature dish tastes great but the ingredients are too expensive.',
      options: [
        { text: 'Raise the price', impact: { budget: 0, trust: -5, impact: 10 }, feedback: 'Priced out some customers, but kept quality.' },
        { text: 'Substitute ingredients', impact: { budget: 500, trust: -15, impact: -5 }, feedback: 'Quality dropped. People noticed.' },
        { text: 'Loss leader strategy', impact: { budget: -1000, trust: 25, impact: 20 }, feedback: 'Takes a loss, but builds a loyal base.' }
      ]
    },
    realWorldCostEstimate: '$1000', simulationCost: 1000
  },
  {
    id: 2, name: 'Pitch to Co-founder', type: 'pitch', phase: 'Idea',
    objective: 'Convince a chef/ops expert to join you',
    tasks: ['Draft pitch', 'Define equity', 'Present'],
    realWorldResources: [],
    simulation: { scenario: 'Pitch', options: [] },
    realWorldCostEstimate: '$0', simulationCost: 0
  },
  {
    id: 3, name: 'Commercial Kitchen', type: 'crisis', phase: 'Resources',
    objective: 'Secure facility to produce food at scale',
    tasks: ['Tour kitchens', 'Sign lease', 'Health inspection'],
    realWorldResources: [],
    simulation: {
      scenario: 'The health inspector found an issue with your rented kitchen plumbing. Launch is halted.',
      options: [
        { text: 'Pay to fix it yourself', impact: { budget: -2000, trust: 10, impact: 5 }, feedback: 'Costly, but you passed the re-inspection quickly.' },
        { text: 'Fight the landlord', impact: { budget: -500, trust: -10, impact: -15 }, feedback: 'Landlord dragged it out. Missed your launch date.' },
        { text: 'Find a new kitchen', impact: { budget: -1500, trust: 5, impact: 10 }, feedback: 'Stressful transition, but better long-term.' }
      ]
    },
    realWorldCostEstimate: '$3000', simulationCost: 3000
  },
  {
    id: 4, name: 'Seed Deck', type: 'ppt-pitch', phase: 'Investors',
    objective: 'Present your deck to early stage investors',
    tasks: ['Design deck', 'Highlight unit economics', 'Rehearse'],
    realWorldResources: [],
    simulation: { scenario: 'Pitch', options: [] },
    realWorldCostEstimate: '$500', simulationCost: 500
  },
  {
    id: 5, name: 'Packaging & Logistics', type: 'normal', phase: 'Resources',
    objective: 'Figure out how to deliver the food fresh',
    tasks: ['Design packaging', 'Test cold chain', 'Negotiate shipping'],
    realWorldResources: [],
    simulation: {
      scenario: 'Eco-friendly packaging costs 3x more than plastic.',
      options: [
        { text: 'Commit to Eco-friendly', impact: { budget: -2000, trust: 30, impact: 20 }, feedback: 'Brand stands out. Customers love the mission.' },
        { text: 'Use cheaper plastic', impact: { budget: 1000, trust: -20, impact: -5 }, feedback: 'Saved money, but faced backlash online.' },
        { text: 'Hybrid approach', impact: { budget: -500, trust: 10, impact: 10 }, feedback: 'A balanced approach. Sensible.' }
      ]
    },
    realWorldCostEstimate: '$2500', simulationCost: 2500
  },
  {
    id: 6, name: 'Farmer Market / Pop-up', type: 'normal', phase: 'Growth',
    objective: 'Test the market in person',
    tasks: ['Get permits', 'Build booth', 'Sell directly'],
    realWorldResources: [],
    simulation: {
      scenario: 'You have a huge line but run out of food halfway through the day.',
      options: [
        { text: 'Take pre-orders for next week', impact: { budget: 500, trust: 20, impact: 15 }, feedback: 'Captured the hype effectively!' },
        { text: 'Close up shop early', impact: { budget: 0, trust: -5, impact: 5 }, feedback: 'Disappointed some, but created scarcity hype.' },
        { text: 'Rush to make more food', impact: { budget: -500, trust: -10, impact: -10 }, feedback: 'Rushed quality was poor. Bad reviews.' }
      ]
    },
    realWorldCostEstimate: '$1000', simulationCost: 1000
  },
  {
    id: 7, name: 'Expansion Pitch', type: 'pitch', phase: 'Growth',
    objective: 'Pitch local grocery buyers',
    tasks: ['Prepare samples', 'Calculate wholesale prices', 'Pitch'],
    realWorldResources: [],
    simulation: { scenario: 'Pitch', options: [] },
    realWorldCostEstimate: '$0', simulationCost: 0
  },
  {
    id: 8, name: 'Food Network Video', type: 'video-pitch', phase: 'Investors',
    objective: 'Pitch on a virtual accelerator / Shark Tank style show',
    tasks: ['Script video', 'Record cooking demo', 'Edit'],
    realWorldResources: [],
    simulation: { scenario: 'Pitch', options: [] },
    realWorldCostEstimate: '$0', simulationCost: 0
  },
  {
    id: 9, name: 'Scaling Production', type: 'normal', phase: 'Scale',
    objective: 'Move to a co-manufacturer',
    tasks: ['Find co-man', 'Transfer recipe', 'QA runs'],
    realWorldResources: [],
    simulation: {
      scenario: 'The co-man demands a massive Minimum Order Quantity (MOQ).',
      options: [
        { text: 'Take a loan to meet MOQ', impact: { budget: 10000, trust: -10, impact: 20 }, feedback: 'Risky debt, but you hit scale.' },
        { text: 'Negotiate higher price, lower MOQ', impact: { budget: -2000, trust: 15, impact: 10 }, feedback: 'Safer on cash flow. Good strategy.' },
        { text: 'Crowdfund the order', impact: { budget: 5000, trust: 25, impact: 30 }, feedback: 'Turned a risk into a massive marketing win!' }
      ]
    },
    realWorldCostEstimate: '$15000', simulationCost: 15000
  },
  {
    id: 10, name: 'National Distribution', type: 'normal', phase: 'Scale',
    objective: 'Launch nationwide in major retail',
    tasks: ['Sign distributor', 'Marketing blitz', 'Fulfillment'],
    realWorldResources: [],
    simulation: {
      scenario: 'A major distributor drops you right before launch.',
      options: [
        { text: 'Go Direct-to-Consumer eagerly', impact: { budget: -5000, trust: 25, impact: 35 }, feedback: 'Pivot was hard but highly profitable.' },
        { text: 'Beg them back with better terms', impact: { budget: -5000, trust: -15, impact: 10 }, feedback: 'Lost margin and leverage.' },
        { text: 'Find regional distributors', impact: { budget: -2000, trust: 10, impact: 15 }, feedback: 'Slower rollout, but stable.' }
      ]
    },
    realWorldCostEstimate: '$20000', simulationCost: 20000
  }
];