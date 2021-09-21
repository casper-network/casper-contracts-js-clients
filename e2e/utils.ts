import { CasperClient, Keys } from "casper-js-sdk";

export const parseTokenMeta = (str: string): Array<[string, string]> =>
  str.split(",").map((s) => {
    const map = s.split(" ");
    return [map[0], map[1]];
  });

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Returns a set ECC key pairs - one for each NCTL user account.
 * @param {String} pathToUsers - Path to NCTL user directories.
 * @return {Array} An array of assymmetric keys.
 */
export const getKeyPairOfUserSet = (pathToUsers: string) => {
  return [1, 2, 3, 4, 5].map((userID) => {
    return Keys.Ed25519.parseKeyFiles(
      `${pathToUsers}/user-${userID}/public_key.pem`,
      `${pathToUsers}/user-${userID}/secret_key.pem`
    );
  });
};

export const getDeploy = async (NODE_URL: string, deployHash: string) => {
  const client = new CasperClient(NODE_URL);
  let i = 300;
  while (i != 0) {
    const [deploy, raw] = await client.getDeploy(deployHash);
    if (raw.execution_results.length !== 0) {
      // @ts-ignore
      if (raw.execution_results[0].result.Success) {
        return deploy;
      } else {
        // @ts-ignore
        throw Error(
          "Contract execution: " +
            // @ts-ignore
            raw.execution_results[0].result.Failure.error_message
        );
      }
    } else {
      i--;
      await sleep(1000);
      continue;
    }
  }
  throw Error("Timeout after " + i + "s. Something's wrong");
};

