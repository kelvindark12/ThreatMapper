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


import * as runtime from '../runtime';
import type {
  ApiDocsBadRequestResponse,
  ApiDocsFailureResponse,
  ModelMessageResponse,
  ModelScanReportFieldsResponse,
} from '../models';
import {
    ApiDocsBadRequestResponseFromJSON,
    ApiDocsBadRequestResponseToJSON,
    ApiDocsFailureResponseFromJSON,
    ApiDocsFailureResponseToJSON,
    ModelMessageResponseFromJSON,
    ModelMessageResponseToJSON,
    ModelScanReportFieldsResponseFromJSON,
    ModelScanReportFieldsResponseToJSON,
} from '../models';

/**
 * CommonApi - interface
 * 
 * @export
 * @interface CommonApiInterface
 */
export interface CommonApiInterface {
    /**
     * Get End User License Agreement
     * @summary Get End User License Agreement
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CommonApiInterface
     */
    eulaRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ModelMessageResponse>>;

    /**
     * Get End User License Agreement
     * Get End User License Agreement
     */
    eula(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ModelMessageResponse>;

    /**
     * Get all the fields available in all the scan reports
     * @summary Get Scan Report Fields
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof CommonApiInterface
     */
    getScanReportFieldsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ModelScanReportFieldsResponse>>;

    /**
     * Get all the fields available in all the scan reports
     * Get Scan Report Fields
     */
    getScanReportFields(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ModelScanReportFieldsResponse>;

}

/**
 * 
 */
export class CommonApi extends runtime.BaseAPI implements CommonApiInterface {

    /**
     * Get End User License Agreement
     * Get End User License Agreement
     */
    async eulaRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ModelMessageResponse>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/deepfence/end-user-license-agreement`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ModelMessageResponseFromJSON(jsonValue));
    }

    /**
     * Get End User License Agreement
     * Get End User License Agreement
     */
    async eula(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ModelMessageResponse> {
        const response = await this.eulaRaw(initOverrides);
        return await response.value();
    }

    /**
     * Get all the fields available in all the scan reports
     * Get Scan Report Fields
     */
    async getScanReportFieldsRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ModelScanReportFieldsResponse>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_token", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/deepfence/scan/results/fields`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ModelScanReportFieldsResponseFromJSON(jsonValue));
    }

    /**
     * Get all the fields available in all the scan reports
     * Get Scan Report Fields
     */
    async getScanReportFields(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ModelScanReportFieldsResponse> {
        const response = await this.getScanReportFieldsRaw(initOverrides);
        return await response.value();
    }

}
