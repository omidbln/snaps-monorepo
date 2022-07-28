"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBip44EntropyBuilder = void 0;
const controllers_1 = require("@metamask/controllers");
const eth_rpc_errors_1 = require("eth-rpc-errors");
const key_tree_1 = require("@metamask/key-tree");
const methodPrefix = 'snap_getBip44Entropy_';
const targetKey = `${methodPrefix}*`;
/**
 * The specification builder for the `snap_getBip44Entropy_*` permission.
 * `snap_getBip44Entropy_*` lets the Snap control private keys for a particular
 * BIP-32 coin type.
 *
 * @param options - The specification builder options.
 * @param options.allowedCaveats - The optional allowed caveats for the permission.
 * @param options.methodHooks - The RPC method hooks needed by the method implementation.
 * @returns The specification for the `snap_getBip44Entropy_*` permission.
 */
const specificationBuilder = ({ allowedCaveats = null, methodHooks, }) => {
    return {
        permissionType: controllers_1.PermissionType.RestrictedMethod,
        targetKey,
        allowedCaveats,
        methodImplementation: getBip44EntropyImplementation(methodHooks),
    };
};
exports.getBip44EntropyBuilder = Object.freeze({
    targetKey,
    specificationBuilder,
    methodHooks: {
        getMnemonic: true,
        getUnlockPromise: true,
    },
});
const ALL_DIGIT_REGEX = /^\d+$/u;
/**
 * Builds the method implementation for `snap_getBip44Entropy_*`.
 *
 * @param hooks - The RPC method hooks.
 * @param hooks.getMnemonic - A function to retrieve the Secret Recovery Phrase of the user.
 * @param hooks.getUnlockPromise - A function that resolves once the MetaMask extension is unlocked and prompts the user to unlock their MetaMask if it is locked.
 * @returns The method implementation which returns a `BIP44CoinTypeNode`.
 * @throws If the params are invalid.
 */
function getBip44EntropyImplementation({ getMnemonic, getUnlockPromise, }) {
    return async function getBip44Entropy(args) {
        const bip44Code = args.method.substr(methodPrefix.length);
        if (!ALL_DIGIT_REGEX.test(bip44Code)) {
            throw eth_rpc_errors_1.ethErrors.rpc.methodNotFound({
                message: `Invalid BIP-44 code: ${bip44Code}`,
            });
        }
        await getUnlockPromise(true);
        const node = await key_tree_1.BIP44CoinTypeNode.fromDerivationPath([
            `bip39:${await getMnemonic()}`,
            `bip32:44'`,
            `bip32:${Number(bip44Code)}'`,
        ]);
        return node.toJSON();
    };
}
//# sourceMappingURL=getBip44Entropy.js.map