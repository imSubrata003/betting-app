'use client'

import { useParams } from 'next/navigation'
import React from 'react'

const TransactionsPage = () => {
    const { actions } = useParams()
    //console.log(actions)
    return (
        <div>TransactionsPage</div>
    )
}

export default TransactionsPage