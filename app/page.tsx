import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center h-screen w-screen justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Ai interview.</CardTitle>
          <CardDescription>
            Your interview will be held by an ai model, so be prepared
          </CardDescription>
          <CardAction>
            <ModeToggle />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Link href={"/dashboard"}>
            <Button>Go To Interview Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
