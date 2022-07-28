import { ConfirmMethodHooks } from './confirm';
import { GetBip44EntropyMethodHooks } from './getBip44Entropy';
import { InvokeSnapMethodHooks } from './invokeSnap';
import { ManageStateMethodHooks } from './manageState';
import { NotifyMethodHooks } from './notify';
export { ManageStateOperation } from './manageState';
export { NotificationArgs, NotificationType } from './notify';
export declare type RestrictedMethodHooks = ConfirmMethodHooks & GetBip44EntropyMethodHooks & InvokeSnapMethodHooks & ManageStateMethodHooks & NotifyMethodHooks;
export declare const builders: {
    readonly snap_confirm: Readonly<{
        readonly targetKey: "snap_confirm";
        readonly specificationBuilder: import("@metamask/controllers").PermissionSpecificationBuilder<import("@metamask/controllers").PermissionType.RestrictedMethod, {
            allowedCaveats?: readonly [string, ...string[]] | null | undefined;
            methodHooks: ConfirmMethodHooks;
        }, {
            permissionType: import("@metamask/controllers").PermissionType.RestrictedMethod;
            targetKey: "snap_confirm";
            methodImplementation: (args: import("@metamask/controllers").RestrictedMethodOptions<[{
                prompt: string;
                description: string;
                textAreaContent: string;
            }]>) => Promise<boolean>;
            allowedCaveats: readonly [string, ...string[]] | null;
        }>;
        readonly methodHooks: {
            readonly showConfirmation: true;
        };
    }>;
    readonly "snap_getBip44Entropy_*": Readonly<{
        readonly targetKey: "snap_getBip44Entropy_*";
        readonly specificationBuilder: import("@metamask/controllers").PermissionSpecificationBuilder<import("@metamask/controllers").PermissionType.RestrictedMethod, {
            allowedCaveats?: readonly [string, ...string[]] | null | undefined;
            methodHooks: GetBip44EntropyMethodHooks;
        }, {
            permissionType: import("@metamask/controllers").PermissionType.RestrictedMethod;
            targetKey: "snap_getBip44Entropy_*";
            methodImplementation: (args: import("@metamask/controllers").RestrictedMethodOptions<void>) => Promise<import("@metamask/key-tree").JsonBIP44CoinTypeNode>;
            allowedCaveats: readonly [string, ...string[]] | null;
        }>;
        readonly methodHooks: {
            readonly getMnemonic: true;
            readonly getUnlockPromise: true;
        };
    }>;
    readonly "wallet_snap_*": Readonly<{
        readonly targetKey: "wallet_snap_*";
        readonly specificationBuilder: import("@metamask/controllers").PermissionSpecificationBuilder<import("@metamask/controllers").PermissionType.RestrictedMethod, {
            allowedCaveats?: readonly [string, ...string[]] | null | undefined;
            methodHooks: InvokeSnapMethodHooks;
        }, {
            permissionType: import("@metamask/controllers").PermissionType.RestrictedMethod;
            targetKey: "wallet_snap_*";
            methodImplementation: (options: import("@metamask/controllers").RestrictedMethodOptions<[Record<string, import("@metamask/utils").Json>]>) => Promise<import("@metamask/utils").Json>;
            allowedCaveats: readonly [string, ...string[]] | null;
        }>;
        readonly methodHooks: {
            readonly getSnap: true;
            readonly handleSnapRpcRequest: true;
        };
    }>;
    readonly snap_manageState: Readonly<{
        readonly targetKey: "snap_manageState";
        readonly specificationBuilder: import("@metamask/controllers").PermissionSpecificationBuilder<import("@metamask/controllers").PermissionType.RestrictedMethod, {
            allowedCaveats?: readonly [string, ...string[]] | null | undefined;
            methodHooks: ManageStateMethodHooks;
        }, {
            permissionType: import("@metamask/controllers").PermissionType.RestrictedMethod;
            targetKey: "snap_manageState";
            methodImplementation: (options: import("@metamask/controllers").RestrictedMethodOptions<[import("./manageState").ManageStateOperation, Record<string, import("@metamask/utils").Json>]>) => Promise<Record<string, import("@metamask/utils").Json> | null>;
            allowedCaveats: readonly [string, ...string[]] | null;
        }>;
        readonly methodHooks: {
            readonly clearSnapState: true;
            readonly getSnapState: true;
            readonly updateSnapState: true;
        };
    }>;
    readonly snap_notify: Readonly<{
        readonly targetKey: "snap_notify";
        readonly specificationBuilder: import("@metamask/controllers").PermissionSpecificationBuilder<import("@metamask/controllers").PermissionType.RestrictedMethod, {
            allowedCaveats?: readonly [string, ...string[]] | null | undefined;
            methodHooks: NotifyMethodHooks;
        }, {
            permissionType: import("@metamask/controllers").PermissionType.RestrictedMethod;
            targetKey: "snap_notify";
            methodImplementation: (args: import("@metamask/controllers").RestrictedMethodOptions<[import("./notify").NotificationArgs]>) => Promise<null>;
            allowedCaveats: readonly [string, ...string[]] | null;
        }>;
        readonly methodHooks: {
            readonly showNativeNotification: true;
            readonly showInAppNotification: true;
        };
    }>;
};
