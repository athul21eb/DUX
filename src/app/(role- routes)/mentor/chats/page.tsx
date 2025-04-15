import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockChats = [
  { id: 1, with: "John Doe", lastMessage: "Hey, how are you?", timestamp: "2023-05-01 14:30" },
  { id: 2, with: "Jane Smith", lastMessage: "Can we meet tomorrow?", timestamp: "2023-05-02 09:15" },
  { id: 3, with: "Bob Johnson", lastMessage: "Thanks for your help!", timestamp: "2023-05-03 18:45" },
]

export default function ChatsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Chats</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>With</TableHead>
              <TableHead>Last Message</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockChats.map((chat) => (
              <TableRow key={chat.id}>
                <TableCell>{chat.with}</TableCell>
                <TableCell>{chat.lastMessage}</TableCell>
                <TableCell>{chat.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

