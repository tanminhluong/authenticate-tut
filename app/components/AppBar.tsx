import {
  Button,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import React from "react";

export default function AppBar() {
  return (
    <Navbar isBordered={true}>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="/signup" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
