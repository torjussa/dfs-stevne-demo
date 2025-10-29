import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { IconUser, IconUserPlus } from "@tabler/icons-react";

export function LoginWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Logg inn eller start innmelding</CardTitle>
        <CardDescription>
          Logg inn eller start innmelding for å se dine påmeldinger og få
          tilgang til alle funksjoner.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button asChild>
          <Link href="/logg-inn">
            <IconUser />
            Logg inn
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/opprett-konto">
            <IconUserPlus />
            Innmelding
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
