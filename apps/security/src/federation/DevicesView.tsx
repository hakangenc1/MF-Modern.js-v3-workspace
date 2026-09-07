import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";
import { formatDate, relativeTime, type Device } from "@bank/mock";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@bank/ui/components/ui/card";
import { Badge } from "@bank/ui/components/ui/badge";
import { Button } from "@bank/ui/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@bank/ui/components/ui/table";
import { PageHeader } from "@bank/ui/patterns/kit";

const ICON = { phone: Smartphone, laptop: Laptop, tablet: Tablet, desktop: Monitor } as const;

export default function DevicesView({
  devices,
  onRevoke,
  pending = false,
}: {
  devices: Device[];
  onRevoke: (id: string) => void;
  pending?: boolean;
}) {
  return (
    <>
      <PageHeader
        title="Trusted devices"
        description="Devices that have signed in to your account. Remove any you don't recognise."
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{devices.length} devices</CardTitle>
          <CardDescription>Trusted devices skip 2FA for 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((d) => {
                const Icon = ICON[d.kind];
                return (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <p className="font-medium">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.os}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{d.location}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {relativeTime(d.lastActive)} · {formatDate(d.lastActive, "short")}
                    </TableCell>
                    <TableCell>
                      {d.current ? (
                        <Badge variant="secondary">This device</Badge>
                      ) : d.trusted ? (
                        <Badge variant="outline">Trusted</Badge>
                      ) : (
                        <Badge variant="destructive">Unverified</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {d.current ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={pending}
                          onClick={() => onRevoke(d.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
