/* tslint:disable */
/* eslint-disable */
/**
 * Deepfence ThreatMapper
 * Deepfence Runtime API provides programmatic control over Deepfence microservice securing your container, kubernetes and cloud deployments. The API abstracts away underlying infrastructure details like cloud provider,  container distros, container orchestrator and type of deployment. This is one uniform API to manage and control security alerts, policies and response to alerts for microservices running anywhere i.e. managed pure greenfield container deployments or a mix of containers, VMs and serverless paradigms like AWS Fargate.
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: community@deepfence.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ModelRegisterInvitedUserRequest
 */
export interface ModelRegisterInvitedUserRequest {
    /**
     * 
     * @type {string}
     * @memberof ModelRegisterInvitedUserRequest
     */
    code: string;
    /**
     * 
     * @type {string}
     * @memberof ModelRegisterInvitedUserRequest
     */
    first_name: string;
    /**
     * 
     * @type {boolean}
     * @memberof ModelRegisterInvitedUserRequest
     */
    is_temporary_password?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ModelRegisterInvitedUserRequest
     */
    last_name: string;
    /**
     * 
     * @type {string}
     * @memberof ModelRegisterInvitedUserRequest
     */
    namespace: string;
    /**
     * 
     * @type {string}
     * @memberof ModelRegisterInvitedUserRequest
     */
    password: string;
}

/**
 * Check if a given object implements the ModelRegisterInvitedUserRequest interface.
 */
export function instanceOfModelRegisterInvitedUserRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "code" in value;
    isInstance = isInstance && "first_name" in value;
    isInstance = isInstance && "last_name" in value;
    isInstance = isInstance && "namespace" in value;
    isInstance = isInstance && "password" in value;

    return isInstance;
}

export function ModelRegisterInvitedUserRequestFromJSON(json: any): ModelRegisterInvitedUserRequest {
    return ModelRegisterInvitedUserRequestFromJSONTyped(json, false);
}

export function ModelRegisterInvitedUserRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModelRegisterInvitedUserRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'code': json['code'],
        'first_name': json['first_name'],
        'is_temporary_password': !exists(json, 'is_temporary_password') ? undefined : json['is_temporary_password'],
        'last_name': json['last_name'],
        'namespace': json['namespace'],
        'password': json['password'],
    };
}

export function ModelRegisterInvitedUserRequestToJSON(value?: ModelRegisterInvitedUserRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'code': value.code,
        'first_name': value.first_name,
        'is_temporary_password': value.is_temporary_password,
        'last_name': value.last_name,
        'namespace': value.namespace,
        'password': value.password,
    };
}

