
export enum AlertType {
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING',
  NORMAL = 'NORMAL'
}

export enum SoundType {
  SISMO = 'SISMO',
  SUBMARINO = 'SUBMARINO'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER'
}

export interface Transaction {
  id: string;
  date: string;
  concept: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  entity: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'PROCESSED';
}

export interface DailyProjection {
  date: string;
  initialBalance: number;
  incomes: number;
  expenses: number;
  finalBalance: number;
  status: AlertType;
}

export interface EconomicIndicator {
  name: string;
  value: number;
  change: number;
  unit: string;
  icon: string;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: AlertType;
  message: string;
  amount?: number;
  criticalDate?: string;
}
