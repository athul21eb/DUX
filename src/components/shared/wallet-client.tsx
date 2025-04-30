'use client'

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import {
  Wallet as WalletIcon,
  Banknote,
  CalendarCheck,
  TimerReset,
  ListOrdered,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react"

import ReusableTable from "@/components/shared/reusableTable"
import PaginationComponent from "@/components/shared/reusablePagenation"
import { getWalletData } from "@/server/actions/user/wallet/wallet.server-action"

export interface Wallet {
  id: string
  userId: string
  balance: number
  createdAt: Date
  updatedAt: Date
}

export type TransactionType = "credit" | "debit"
export type TransactionStatus = "pending" | "failed" | "initiated" | "success"

export interface Transaction {
  id: string
  transactionId: string
  paymentId: string | null
  walletId: string
  bookingId: string | null
  description: string
  amount: number
  type: TransactionType
  status: TransactionStatus
  date: Date
  createdAt: Date
  updatedAt: Date
  booking: any | null
}

interface WalletClientProps {
  initialWallet: Wallet
  initialTransactions: Transaction[]
  totalTransactionsCount: number
  currentPage: number
  totalPages: number
  itemsPerPage: number
}

const statusBadge = (status: TransactionStatus) => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium capitalize"

  switch (status) {
    case "success":
      return <span className={`${base} bg-green-100 text-green-800`}><CheckCircle2 className="mr-1 h-3 w-3" /> Success</span>
    case "pending":
      return <span className={`${base} bg-yellow-100 text-yellow-800`}><TimerReset className="mr-1 h-3 w-3" /> Pending</span>
    case "initiated":
      return <span className={`${base} bg-blue-100 text-blue-800`}><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Initiated</span>
    case "failed":
      return <span className={`${base} bg-red-100 text-red-800`}><XCircle className="mr-1 h-3 w-3" /> Failed</span>
    default:
      return <span className={`${base} bg-muted text-muted-foreground`}>{status}</span>
  }
}

const WalletClient = ({
  initialWallet,
  initialTransactions,
  totalTransactionsCount,
  currentPage: initialCurrentPage,
  totalPages: initialTotalPages,
  itemsPerPage
}: WalletClientProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [currentPage, setCurrentPage] = useState(initialCurrentPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [totalCount, setTotalCount] = useState(totalTransactionsCount)
  const [isPending, startTransition] = useTransition()

  const handlePageChange = (newPage: number) => {
    startTransition(async () => {
      const result = await getWalletData(newPage, itemsPerPage)
      if (result.success && result.data) {
        setTransactions(result.data.transactions)
        setCurrentPage(result.data.pagination.currentPage)
        setTotalPages(result.data.pagination.totalPages)
        setTotalCount(result.data.pagination.totalCount)
      }
    })
  }

  const headers = ["#",  "Date", "Description", "Amount", "Type", "Status","Transanction ID"]
  const transactionNumberStart = 1 + (currentPage - 1) * itemsPerPage

  const rows = transactions.map((tx, index) => [
    transactionNumberStart + index, new Date(tx.date).toLocaleString(),
   ,
    tx.description,
    <span className="font-medium text-foreground">{tx.amount.toFixed(2)} INR</span>,
    <span className={`capitalize ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>{tx.type}</span>,
    statusBadge(tx.status),
    <span className=" text-foreground text-clip">{tx.transactionId}</span>

  ])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <WalletIcon className="h-4 w-4" />
            Wallet ID
          </div>
          <p className="text-sm break-all font-medium">{initialWallet.id}</p>
        </div>
        <div className="bg-card border rounded-lg p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Banknote className="h-4 w-4 text-green-600" />
            Balance
          </div>
          <p className="text-lg font-semibold text-green-700">
            ₹ {initialWallet.balance.toFixed(2)}
          </p>
        </div>
        <div className="bg-card border rounded-lg p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <CalendarCheck className="h-4 w-4" />
            Created
          </div>
          <p className="text-sm">{new Date(initialWallet.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="bg-card border rounded-lg p-4 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <TimerReset className="h-4 w-4" />
            Updated
          </div>
          <p className="text-sm">{new Date(initialWallet.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-primary" />
          Transactions
        </h2>

        <ReusableTable headers={headers} rows={rows} />

        <div className="mt-6">
          <PaginationComponent
            currentPage={currentPage}
            pageCount={totalPages}
            onPageChange={handlePageChange}
            isLoading={isPending}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default WalletClient
