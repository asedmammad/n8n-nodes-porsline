import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PorslineCredentialsApi implements ICredentialType {
	name = 'porslineCredentialsApi';
	displayName = 'Porsline Credentials API';
	documentationUrl = 'https://developers.porsline.ir/#section/Authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"API-KEY " + $credentials.apiKey}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	// Porsline (public) api does not have a generic endpoint to test
	// authentication so we use get folders endpoint
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://survey.porsline.ir/api/',
			url: 'folders/',
		},
	};
}
