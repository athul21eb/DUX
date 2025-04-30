'use server'


import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db/database'
import { revalidatePath } from 'next/cache'

// Fetch wallet data including balance and transactions with pagination
export async function getWalletData(page = 1, itemsPerPage = 5) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Authentication required',
      }
    }

    const userId = session.user.id

    // Get or create wallet for user
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
        },
      })
    }

    // Calculate pagination values
    const skip = (page - 1) * itemsPerPage

    // Get transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where: {
        walletId: wallet.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: itemsPerPage,
      include: {
        booking: true,
      },
    })

    // Get total count of transactions for pagination
    const totalTransactionsCount = await prisma.transaction.count({
      where: {
        walletId: wallet.id,
      },
    })

    const totalPages = Math.ceil(totalTransactionsCount / itemsPerPage)

    return {
      success: true,
      data: {
        wallet,
        transactions,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: totalTransactionsCount,
          itemsPerPage,
        },
      },
    }
  } catch (error) {
    console.error('Error fetching wallet data:', error)
    return {
      success: false,
      message: 'Failed to fetch wallet data',
    }
  }
}
