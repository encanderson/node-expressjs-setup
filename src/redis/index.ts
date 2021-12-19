import { promisify } from "util";
import * as redis from "redis";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const managerList = (list: redis): any => {
  const setAsync = promisify(list.set).bind(list);
  const existsAsync = promisify(list.exists).bind(list);
  const getAsync = promisify(list.get).bind(list);
  const delAsync = promisify(list.del).bind(list);

  return {
    async setKey(key: string, value: string, expiration: number) {
      await setAsync(key, value);
      list.expireat(key, expiration);
    },

    async getKey(key: string) {
      return getAsync(key);
    },

    async isKey(key: string) {
      const resultado = await existsAsync(key);
      return resultado === 1;
    },

    async delete(key: string) {
      await delAsync(key);
    },
  };
};
