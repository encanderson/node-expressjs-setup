import * as redis from "redis";

import { managerList } from "@src/redis";

const allowlist = redis.createClient({
  prefix: "allowlist-refresh-token:",
});

export const managerAllowlist = managerList(allowlist);
