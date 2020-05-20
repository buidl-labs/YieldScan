# YieldScan
Scanning yield on nominated proof-of-stake networks. Starting with Kusama.

## Table of contents
  - [Currently supported networks](#supported_networks)
  - [Description](#description)
  - [Usage](#usage)
      - Pre-requisites
      - Network Details
      - Returns Calculator
  - [Reward Calculation Logic](#rewards)
    - Inputs
    - Output
    - Logic
  - [Risk Score Logic](#risk)
    - Inputs
    - Output
    - Key insights
    - Final Logic
  - [✍️ Authors](#authors)

## Currently supported networks <a name = "supported_networks"></a>
- [Kusama Network](https://kusama.network/)

## Description <a name = "description"></a>
We aim to solve the problems of information asymmetry and lack of transparency that are faced by the Polkadot community in identifying returns on staking, which incurs time and capital costs to nominators in taking staking decisions.

This project is funded and supported by the [Web3 Foundation](https://web3.foundation/) - under [Wave 6](https://github.com/w3f/General-Grants-Program/blob/master/grants/accepted_grant_applications.md#wave-6).

## Usage <a name = "usage"></a>

### Pre-requisites
- PolkadotJS browser extension
- At least one account on Kusama with enough balance to pay for transaction fees and bond funds.

Currently, the app can be used on https://yieldscan.surge.sh/, but the domain is likely to change very soon and shall be updated here.

> :warning: **IMPORTANT:** Please note that this project is still under development and bugs and issues are to be expected.
>
> Borrowing from Kusama's tagline - "**Expect Chaos**"

The project is broadly divided into 2 sections - **Network details** and **Returns Calculator**.

### Network Details
The network details section of the app contains collated information about validators and nominators.

**Nominators Tab**

The nominators tab contains information about approximate daily earnings, number of nominations (i.e. number of validators they're backing) and how much amount they have staked currently.

![Network Details - Nominators](https://i.imgur.com/Mzj0hh8.png)

**Validators Tab**

The validators tab contains collated on-chain information about the validators and allows users to filter validators by:

- **Number of nominators**
- **Own stake**
- **Other stake**
- **Commission**
- **Risk Level** (See [Risk Score Logic](#Risk-Score-Logic) for details on how this is calculated)

![Network Details - Validators](https://i.imgur.com/55gI1tN.png)

#### Filtering Mechanism Details

The following is a detailed explanation of what each attribute implies in terms of risk and reward. This can be useful for those users who prefer a DYOR approach to staking.



- **Number of nominators**
    
    Higher number of nominators indicates more people putting trust on the validator, but if too many people are staking on the same validator, it can lead to centralization and might also lead to reduced reward - because usually increased number of nominators leads to increased stake - but by no means is this necessary.

- **Own stake**

    Own stake is proportional to "skin-in-the-game" of the validator, but inversely proportional to reward.

- **Other stake**
    
    Higher stake by others indicates trustworthiness, but also decreases ROI.

- **Commission**

    Lower commission = more rewards given out to community, but some people may argue that when commission is too low, the validator is causing harm to smaller validators and hence might want to filter validators by customizing the minimum and maximum commission.

- **Risk level**
    
    We've used on-chain information like own stake, other stake, number of nominations, number of slashes, et al. to develop a risk score which rates validators between 0 to 1, 0 being lowest risk and 1 being highest risk.
    
    The filter mechanism allows users to put a maximum cap on the risk level to filter validators according to their personal risk appetite.
    
    For more details on how risk score is calculated, see [Risk Score Logic](#Risk-Score-Logic).

### Returns Calculator
The returns calculator allows users to see their potential daily earnings by entering their budget and selecting their risk preference.

 - Just **enter your budget** in KSM
 - **Select a risk level** you're comfortable with
 - **Click calculate** to get the expected daily earnings on the right side
 - If you want to see the returns for a different budget and/or risk preference, just change the inputs and click calculate again.
     
     When you're ready to start investing, just **click the "Start investing button"**.

![Returns Calculator](https://i.imgur.com/y0YLO8i.png)

- This will lead you to the suggested validators page where you can see details about which validators you're about to stake on along with the staking amount used for calculating returns and the risk score of the validators.
- If you're satisfied with the options, **move to the next step by clicking proceed**. 

    If you want to **customize** the validators, just **click the edit validators button**.

![Suggested Validators](https://i.imgur.com/4IrIORh.png)

- If you **clicked proceed, skip this part** and move to the next one. 

    If you chose to customize validators, you will be taken to edit validators page with the current selection which were recommended by the system.

- **Customize your selection** by checking the boxes for the validators you want to nominate and unchecking for the ones that you don't.
- When you're ready, **click proceed**.

![Edit Validators](https://i.imgur.com/Js9bHHv.png)

You will be prompted for connecting your PolkadotJS wallet extension
- If you already have the extension, **click on "I already have the extension"**.

    You will be prompted by PolkadotJS for authorization - to allow YieldScan to retrieve your account information, **click the "Yes, allow application..." button**

- If you don't have the extension, **click on "What extension?"**
    - This will redirect you to PolkadotJS browser extension which you can then add to your browser.
    - Once you have the extension, return to the Wallet Connection page and **click on "I already have the extension"**

![Wallet Connection](https://i.imgur.com/BMPtOwA.png)

This should lead you to the confirmation page where you'll be given a final chance to review your preferences before investing your tokens.

- **Select your stash and controller accounts.**
    - **Stash:** This account holds funds bonded for staking, but delegates some functions to a Controller. As a result, you may actively participate with a Stash key kept in a cold wallet, meaning it stays offline all the time. 
    - **Controller:** This account acts on behalf of the Stash account, signalling decisions about nominating. It set preferences like payout account.  It only needs enough funds to pay transaction fees.

    For more info on accounts, view [Accounts - Polkadot Wiki](https://wiki.polkadot.network/docs/en/learn-staking#accounts).

- **Check the delcaration box**
- **Click submit**
- You'll be prompted by PolkadotJS wallet to sign the transaction for staking.

    **Enter your password and sign the transaction.**
- Congratulations, you're now participating on the network as a nominator.

> :warning: **IMPORTANT:** Since the project is currently under development, there's no changes that occur on the UI after submitting the transaction - to see the hash for the transaction, open your browser console and you should be able to find the hash starting with "0x".
>
> To see if the transaction succeeded or not, you could use Polkascan - https://polkascan.io/pre/kusama/transaction/<insert transaction hash>
>
> We'll be adding a nominator's dashboard UI for users to manage stake in Milestone 2 which will address this concern.

![Confirmation UI](https://i.imgur.com/TWBQGim.png)

## Reward Calculation Logic <a name = "rewards"></a>
### Inputs

- Total era points for given era ( `net_points` )
- Era points for given validator in that era ( `points` )
- Total rewards (in KSM) for given era ( `net_rewards` )
- Commission for given validator in % ( `commission` )
- Total stake on the validator in KSM ( `total_stake` )
- Stake Amount ( `stake_amount` )

### Output

- Expected Daily Earning in KSM ( `expected_daily_earning` )

### Logic

First, we calculate the `pool_reward` for given validator in the given era:

```
pool_reward = ( points / net_points ) * net_rewards
```

The `pool_reward` is determined for the past 4 eras for each validator and summed up. Let's call it `summation_pool_reward`.

Next, we determine the fraction of the pool which the user will hold if they stake `stake_amount` KSM on given validator. Let's call this fraction `user_stake_fraction`.

```
user_stake_fraction = stake_amount / ( stake_amount + total_stake )
```

Finally, to determine `expected_daily_earning`, we subtract commission from `summation_pool_reward` and multiply it with `user_stake_fraction`:

```
expected_daily_earning = user_stake_fraction * ( summation_pool_reward * ( 1 - ( commission / 100 ) ) )
```



## Risk Score Logic <a name = "risk"></a>
### Inputs

- Own stake ( o )
- Other stake ( e )
- Number of backers ( n )
- Number of slashes ( s )
- Active validation time → no of eras validated ( t )

### Output

- Risk score ( r )

### Key insights

- o ∝ 1/r
- e ∝ 1/r
- n ∝ 1/r
- s ∝ r

### Final Logic

![](https://i.imgur.com/RYrI6ei.png)

## ✍️ Authors <a name = "authors"></a>

-   [@prastut](https://github.com/prastut/)
-   [@sahil1995](https://github.com/sahilnanda1995)
-   [@bhaskarSingh](https://github.com/bhaskarSingh/)
-   [@saumyakaran](https://github.com/saumyakaran/)
