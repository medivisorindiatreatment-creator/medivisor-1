"use client"

const StatBox = ({ value, label, showPlus = true }: { value: string | number, label: string, showPlus?: boolean }) => (
  <div className='text-center flex flex-col items-center justify-center px-1 py-1.5 bg-gray-50 rounded-xs border border-gray-100'>
    <p className="text-sm font-medium text-gray-800 leading-tight">
      {value}
      {value !== 'N/A' && showPlus && '+'}
    </p>
    <p className="text-sm font-medium text-gray-800 leading-tight">
      {label}
    </p>
  </div>
)

export default StatBox