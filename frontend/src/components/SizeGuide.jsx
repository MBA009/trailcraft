import React from 'react'

const sizes = [
  { us: '6',    eu: '39',   cm: '24.0', inches: '9.4"' },
  { us: '6.5',  eu: '39.5', cm: '24.5', inches: '9.6"' },
  { us: '7',    eu: '40',   cm: '25.0', inches: '9.8"' },
  { us: '7.5',  eu: '40.5', cm: '25.4', inches: '10.0"' },
  { us: '8',    eu: '41',   cm: '25.9', inches: '10.2"' },
  { us: '8.5',  eu: '42',   cm: '26.4', inches: '10.4"' },
  { us: '9',    eu: '42.5', cm: '26.9', inches: '10.6"' },
  { us: '9.5',  eu: '43',   cm: '27.3', inches: '10.7"' },
  { us: '10',   eu: '44',   cm: '27.8', inches: '10.9"' },
  { us: '10.5', eu: '44.5', cm: '28.3', inches: '11.1"' },
  { us: '11',   eu: '45',   cm: '28.8', inches: '11.3"' },
  { us: '11.5', eu: '45.5', cm: '29.2', inches: '11.5"' },
  { us: '12',   eu: '46',   cm: '29.7', inches: '11.7"' },
  { us: '13',   eu: '47',   cm: '30.7', inches: '12.1"' },
]

export default function SizeGuide({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 flex-shrink-0" />
        <div className="p-5 sm:p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900">Size Guide</h2>
              <p className="text-sm text-gray-400 mt-0.5">Toe-to-heel foot length</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="mb-4 p-3 bg-orange-50 border border-orange-100 rounded-xl text-xs text-orange-700">
            <strong>How to measure:</strong> Stand on a piece of paper, trace your foot, and measure from the longest toe to the heel.
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm min-w-[280px]">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="py-2.5 px-4 text-left font-semibold">US</th>
                  <th className="py-2.5 px-4 text-left font-semibold">EU</th>
                  <th className="py-2.5 px-4 text-left font-semibold">Inches</th>
                  <th className="py-2.5 px-4 text-left font-semibold">CM</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((s, i) => (
                  <tr key={s.us} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 px-4 font-semibold text-gray-900">{s.us}</td>
                    <td className="py-2 px-4 text-gray-600">{s.eu}</td>
                    <td className="py-2 px-4 text-gray-600">{s.inches}</td>
                    <td className="py-2 px-4 text-gray-600">{s.cm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
