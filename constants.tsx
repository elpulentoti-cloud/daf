
import { EconomicIndicator, Transaction } from './types.ts';

export const INITIAL_BALANCE = 58240000; 
export const MIN_OPERATIVE_BALANCE = 18000000;

export const MOCK_INDICATORS: EconomicIndicator[] = [
  { name: 'UF', value: 38142.50, change: 0.12, unit: 'CLP', icon: 'fa-landmark' },
  { name: 'Dólar', value: 945.80, change: -0.6, unit: 'CLP', icon: 'fa-dollar-sign' },
  { name: 'Euro', value: 1022.45, change: 0.2, unit: 'CLP', icon: 'fa-euro-sign' },
  { name: 'UTM', value: 66320.00, change: 0.05, unit: 'CLP', icon: 'fa-stamp' },
];

const generateHistory = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const start = new Date('2025-01-01');
  const end = new Date('2026-12-31');
  let current = new Date(start);
  let id = 1;

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    const day = current.getDate();

    // 1. GASTOS CENTRALES GAF (Claudio Gutiérrez)
    if (day === 5) {
      transactions.push({
        id: (id++).toString(),
        date: dateStr,
        concept: 'Nómina Corporativa Edaltec Group',
        amount: 28500000,
        type: 'EXPENSE',
        entity: 'Personal Interno',
        responsible: 'Claudio Gutiérrez',
        status: 'PENDING'
      });
    }

    // 2. RAMA ADMINISTRACIÓN (Manuel Vásquez)
    if (day === 10) {
      // Operador Logístico (Pedro Aravena)
      transactions.push({
        id: (id++).toString(),
        date: dateStr,
        concept: 'Combustible y Mantenimiento Flota',
        amount: 2450000,
        type: 'EXPENSE',
        entity: 'Pedro Aravena (Logística)',
        responsible: 'Manuel Vásquez',
        status: 'PENDING'
      });
      // Bodega (Oscar)
      transactions.push({
        id: (id++).toString(),
        date: dateStr,
        concept: 'Insumos de Bodega y Embalaje',
        amount: 1200000,
        type: 'EXPENSE',
        entity: 'Oscar (Servicios Gral)',
        responsible: 'Manuel Vásquez',
        status: 'PENDING'
      });
      // Limpieza (Elizabeth Bravo)
      transactions.push({
        id: (id++).toString(),
        date: dateStr,
        concept: 'Servicios de Higiene y Mantenimiento',
        amount: 450000,
        type: 'EXPENSE',
        entity: 'Elizabeth Bravo',
        responsible: 'Manuel Vásquez',
        status: 'COMPLETED'
      });
    }

    // 3. RAMA FINANZAS / COMPRAS (Paulina)
    if (day === 15 || day === 30) {
      transactions.push({
        id: (id++).toString(),
        date: dateStr,
        concept: 'Importación de Mercaderías Estratégicas',
        amount: 12800000,
        type: 'EXPENSE',
        entity: 'Proveedores Internacionales',
        responsible: 'Paulina (Compras)',
        status: 'PENDING'
      });
    }

    // 4. SOPORTE ADMINISTRATIVO (Rocío Navarro)
    if (day === 2) {
      transactions.push({
        id: (id++).toString(),
        date: dateStr,
        concept: 'Suministros Oficina y Papelería',
        amount: 320000,
        type: 'EXPENSE',
        entity: 'Rocío Navarro',
        responsible: 'Rocío Navarro',
        status: 'COMPLETED'
      });
    }

    // 5. INGRESOS POR FACTURACIÓN (Pedro Aravena / Logística)
    if (current.getDay() === 1 || current.getDay() === 4) {
      transactions.push({
        id: (id++).toString(),
        date: dateStr,
        concept: 'Cobranza Servicios Logísticos',
        amount: 6000000 + Math.random() * 8000000,
        type: 'INCOME',
        entity: 'Clientes Corporativos',
        responsible: 'Pedro Aravena',
        status: current < new Date() ? 'COMPLETED' : 'PENDING'
      });
    }

    current.setDate(current.getDate() + 1);
  }
  return transactions;
};

export const MOCK_TRANSACTIONS: Transaction[] = generateHistory();
