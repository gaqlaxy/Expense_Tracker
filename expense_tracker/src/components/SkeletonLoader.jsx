export function CardSkeleton() {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function ExpenseItemSkeleton() {
  return (
    <div className="flex justify-between items-center p-3 border rounded-lg animate-pulse">
      <div className="flex-1">
        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="flex items-center gap-2">
          <div className="h-6 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-16"></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}