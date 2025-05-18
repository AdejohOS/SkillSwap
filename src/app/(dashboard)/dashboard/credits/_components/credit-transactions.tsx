'use client'

import { useState, useEffect } from 'react'

import { format } from 'date-fns'
import { ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { createClient } from '@/utils/supabase/client'

interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  description: string
  related_id: string | null
  balance_after: number
  created_at: string
}

export function CreditTransactions({ userId }: { userId: string }) {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          throw error
        }

        setTransactions(
          (data || []).map(transaction => ({
            ...transaction,
            created_at: transaction.created_at || ''
          }))
        )
      } catch (err: any) {
        console.error('Error fetching transactions:', err)
        setError(err.message || 'Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [userId, supabase])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent credit transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
          </div>
        ) : error ? (
          <div className='text-destructive py-8 text-center'>{error}</div>
        ) : transactions.length === 0 ? (
          <div className='text-muted-foreground py-8 text-center'>
            No transactions found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className='text-right'>Amount</TableHead>
                <TableHead className='text-right'>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell className='font-medium'>
                    {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      {transaction.amount > 0 ? (
                        <ArrowUpCircle className='h-4 w-4 text-green-500' />
                      ) : (
                        <ArrowDownCircle className='h-4 w-4 text-red-500' />
                      )}
                      <span
                        className={
                          transaction.amount > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {transaction.amount > 0 ? '+' : ''}
                        {transaction.amount}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    {transaction.balance_after}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
