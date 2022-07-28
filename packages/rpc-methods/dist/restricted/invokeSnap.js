"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeSnapBuilder = void 0;
const controllers_1 = require("@metamask/controllers");
const utils_1 = require("@metamask/utils");
const eth_rpc_errors_1 = require("eth-rpc-errors");
const snap_utils_1 = require("@metamask/snap-utils");
const methodPrefix = snap_utils_1.SNAP_PREFIX;
const targetKey = `${methodPrefix}*`;
/**
 * The specification builder for the `wallet_snap_*` permission.
 *
 * `wallet_snap_*` attempts to invoke an RPC method of the specified Snap.
 *
 * Requesting its corresponding permission will attempt to connect to the Snap,
 * and install it if it's not avaialble yet.
 *
 * @param options - The specification builder options.
 * @param options.allowedCaveats - The optional allowed caveats for the permission.
 * @param options.methodHooks - The RPC method hooks needed by the method implementation.
 * @returns The specification for the `wallet_snap_*` permission.
 */
const specificationBuilder = ({ allowedCaveats = null, methodHooks, }) => {
    return {
        permissionType: controllers_1.PermissionType.RestrictedMethod,
        targetKey,
        allowedCaveats,
        methodImplementation: getInvokeSnapImplementation(methodHooks),
    };
};
exports.invokeSnapBuilder = Object.freeze({
    targetKey,
    specificationBuilder,
    methodHooks: {
        getSnap: true,
        handleSnapRpcRequest: true,
    },
});
/**
 * Builds the method implementation for `wallet_snap_*`.
 *
 * @param hooks - The RPC method hooks.
 * @param hooks.getSnap - A function that retrieves all information stored about a snap.
 * @param hooks.handleSnapRpcRequest - A function that sends an RPC request to a snap's RPC handler or throws if that fails.
 * @returns The method implementation which returns the result of `handleSnapRpcRequest`.
 * @throws If the params are invalid.
 */
function getInvokeSnapImplementation({ getSnap, handleSnapRpcRequest, }) {
    return async function invokeSnap(options) {
        const { params = [], method, context } = options;
        const snapRpcRequest = params[0];
        if (!(0, utils_1.isObject)(snapRpcRequest)) {
            throw eth_rpc_errors_1.ethErrors.rpc.invalidParams({
                message: 'Must specify snap RPC request object as single parameter.',
            });
        }
        const snapIdString = method.substr(snap_utils_1.SNAP_PREFIX.length);
        if (!getSnap(snapIdString)) {
            throw eth_rpc_errors_1.ethErrors.rpc.invalidRequest({
                message: `The snap "${snapIdString}" is not installed. This is a bug, please report it.`,
            });
        }
        const fromSubject = context.origin;
        // handleSnapRpcRequest is an async function that takes the snap id, a snapOriginString string and a request object.
        // It should return the result it would like returned to the fromDomain as part of response.result
        return (await handleSnapRpcRequest(snapIdString, fromSubject, snapRpcRequest));
    };
}
//# sourceMappingURL=invokeSnap.js.map