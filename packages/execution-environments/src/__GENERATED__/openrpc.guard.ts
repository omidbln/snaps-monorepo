/*
 * Generated type guards for "openrpc.ts".
 * WARNING: Do not manually change this file.
 */
import { Endowment, JSONRPCString, StringDoaGddGA, NumberHo1ClIqD, JSONRPCID, JSONRPCMethod, JSONRPCParamsAsArray, JSONRPCParamsAsObject, JSONRPCParams, SnapName, SourceCode, Endowments, Target, Origin, JsonRpcRequest, OK, SnapRpcResult, AnyOfSnapNameSourceCodeEndowmentsTargetOriginJsonRpcRequestOKOKOKSnapRpcResult, Ping, Terminate, ExecuteSnap, SnapRpc } from "./openrpc";

export function isEndowment(obj: any, _argumentName?: string): obj is Endowment {
    return (
        typeof obj === "string"
    )
}

export function isJSONRPCString(obj: any, _argumentName?: string): obj is JSONRPCString {
    return (
        obj === "2.0"
    )
}

export function isStringDoaGddGA(obj: any, _argumentName?: string): obj is StringDoaGddGA {
    return (
        typeof obj === "string"
    )
}

export function isNumberHo1ClIqD(obj: any, _argumentName?: string): obj is NumberHo1ClIqD {
    return (
        typeof obj === "number"
    )
}

export function isJSONRPCID(obj: any, _argumentName?: string): obj is JSONRPCID {
    return (
        (isEndowment(obj) as boolean ||
            isNumberHo1ClIqD(obj) as boolean)
    )
}

export function isJSONRPCMethod(obj: any, _argumentName?: string): obj is JSONRPCMethod {
    return (
        typeof obj === "string"
    )
}

export function isJSONRPCParamsAsArray(obj: any, _argumentName?: string): obj is JSONRPCParamsAsArray {
    return (
        Array.isArray(obj) &&
        obj.every((e: any) =>
            isSnapRpcResult(e) as boolean
        )
    )
}

export function isJSONRPCParamsAsObject(obj: any, _argumentName?: string): obj is JSONRPCParamsAsObject {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        Object.entries<any>(obj)
            .every(([key, value]) => (isSnapRpcResult(value) as boolean &&
                isEndowment(key) as boolean))
    )
}

export function isJSONRPCParams(obj: any, _argumentName?: string): obj is JSONRPCParams {
    return (
        (isJSONRPCParamsAsArray(obj) as boolean ||
            isJSONRPCParamsAsObject(obj) as boolean)
    )
}

export function isSnapName(obj: any, _argumentName?: string): obj is SnapName {
    return (
        typeof obj === "string"
    )
}

export function isSourceCode(obj: any, _argumentName?: string): obj is SourceCode {
    return (
        typeof obj === "string"
    )
}

export function isEndowments(obj: any, _argumentName?: string): obj is Endowments {
    return (
        Array.isArray(obj) &&
        obj.every((e: any) =>
            isEndowment(e) as boolean
        )
    )
}

export function isTarget(obj: any, _argumentName?: string): obj is Target {
    return (
        typeof obj === "string"
    )
}

export function isOrigin(obj: any, _argumentName?: string): obj is Origin {
    return (
        typeof obj === "string"
    )
}

export function isJsonRpcRequest(obj: any, _argumentName?: string): obj is JsonRpcRequest {
    return (
        (obj !== null &&
            typeof obj === "object" ||
            typeof obj === "function") &&
        isJSONRPCString(obj.jsonrpc) as boolean &&
        (typeof obj.id === "undefined" ||
            isEndowment(obj.id) as boolean ||
            isNumberHo1ClIqD(obj.id) as boolean) &&
        isEndowment(obj.method) as boolean &&
        (typeof obj.params === "undefined" ||
            isJSONRPCParamsAsArray(obj.params) as boolean ||
            isJSONRPCParamsAsObject(obj.params) as boolean) &&
        Object.entries<any>(obj)
            .filter(([key]) => !["jsonrpc", "id", "method", "params"].includes(key))
            .every(([key, value]) => (isSnapRpcResult(value) as boolean &&
                isEndowment(key) as boolean))
    )
}

export function isOK(obj: any, _argumentName?: string): obj is OK {
    return (
        obj === "OK"
    )
}

export function isSnapRpcResult(obj: any, _argumentName?: string): obj is SnapRpcResult {
    return (
        true
    )
}

export function isAnyOfSnapNameSourceCodeEndowmentsTargetOriginJsonRpcRequestOKOKOKSnapRpcResult(obj: any, _argumentName?: string): obj is AnyOfSnapNameSourceCodeEndowmentsTargetOriginJsonRpcRequestOKOKOKSnapRpcResult {
    return (
        true
    )
}

export function isPing(obj: any, _argumentName?: string): obj is Ping {
    return (
        typeof obj === "function"
    )
}

export function isTerminate(obj: any, _argumentName?: string): obj is Terminate {
    return (
        typeof obj === "function"
    )
}

export function isExecuteSnap(obj: any, _argumentName?: string): obj is ExecuteSnap {
    return (
        typeof obj === "function"
    )
}

export function isSnapRpc(obj: any, _argumentName?: string): obj is SnapRpc {
    return (
        typeof obj === "function"
    )
}
