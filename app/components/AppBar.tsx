import { Button, Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import SignInButton from "./SignInButton";
import Link from "next/link";

export default function AppBar() {
  return (
    <Navbar isBordered={true}>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link
            className="hover:text-sky-500 transition-colors"
            color="foreground"
            href="/"
          >
            Home
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <SignInButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
