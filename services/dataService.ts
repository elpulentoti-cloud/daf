
import { Transaction, DailyProjection, AlertType, Alert } from '../types';
// Fixed: INITIAL_BALANCE and MIN_OPERATIVE_BALANCE are exported from constants, not types
import { INITIAL_BALANCE, MIN_OPERATIVE_BALANCE } from '../constants';

export const calculateProjections = (
  transactions: Transaction[], 
  days: number = 30,
  startBalance: number = INITIAL_BALANCE
): DailyProjection[] => {
  const projections: DailyProjection[] = [];
  let currentBalance = startBalance;
  
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTransactions = transactions.filter(t => t.date === dateStr);
    const incomes = dayTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const expenses = dayTransactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    
    const initialBalance = currentBalance;
    const finalBalance = initialBalance + incomes - expenses;
    
    let status = AlertType.NORMAL;
    if (finalBalance < 0) status = AlertType.CRITICAL;
    else if (finalBalance < MIN_OPERATIVE_BALANCE) status = AlertType.WARNING;
    
    projections.push({
      date: dateStr,
      initialBalance,
      incomes,
      expenses,
      finalBalance,
      status
    });
    
    currentBalance = finalBalance;
  }
  
  return projections;
};

export const detectAlerts = (projections: DailyProjection[]): Alert[] => {
  const alerts: Alert[] = [];
  projections.forEach(p => {
    if (p.status === AlertType.CRITICAL) {
      alerts.push({
        id: `alert-${p.date}-critical`,
        timestamp: new Date().toISOString(),
        type: AlertType.CRITICAL,
        message: `Déficit de caja proyectado para el día ${p.date}`,
        amount: Math.abs(p.finalBalance),
        criticalDate: p.date
      });
    } else if (p.status === AlertType.WARNING) {
      alerts.push({
        id: `alert-${p.date}-warning`,
        timestamp: new Date().toISOString(),
        type: AlertType.WARNING,
        message: `Saldo bajo el mínimo operativo para el día ${p.date}`,
        amount: p.finalBalance,
        criticalDate: p.date
      });
    }
  });
  return alerts;
};
