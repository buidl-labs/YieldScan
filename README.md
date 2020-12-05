# YieldScan
Scanning yield on nominated proof-of-stake networks. Starting with Kusama.

## Table of contents
  - [Currently supported networks](#supported_networks)
  - [Description](#description)
  - [Usage](#usage)
      - [Pre-requisites](#usage-pre-requisites)
      - [Network Details](#network-details)
      - [Returns Calculator](#calculator)
  - [Development](#development)
      - [Pre-requisites](#development-pre-requisites)
      - [Installation Instructions](#installation)
      - [Dependencies](#dependencies)
  - [Gratitude](#gratitude)

## Currently supported networks <a name = "supported_networks"></a>
- [Kusama Network](https://kusama.network/)

## Description <a name = "description"></a>
We aim to solve the problems of information asymmetry and lack of transparency that are faced by the Polkadot community in identifying returns on staking, which incurs time and capital costs to nominators in taking staking decisions.

This project is funded and supported by the [Web3 Foundation](https://web3.foundation/) - under [Wave 6](https://github.com/w3f/General-Grants-Program/blob/master/grants/accepted_grant_applications.md#wave-6).

## Usage <a name = "usage"></a>

### Pre-requisites <a name = "usage-pre-requisites"></a>
- PolkadotJS browser extension
- At least one account on Kusama with enough balance to pay for transaction fees and bond funds.

Currently, the app can be used on https://yieldscan.onrender.com/.

> :warning: **IMPORTANT:** Please note that this project is still under development and bugs and issues are to be expected.
>
> Borrowing from Kusama's tagline - "**Expect Chaos**"

The project is broadly divided into 2 sections - **Network details** and **Returns Calculator**.

### Network Details <a name = "network-details"></a>
The network details section of the app contains collated information about validators and nominators. For details, view the [Network Details Overview Wiki](https://github.com/buidl-labs/YieldScan/wiki/Network-Details-Overview)

![Network Details - Nominators](https://i.imgur.com/Mzj0hh8.png)

![Network Details - Validators](https://i.imgur.com/55gI1tN.png)

### Returns Calculator <a name = "calculator"></a>
The returns calculator allows users to see their potential daily earnings by entering their budget and selecting their risk preference and reduces cognitive load involved with staking. For details on how to use the calculator UI, view [Returns Calculator Wiki](https://github.com/buidl-labs/YieldScan/wiki/Returns-Calculator)

![Returns Calculator](https://i.imgur.com/y0YLO8i.png)

## Development <a name = "development"></a>

### Pre-requisites <a name = "development-pre-requisites"></a>

- [git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/getting-started/install#global-install)

### Installation Instructions <a name = "installation"></a>
1. Clone into the repository
```
git clone https://github.com/buidl-labs/YieldScan.git
cd YieldScan
```

2. Install dependencies
```
yarn install
```

3. Start the development server

```
yarn start
```

### Dependencies <a name = "dependencies"></a>

This project relies on [polkadot-chains-indexer](https://github.com/buidl-labs/polkadot-chains-indexer) for it's backend.

## Gratitude <a name = "gratitude"></a>

![](https://github.com/buidl-labs/polkadot-chains-indexer/blob/master/.github/web3%20foundation_grants_badge_black.png)
