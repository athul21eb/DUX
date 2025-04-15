import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockSessions = [
  { id: 1, device: "Chrome on Windows", lastActive: "2023-05-01 14:30" },
  { id: 2, device: "Safari on iPhone", lastActive: "2023-05-02 09:15" },
  { id: 3, device: "Firefox on MacOS", lastActive: "2023-05-03 18:45" },
]

export default function SessionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell>{session.device}</TableCell>
                <TableCell>{session.lastActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

