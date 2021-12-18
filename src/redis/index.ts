import * as redis from "redis";
import { promisify } from "util";

export const clientRedis = redis.createClient();

export const existsAsync = promisify(clientRedis.exists).bind(clientRedis);

export const setAsync = promisify(clientRedis.setex).bind(clientRedis);
