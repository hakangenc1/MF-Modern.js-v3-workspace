import { Link } from "@modern-js/runtime/router";
import { CreditCard, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@bank/ui/components/ui/avatar";
import { Button } from "@bank/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bank/ui/components/ui/dropdown-menu";
import type { User } from "@bank/mock";

export function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-1.5">
          <Avatar className="size-7">
            <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">{user.firstName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span>{user.name}</span>
          <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/security">
            <ShieldCheck className="size-4" /> Security
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/cards">
            <CreditCard className="size-4" /> Cards
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/security/devices">
            <UserRound className="size-4" /> Trusted devices
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant="destructive">
          <Link to="/logout">
            <LogOut className="size-4" /> Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
