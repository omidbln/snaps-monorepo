import type {
  PermissionSpecificationBuilder,
  RestrictedMethodOptions,
  ValidPermissionSpecification,
} from '@metamask/permission-controller';
import { PermissionType, SubjectType } from '@metamask/permission-controller';
import { rpcErrors } from '@metamask/rpc-errors';
import type { ManageStateParams, ManageStateResult } from '@metamask/snaps-sdk';
import { ManageStateOperation } from '@metamask/snaps-sdk';
import { STATE_ENCRYPTION_MAGIC_VALUE, parseJson } from '@metamask/snaps-utils';
import type { Json, NonEmptyArray, Hex } from '@metamask/utils';
import { isObject, getJsonSize, assert, isValidJson } from '@metamask/utils';

import type { MethodHooksObject } from '../utils';
import { deriveEntropy } from '../utils';

// The salt used for SIP-6-based entropy derivation.
export const STATE_ENCRYPTION_SALT = 'snap_manageState encryption';

const methodName = 'snap_manageState';

export type ManageStateMethodHooks = {
  /**
   * @returns The mnemonic of the user's primary keyring.
   */
  getMnemonic: () => Promise<Uint8Array>;

  /**
   * Waits for the extension to be unlocked.
   *
   * @returns A promise that resolves once the extension is unlocked.
   */
  getUnlockPromise: (shouldShowUnlockRequest: boolean) => Promise<void>;

  /**
   * A function that clears the state of the requesting Snap.
   */
  clearSnapState: (snapId: string, encrypted: boolean) => void;

  /**
   * A function that gets the encrypted state of the requesting Snap.
   *
   * @returns The current state of the Snap.
   */
  getSnapState: (snapId: string, encrypted: boolean) => string;

  /**
   * A function that updates the state of the requesting Snap.
   *
   * @param newState - The new state of the Snap.
   */
  updateSnapState: (
    snapId: string,
    newState: string,
    encrypted: boolean,
  ) => void;

  /**
   * Encrypts data with a key. This is assumed to perform symmetric encryption.
   *
   * @param key - The key to use for encryption, in hexadecimal format.
   * @param data - The JSON data to encrypt.
   * @returns The ciphertext as a string. The format for this string is
   * dependent on the implementation, but MUST be a string.
   */
  encrypt: (key: string, data: Json) => Promise<string>;

  /**
   * Decrypts data with a key. This is assumed to perform symmetric decryption.
   *
   * @param key - The key to use for decryption, in hexadecimal format.
   * @param cipherText - The ciphertext to decrypt. The format for this string
   * is dependent on the implementation, but MUST be a string.
   * @returns The decrypted data as a JSON object.
   */
  decrypt: (key: Hex, cipherText: string) => Promise<unknown>;
};

type ManageStateSpecificationBuilderOptions = {
  allowedCaveats?: Readonly<NonEmptyArray<string>> | null;
  methodHooks: ManageStateMethodHooks;
};

type ManageStateSpecification = ValidPermissionSpecification<{
  permissionType: PermissionType.RestrictedMethod;
  targetName: typeof methodName;
  methodImplementation: ReturnType<typeof getManageStateImplementation>;
  allowedCaveats: Readonly<NonEmptyArray<string>> | null;
}>;

/**
 * The specification builder for the `snap_manageState` permission.
 * `snap_manageState` lets the Snap store and manage some of its state on
 * your device.
 *
 * @param options - The specification builder options.
 * @param options.allowedCaveats - The optional allowed caveats for the permission.
 * @param options.methodHooks - The RPC method hooks needed by the method implementation.
 * @returns The specification for the `snap_manageState` permission.
 */
export const specificationBuilder: PermissionSpecificationBuilder<
  PermissionType.RestrictedMethod,
  ManageStateSpecificationBuilderOptions,
  ManageStateSpecification
> = ({
  allowedCaveats = null,
  methodHooks,
}: ManageStateSpecificationBuilderOptions) => {
  return {
    permissionType: PermissionType.RestrictedMethod,
    targetName: methodName,
    allowedCaveats,
    methodImplementation: getManageStateImplementation(methodHooks),
    subjectTypes: [SubjectType.Snap],
  };
};

