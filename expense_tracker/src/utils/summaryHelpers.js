export function getWeekRange(date = new Date()) {
  const current = new Date(date);
  const first = current.getDate() - current.getDay(); // Sunday
  const last = first + 6; // Saturday

  const start = new Date(current.setDate(first));
  const end = new Date(current.setDate(last));
  return [start, end];
}

export function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return [start, end];
}

export function filterExpensesByDateRange(expenses, startDate, endDate) {
  return expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });
}

export function calculateTotal(expenses) {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
}
