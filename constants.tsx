
import { EconomicIndicator, Transaction } from './types';

export const INITIAL_BALANCE = 25000000;
export const MIN_OPERATIVE_BALANCE = 5000000;

export const MOCK_INDICATORS: EconomicIndicator[] = [
  { name: 'UF', value: 38120.45, change: 0.05, unit: 'CLP', icon: 'fa-landmark' },
  { name: 'Dólar', value: 945.20, change: -1.2, unit: 'CLP', icon: 'fa-dollar-sign' },
  { name: 'Euro', value: 1022.15, change: 0.8, unit: 'CLP', icon: 'fa-euro-sign' },
  { name: 'IPC', value: 3.8, change: -0.2, unit: '%', icon: 'fa-chart-line' },
  { name: 'UTM', value: 66120.00, change: 0.1, unit: 'CLP', icon: 'fa-stamp' },
  { name: 'Tasa Ref.', value: 5.25, change: -0.50, unit: '%', icon: 'fa-percent' },
];

const generateHistory = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const start = new Date('2025-01-01');
  const end = new Date('2026-02-04');
  let current = new Date(start);

  let id = 1;
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    const day = current.getDate();

    // Monthly fixed expenses
    if (day === 1) {
      transactions.push({
        id: (id++).toString(),
        date: dateStr,
        concept: 'Arriendo Oficina Central',
        amount: 4500000,
        type: 'EXPENSE',
        entity: 'Inmobiliaria Delta',
        status: 'COMPLETED'
      });
    }

    if (day === 5) {
      transactions.push({
        id: (id++).toString(),
        date: dateStr,
        concept: 'Pago Honorarios Staff',
        amount: 12000000,
        type: 'EXPENSE',
        entity: 'Nómina General',
        status: 'COMPLETED'
      });
    }

    // Weekly income patterns
    if (current.getDay() === 1 || current.getDay() === 4) {
      transactions.push({
        id: (id++).toString(),
        date: dateStr,
        concept: `Ingreso Ventas Retail ID-${id}`,
        amount: 5000000 + Math.random() * 3000000,
        type: 'INCOME',
        entity: 'Clientes Directos',
        status: current < new Date() ? 'COMPLETED' : 'PENDING'
      });
    }

    // Corporate spikes
    if (day === 15 || day === 28) {
      transactions.push({
        id: (id++).toString(),
        date: dateStr,
        concept: 'Cobro Servicios Consultoría',
        amount: 15000000,
        type: 'INCOME',
        entity: 'Cliente Corporativo VIP',
        status: current < new Date() ? 'COMPLETED' : 'PENDING'
      });
    }

    current.setDate(current.getDate() + 1);
  }
  return transactions;
};

export const MOCK_TRANSACTIONS: Transaction[] = generateHistory();
