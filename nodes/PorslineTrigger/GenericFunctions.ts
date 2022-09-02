import { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions } from 'n8n-core';

import { INodePropertyOptions, NodeApiError } from 'n8n-workflow';

import { OptionsWithUri } from 'request';

import { IDataObject } from 'n8n-workflow';

/**
 * Make an API request to Porsline
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: object,
	query?: IDataObject,
	// tslint:disable-next-line:no-any
): Promise<any> {
	const options: OptionsWithUri = {
		headers: {},
		method,
		body,
		qs: query,
		uri: `https://survey.porsline.ir/api/${endpoint}`,
		json: true,
	};

	query = query || {};

	try {
		return await this.helpers.requestWithAuthentication.call(this, 'porslineCredentialsApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

/**
 * Returns all the available surveys
 *
 * @export
 * @param {ILoadOptionsFunctions} this
 * @returns {Promise<INodePropertyOptions[]>}
 */
export async function getSurveys(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	// NOTE: Could not find an endpoint to get surveys from porsline
	const returnData: INodePropertyOptions[] = [];
	return returnData;
}
