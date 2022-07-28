import { PermissionSpecificationBuilder, PermissionType, RestrictedMethodOptions } from '@metamask/controllers';
import { JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import { NonEmptyArray } from '@metamask/utils';
declare const targetKey: "snap_getBip44Entropy_*";
export declare type GetBip44EntropyMethodHooks = {
    /**
     * @returns The mnemonic of the user's primary keyring.
     */
    getMnemonic: () => Promise<string>;
    /**
     * Waits for the extension to be unlocked.
     *
     * @returns A promise that resolves once the extension is unlocked.
     */
    getUnlockPromise: (shouldShowUnlockRequest: boolean) => Promise<void>;
};
declare type GetBip44EntropySpecificationBuilderOptions = {
    allowedCaveats?: Readonly<NonEmptyArray<string>> | null;
    methodHooks: GetBip44EntropyMethodHooks;
};
export declare const getBip44EntropyBuilder: Readonly<{
    readonly targetKey: "snap_getBip44Entropy_*";
    readonly specificationBuilder: PermissionSpecificationBuilder<PermissionType.RestrictedMethod, GetBip44EntropySpecificationBuilderOptions, {
        permissionType: PermissionType.RestrictedMethod;
        targetKey: typeof targetKey;
        methodImplementation: ReturnType<typeof getBip44EntropyImplementation>;
        allowedCaveats: Readonly<NonEmptyArray<string>> | null;
    }>;
    readonly methodHooks: {
        readonly getMnemonic: true;
        readonly getUnlockPromise: true;
    };
}>;
/**
 * Builds the method implementation for `snap_getBip44Entropy_*`.
 *
 * @param hooks - The RPC method hooks.
 * @param hooks.getMnemonic - A function to retrieve the Secret Recovery Phrase of the user.
 * @param hooks.getUnlockPromise - A function that resolves once the MetaMask extension is unlocked and prompts the user to unlock their MetaMask if it is locked.
 * @returns The method implementation which returns a `BIP44CoinTypeNode`.
 * @throws If the params are invalid.
 */
declare function getBip44EntropyImplementation({ getMnemonic, getUnlockPromise, }: GetBip44EntropyMethodHooks): (args: RestrictedMethodOptions<void>) => Promise<JsonBIP44CoinTypeNode>;
export {};
