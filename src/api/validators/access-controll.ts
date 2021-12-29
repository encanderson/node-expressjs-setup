import { AccessControl } from "accesscontrol";

export const accessController = new AccessControl();

accessController
  .grant("admin")
  .readAny("contacts", [
    "id",
    "name",
    "email",
    "phone",
    "status",
    "createdAt",
    "message",
  ]);
