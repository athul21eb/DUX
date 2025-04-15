import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockTransactions = [
  { id: 1, type: "Deposit", amount: 100, date: "2023-05-01" },
  { id: 2, type: "Withdrawal", amount: -50, date: "2023-05-02" },
  { id: 3, type: "Deposit", amount: 200, date: "2023-05-03" },
]

export default function WalletPage() {
  const balance = mockTransactions.reduce((acc, transaction) => acc + transaction.amount, 0)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