const methodHooks: MethodHooksObject<ManageStateMethodHooks> = {
  getMnemonic: true,
  getUnlockPromise: true,
  clearSnapState: true,
  getSnapState: true,
  updateSnapState: true,
  encrypt: true,
  decrypt: true,
};

export const manageStateBuilder = Object.freeze({
  targetName: methodName,
  specificationBuilder,
  methodHooks,
} as const);

export const STORAGE_SIZE_LIMIT = 104857600; // In bytes (100MB)

type GetEncryptionKeyArgs = {
  snapId: string;
  mnemonicPhrase: Uint8Array;
};

/**
 * Get a deterministic encryption key to use for encrypting and decrypting the
 * state.
 *
 * This key should only be used for state encryption using `snap_manageState`.
 * To get other encryption keys, a different salt can be used.
 *
 * @param args - The encryption key args.
 * @param args.snapId - The ID of the snap to get the encryption key for.
 * @param args.mnemonicPhrase - The mnemonic phrase to derive the encryption key
 * from.
 * @returns The state encryption key.
 */
async function getEncryptionKey({
  mnemonicPhrase,
  snapId,
}: GetEncryptionKeyArgs) {
  return await deriveEntropy({
    mnemonicPhrase,
    input: snapId,
    salt: STATE_ENCRYPTION_SALT,
    magic: STATE_ENCRYPTION_MAGIC_VALUE,
  });
}

type EncryptStateArgs = GetEncryptionKeyArgs & {
  state: Json;
  encryptFunction: ManageStateMethodHooks['encrypt'];
};

/**
 * Encrypt the state using a deterministic encryption algorithm, based on the
 * snap ID and mnemonic phrase.
 *
 * @param args - The encryption args.
 * @param args.state - The state to encrypt.
 * @param args.encryptFunction - The function to use for encrypting the state.
 * @param args.snapId - The ID of the snap to get the encryption key for.
 * @param args.mnemonicPhrase - The mnemonic phrase to derive the encryption key
 * from.
 * @returns The encrypted state.
 */
async function encryptState({
  state,
  encryptFunction,
  ...keyArgs
}: EncryptStateArgs) {
  const encryptionKey = await getEncryptionKey(keyArgs);
  return await encryptFunction(encryptionKey, state);
}

type DecryptStateArgs = GetEncryptionKeyArgs & {
  state: string;
  decryptFunction: ManageStateMethodHooks['decrypt'];
};

/**
 * Decrypt the state using a deterministic decryption algorithm, based on the
 * snap ID and mnemonic phrase.
 *
 * @param args - The encryption args.
 * @param args.state - The state to decrypt.
 * @param args.decryptFunction - The function to use for decrypting the state.
 * @param args.snapId - The ID of the snap to get the encryption key for.
 * @param args.mnemonicPhrase - The mnemonic phrase to derive the encryption key
 * from.
 * @returns The encrypted state.
 */
async function decryptState({
  state,
  decryptFunction,
  ...keyArgs
}: DecryptStateArgs) {
  try {
    const encryptionKey = await getEncryptionKey(keyArgs);
    const decryptedState = await decryptFunction(encryptionKey, state);

    assert(isValidJson(decryptedState));

    return decryptedState as Record<string, Json>;
  } catch {
    throw rpcErrors.internal({
      message: 'Failed to decrypt snap state, the state must be corrupted.',
    });
  }
}

/**
 * Builds the method implementation for `snap_manageState`.
 *
 * @param hooks - The RPC method hooks.
 * @param hooks.clearSnapState - A function that clears the state stored for a
 * snap.
 * @param hooks.getSnapState - A function that fetches the persisted decrypted
 * state for a snap.
 * @param hooks.updateSnapState - A function that updates the state stored for a
 * snap.
 * @param hooks.getMnemonic - A function to retrieve the Secret Recovery Phrase
 * of the user.
 * @param hooks.getUnlockPromise - A function that resolves once the MetaMask
 * extension is unlocked and prompts the user to unlock their MetaMask if it is
 * locked.
 * @param hooks.encrypt - A function that encrypts the given state.
 * @param hooks.decrypt - A function that decrypts the given state.
 * @returns The method implementation which either returns `null` for a
 * successful state update/deletion or returns the decrypted state.
 * @throws If the params are invalid.
 */
