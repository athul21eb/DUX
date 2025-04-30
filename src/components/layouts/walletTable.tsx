
import { auth } from '@/lib/auth/auth'
import { getWalletData } from '@/server/actions/user/wallet/wallet.server-action'
import { redirect } from 'next/navigation'
import WalletClient from '../shared/wallet-client'

async function WalletTable() {
  const session = await auth()

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/login')
  }

  const itemsPerPage = 5
  const initialData = await getWalletData(1, itemsPerPage)

  if (!initialData.success) {
    return <div className="p-4 text-red-500">Failed to fetch wallet data: {initialData.message}</div>
  }

  console.log('Wallet Data:', initialData.data)

  return (
    <div className="container mx-auto py-8">
      {initialData.data ? (
        <WalletClient
          initialWallet={initialData.data.wallet}
          initialTransactions={initialData.data.transactions}
          totalTransactionsCount={initialData.data.pagination.totalCount}
          currentPage={initialData.data.pagination.currentPage}
          totalPages={initialData.data.pagination.totalPages}
          itemsPerPage={itemsPerPage}
        />
      ) : (
        <div className="p-4 text-red-500">No wallet data available.</div>
      )}
    </div>
  )
}

export default WalletTable