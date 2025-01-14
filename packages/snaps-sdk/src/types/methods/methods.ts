import type { Method } from '../../internals';
import type { DialogParams, DialogResult } from './dialog';
import type {
  GetBip32EntropyParams,
  GetBip32EntropyResult,
} from './get-bip32-entropy';
import type {
  GetBip32PublicKeyParams,
  GetBip32PublicKeyResult,
} from './get-bip32-public-key';
import type {
  GetBip44EntropyParams,
  GetBip44EntropyResult,
} from './get-bip44-entropy';
import type { GetEntropyParams, GetEntropyResult } from './get-entropy';
import type { GetFileParams, GetFileResult } from './get-file';
import type { GetLocaleParams, GetLocaleResult } from './get-locale';
import type { GetSnapsParams, GetSnapsResult } from './get-snaps';
import type {
  InvokeKeyringParams,
  InvokeKeyringResult,
} from './invoke-keyring';
import type { InvokeSnapParams, InvokeSnapResult } from './invoke-snap';
import type {
  ManageAccountsParams,
  ManageAccountsResult,
} from './manage-accounts';
import type { ManageStateParams, ManageStateResult } from './manage-state';
import type { NotifyParams, NotifyResult } from './notify';
import type { RequestSnapsParams, RequestSnapsResult } from './request-snaps';

/**
 * The methods that are available to the Snap. Each method is a tuple of the
 * request parameters and the result returned by the method.
 */
export type SnapMethods = {
  /* eslint-disable @typescript-eslint/naming-convention */
  snap_dialog: [DialogParams, DialogResult];
  snap_getBip32Entropy: [GetBip32EntropyParams, GetBip32EntropyResult];
  snap_getBip32PublicKey: [GetBip32PublicKeyParams, GetBip32PublicKeyResult];
  snap_getBip44Entropy: [GetBip44EntropyParams, GetBip44EntropyResult];
  snap_getEntropy: [GetEntropyParams, GetEntropyResult];
  snap_getFile: [GetFileParams, GetFileResult];
  snap_getLocale: [GetLocaleParams, GetLocaleResult];
  snap_manageAccounts: [ManageAccountsParams, ManageAccountsResult];
  snap_manageState: [ManageStateParams, ManageStateResult];
  snap_notify: [NotifyParams, NotifyResult];
  wallet_getSnaps: [GetSnapsParams, GetSnapsResult];
  wallet_invokeKeyring: [InvokeKeyringParams, InvokeKeyringResult];
  wallet_invokeSnap: [InvokeSnapParams, InvokeSnapResult];
  wallet_snap: [InvokeSnapParams, InvokeSnapResult];
  wallet_requestSnaps: [RequestSnapsParams, RequestSnapsResult];
  /* eslint-enable @typescript-eslint/naming-convention */
};

/**
 * The request function that is available to the Snap. It takes a request
 * object and returns a promise that resolves to the result of the request.
 *
 * @param request - The request object.
 * @param request.method - The method to call.
 * @param request.params - The parameters to pass to the method. This is
 * inferred from the method, based on the {@link SnapMethods} type, and may be
 * optional.
 * @returns A promise that resolves to the result of the request. This is
 * inferred from the request method, based on the {@link SnapMethods} type.
 * @example
 * // Get the user's locale
 * const result = await request({
 *   method: 'snap_getLocale',
 * });
 * @example
 * // Get a file
 * const result = await request({
 *   method: 'snap_getFile',
 *   params: {
 *     path: 'foo/bar.txt',
 *   },
 * });
 */
export type RequestFunction = <MethodName extends keyof SnapMethods>(
  request: Method<MethodName, SnapMethods[MethodName][0]>,
) => Promise<SnapMethods[MethodName][1]>;
