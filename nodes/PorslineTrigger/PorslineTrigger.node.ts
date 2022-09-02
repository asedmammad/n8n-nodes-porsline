import { IHookFunctions, IWebhookFunctions } from 'n8n-core';

import {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	INodeCredentialTestResult,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

import { apiRequest, getSurveys } from './GenericFunctions';

export class PorslineTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Porsline Trigger',
		name: 'porslineTrigger',
		icon: 'file:porsline.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '=Survey ID: {{$parameter["surveyId"]}}',
		description: 'Starts the workflow on a porsline survey submission',
		defaults: {
			name: 'Porsline Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'postlineCredentialsApi',
				required: true,
				testedBy: 'testPorslineApiKeyAuth',
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [{ name: 'API Key', value: 'apiKey' }],
				default: 'apiKey',
			},
			{
				displayName: 'Survey Name or ID',
				name: 'SurveyId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getSurveys',
				},
				options: [],
				default: '',
				required: true,
				description:
					'Survey which should trigger workflow on submission. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
		],
	};

	methods = {
		loadOptions: {
			getSurveys,
		},
		credentialTest: {
			async testPorslineApiKeyAuth(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				// Porsline (public) api does not have a generic endpoint to test
				// authentication so we use get folders endpoint

				const credentials = credential.data;

				const options = {
					headers: {
						authorization: `API-Key ${credentials!.apiKey}`,
					},
					uri: 'https://survey.porsline.ir/api/folders/',
					json: true,
				};
				try {
					const response = await this.helpers.request(options);
					if (response.length >= 0) {
						return {
							status: 'Error',
							message: 'Token is not valid.',
						};
					}
				} catch (err) {
					return {
						status: 'Error',
						message: `Token is not valid; ${err.message}`,
					};
				}

				return {
					status: 'OK',
					message: 'Authentication successful!',
				};
			},
		},
	};

	// @ts-ignore (because of request)
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Porsline does not support checking webhooks so we simply return false here
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');

				const surveyId = this.getNodeParameter('surveyId') as string;
				const webhookId = 'n8n-' + Math.random().toString(36).substring(2, 15);

				const endpoint = `surveys/${surveyId}/webhooks/`;

				const body = {
					recipient_type: 5,
					enabled: true,
					webhook_headers: {
						'Content-Type': 'application/json',
					},
					webhook_endpoint: webhookUrl,
					webhook_method: 'POST',
					// "body": "{{all_responder_data_json}}",
					survey_id: surveyId,
					sending_method: 3,
				};

				await apiRequest.call(this, 'POST', endpoint, body);

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = webhookId;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Note: Porsline does not support deleting webhooks so we simply send a request with enabled=false

				const surveyId = this.getNodeParameter('surveyId') as string;

				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					const endpoint = `surveys/${surveyId}/webhooks/`;

					try {
						const body = {
							recipient_type: 5,
							enabled: false,
							webhook_headers: {
								'Content-Type': 'application/json',
							},
							webhook_endpoint: '',
							webhook_method: 'POST',
							survey_id: surveyId,
							sending_method: 3,
						};
						await apiRequest.call(this, 'POST', endpoint, body);
					} catch (error) {
						return false;
					}
					// Remove from the static workflow data so that it is clear
					// that no webhooks are registred anymore
					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		// TODO: Check this against actual webhook call since I could not
		// find webhook input in porsline docs
		if (
			bodyData.form_response === undefined ||
			(bodyData.form_response as IDataObject).definition === undefined ||
			(bodyData.form_response as IDataObject).answers === undefined
		) {
			throw new NodeApiError(this.getNode(), bodyData as JsonObject, {
				message: 'Expected definition/answers data is missing!',
			});
		}

		// Return all the data that got received
		return {
			workflowData: [this.helpers.returnJsonArray([bodyData])],
		};
	}
}