export function getManageStateImplementation({
  getMnemonic,
  getUnlockPromise,
  clearSnapState,
  getSnapState,
  updateSnapState,
  encrypt,
  decrypt,
}: ManageStateMethodHooks) {
  return async function manageState(
    options: RestrictedMethodOptions<ManageStateParams>,
  ): Promise<ManageStateResult> {
    const {
      params = {},
      method,
      context: { origin },
    } = options;
    const validatedParams = getValidatedParams(params, method);

    // If the encrypted param is undefined or null we default to true.
    const shouldEncrypt = validatedParams.encrypted ?? true;

    // We only need to prompt the user when the mnemonic is needed
    // which it isn't for the clear operation or unencrypted storage.
    if (
      shouldEncrypt &&
      validatedParams.operation !== ManageStateOperation.ClearState
    ) {
      await getUnlockPromise(true);
    }

    switch (validatedParams.operation) {
      case ManageStateOperation.ClearState:
        clearSnapState(origin, shouldEncrypt);
        return null;

      case ManageStateOperation.GetState: {
        const state = getSnapState(origin, shouldEncrypt);
        if (state === null) {
          return state;
        }
        return shouldEncrypt
          ? await decryptState({
              state,
              decryptFunction: decrypt,
              mnemonicPhrase: await getMnemonic(),
              snapId: origin,
            })
          : parseJson<Record<string, Json>>(state);
      }

      case ManageStateOperation.UpdateState: {
        const finalizedState = shouldEncrypt
          ? await encryptState({
              state: validatedParams.newState,
              encryptFunction: encrypt,
              mnemonicPhrase: await getMnemonic(),
              snapId: origin,
            })
          : JSON.stringify(validatedParams.newState);

        updateSnapState(origin, finalizedState, shouldEncrypt);
        return null;
      }

      default:
        throw rpcErrors.invalidParams(
          `Invalid ${method} operation: "${
            validatedParams.operation as string
          }"`,
        );
    }
  };
}

/**
 * Validates the manageState method `params` and returns them cast to the correct
 * type. Throws if validation fails.
 *
 * @param params - The unvalidated params object from the method request.
 * @param method - RPC method name used for debugging errors.
 * @param storageSizeLimit - Maximum allowed size (in bytes) of a new state object.
 * @returns The validated method parameter object.
 */
export function getValidatedParams(
  params: unknown,
  method: string,
  storageSizeLimit = STORAGE_SIZE_LIMIT,
): ManageStateParams {
  if (!isObject(params)) {
    throw rpcErrors.invalidParams({
      message: 'Expected params to be a single object.',
    });
  }

  const { operation, newState, encrypted } = params;

  if (
    !operation ||
    typeof operation !== 'string' ||
    !Object.values(ManageStateOperation).includes(
      operation as ManageStateOperation,
    )
  ) {
    throw rpcErrors.invalidParams({
      message: 'Must specify a valid manage state "operation".',
    });
  }

  if (encrypted !== undefined && typeof encrypted !== 'boolean') {
    throw rpcErrors.invalidParams({
      message: '"encrypted" parameter must be a boolean if specified.',
    });
  }

  if (operation === ManageStateOperation.UpdateState) {
    if (!isObject(newState)) {
      throw rpcErrors.invalidParams({
        message: `Invalid ${method} "updateState" parameter: The new state must be a plain object.`,
        data: {
          receivedNewState:
            typeof newState === 'undefined' ? 'undefined' : newState,
        },
      });
    }

    let size;
    try {
      // `getJsonSize` will throw if the state is not JSON serializable.
      size = getJsonSize(newState);
    } catch {
      throw rpcErrors.invalidParams({
        message: `Invalid ${method} "updateState" parameter: The new state must be JSON serializable.`,
        data: {
          receivedNewState:
            typeof newState === 'undefined' ? 'undefined' : newState,
        },
      });
    }

    if (size > storageSizeLimit) {
      throw rpcErrors.invalidParams({
        message: `Invalid ${method} "updateState" parameter: The new state must not exceed ${storageSizeLimit} bytes in size.`,
        data: {
          receivedNewState:
            typeof newState === 'undefined' ? 'undefined' : newState,
        },
      });
    }
  }

  return params as ManageStateParams;
}
