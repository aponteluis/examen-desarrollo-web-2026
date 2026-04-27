import React from 'react'

const Error = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="text-red-500 text-sm mt-1">
        {children}
    </div>
  )
}

export default Error