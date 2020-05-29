import React from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionPanel,
    AccordionIcon,
    Heading,
    Box,
    Link,
} from '@chakra-ui/core'

const data = [
	{
		id: 1,
		question: "Why stake?",
		answer: `10% inflation/year when the network launches\n 50% targeted active staking\n ~20% annual return`,
		link: {
			url: "https://wiki.polkadot.network/docs/en/learn-staking#why-stake",
			content: "Learn more about why stake",
			isExternal: true
		}
	},
	{
		id: 2,
		question: "What is Polkadot?",
		answer:
			"Polkadot is a protocol that allows independent blockchains to exchange information.",
		link: {
			url:
				"https://wiki.polkadot.network/docs/en/learn-introduction#what-is-polkadot",
			content: "Learn more about Polkadot",
			isExternal: true
		}
	},
	{
		id: 4,
		question: "What is Kusama?",
		answer:
			'Kusama is a "canary network" for Polkadot, an early unaudited release of the code that is available first and holds real economic value.',
		link: {
			url: "https://wiki.polkadot.network/docs/en/kusama-index",
			content: "Learn more about Kusama",
			isExternal: true
		}
	},
	{
		id: 3,
		question: "How does staking work in polkadot and what is NPoS?",
		answer:
			"Polkadot uses NPoS (Nominated Proof-of-Stake) as its mechanism for selecting the validator set. It is designed with the roles of validators and nominators, to maximize chain security.",
		link: {
			url:
				"https://wiki.polkadot.network/docs/en/learn-staking#how-does-staking-work-in-polkadot",
			content: "Learn more about staking",
			isExternal: true
		}
	},
	{
		id: 4,
		question: "What are nominators?",
		answer:
			"Nominators secure the relay chain by selecting good validators and staking KSM/DOTs.",
		link: {
			url: "https://wiki.polkadot.network/docs/en/maintain-nominator",
			content: "Learn more about nominators",
			isExternal: true
		}
	},
	{
		id: 5,
		question: "What are validators?",
		answer:
			"Validators secure the relay chain by staking KSM/DOTs, validating proofs from collators and participating in consensus with other validators.",
		link: {
			url: "https://wiki.polkadot.network/docs/en/maintain-validator",
			content: "Learn more about validators",
			isExternal: true
		}
	},
	{
		id: 6,
		question: "How to stake?",
		answer:
			"In order to stake KSM/DOTs, the first step is to create stash and controller accounts. Next bond the KSM/DOTs of the stash account. Select the controller. Now you're ready to stake KSM/DOTs as a nominator!",
		link: {
			url:
				"https://wiki.polkadot.network/docs/en/maintain-guides-how-to-nominate-alexander",
			content: "Learn more about how to stake",
			isExternal: true
		}
	},
	{
		id: 7,
		question: "How are rewards calculated?",
		answer:
			"We take into account user's budget along with on-chain information about the validators like commission, total stake and previous era points to calculate expected earnings.",
		link: {
			url:
				"https://github.com/buidl-labs/YieldScan/wiki/Rewards-Calculation-Logic",
			content: "View rewards calculation logic wiki",
			isExternal: true
		}
	},
	{
		id: 8,
		question: "How do you calculate the risk score for validators?",
		answer:
			"We on chain information about the validators like Own stake, Other stake, Number of backers, Number of slashes and Active validation time → no of eras validated to determine risk scores for validators.",
		link: {
			url: "https://github.com/buidl-labs/YieldScan/wiki/Risk-Score-Logic",
			content: "View risk score logic wiki",
			isExternal: true
		}
	}
];

class FAQs extends React.Component {
    render() {
        return (
            <Accordion defaultIndex={[0]} allowMultiple>
                {data.map(data => (
                    <AccordionItem key={data.id} py={4}>
                        <AccordionHeader>
                            <Box flex="1" textAlign="left">
                                <Heading as="h5" size="sm" textAlign="left">
                                    Q. {data.question}
                                </Heading>
                            </Box>
                            <AccordionIcon />
                        </AccordionHeader>
                        <AccordionPanel pb={4}>
                            A. {data.answer}{' '}
                            {data.link !== undefined ? (
                                <Link
                                    href={data.link.url}
                                    color="teal.500"
                                    isExternal={
                                        !!data.link.isExternal
                                    }
                                >
                                    {data.link.content}
                                </Link>
                            ) : (
                                ''
                            )}
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        )
    }
}

export default FAQs
