import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}
export const Table = ({ children, className = '' }: Props) => {
  return (
    <div className="border-default bg-offset overflow-x-auto rounded-lg border text-left shadow-lg">
      <table className={`w-full table-auto  ${className}`}>{children}</table>
    </div>
  )
}

export const THead = ({ children, className = '' }: Props) => {
  return <thead className={`${className} uppercase`}>{children}</thead>
}

export const TH = ({ children, className = '' }: Props) => {
  return (
    <th
      scope="col"
      className={`border-default bg-default text-default border-b px-4 py-2 text-xs ${className}`}
    >
      {children}
    </th>
  )
}

export const TR = ({ children, className = '' }: Props) => {
  return (
    <tr className={` ${className} border-default border-b last:border-none`}>
      {children}
    </tr>
  )
}

export const TD = ({ children, className }: Props) => {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>
}
