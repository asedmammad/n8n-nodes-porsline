# n8n-nodes-porsline [WIP]

This is a work in progress n8n community node. It lets you use _porsline survey_ in your n8n workflows.

_Porsline survey_ is _an online survey service by [porsline.ir](https://porsline.ir/)_.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)  

## Installation

To install this community node in your n8n instance:

- Go to **Settings** > **Community Nodes**
- Select **Install a community node**
- Type in `n8n-nodes-porsline` and hit **Install**

For more information on installing community nodes, visit [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This n8n trigger node allows processing porsline survey results as they arrive. It needs porsline [webhook feature](https://developers.porsline.ir/#tag/webhook) to be available. For more information on webhook feature availability refer to [porsline pricing](https://porsline.ir/pricing).

## Credentials

Porsline requires an `API Key` to access to its APIs. You can create an API key [here](https://survey.porsline.ir/auth/#/profile/security).

## Compatibility

This n8n node is being tested against n8n version `0.193.3`. Feel free to open an issue if you encounter any incompatibilities in other versions.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [porsline api documentation](https://developers.porsline.ir)

