import React from "react";
import { Heading, Text, Link, Icon } from "@chakra-ui/core";
import {
    VerticalTimeline,
    VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

export default function HowToStake() {
    return (
        <React.Fragment>
            <Heading as="h2" size="xl" textAlign="center" mt={16}>
                How to stake?
            </Heading>
            <Text fontSize="2xl" textAlign="center" mb={16}>
                A step by step guide on how to stake tokens on the{" "}
                <Link
                    href="https://polkadot.network/"
                    color="teal.500"
                    isExternal
                >
                    Polkadot Network
                </Link>
            </Text>

            {/* Steps to stake */}
            <VerticalTimeline layout="1-column" className="py-0">
                {/* Step 1: Create a stash account */}
                <VerticalTimelineElement
                    contentStyle={{
                        background: "transparent",
                        paddingTop: 0,
                        borderRadius: 0
                    }}
                    contentArrowStyle={{
                        borderRight: "7px solid transparent"
                    }}
                    icon={
                        <Heading as="h5" size="sm">
                            1
                        </Heading>
                    }
                    iconStyle={{
                        background: "#319795",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Heading as="h3" size="lg">
                        Create a stash account
                    </Heading>
                    <Text>
                        Stash account holds funds bonded for staking, but
                        delegates some functions to a Controller. To create a
                        stash account, head over to the Accounts section of the
                        Polkadot UI. Click on the “Add account” button. This
                        will open up a form with 5 fields. We’ll ignore the
                        fields under the advanced creation options for the
                        purpose of this tutorial. The first field asks for a
                        “Name”. Enter whatever name you want the account to
                        have. The second field contains an auto-generated
                        “mnemonic seed”. Write this phrase down and keep it
                        safe. Don’t share this with anyone as this will give
                        them access to the funds in your account. Next, you need
                        to choose a strong password. We highly recommend using a
                        password generator to generate a strong password.
                        Needless to say, keep this information safe and secret
                        as well. Now, click on the “Save” button. This will open
                        up a dialog which will ask you to save the backup file
                        for your account in a secure location along with your
                        password as this will allow you to restore your account.
                        Go ahead and click the “Create and backup account”
                        button. This will open a download dialog on your
                        browser. Choose a secure location to store this file and
                        click “Save File”. Your stash account is created and a
                        backup file has been stored your your selected location.
                    </Text>
                </VerticalTimelineElement>

                {/* Step 2: Create a controller account */}
                <VerticalTimelineElement
                    contentStyle={{
                        background: "transparent",
                        paddingTop: 0,
                        borderRadius: 0
                    }}
                    contentArrowStyle={{
                        borderRight: "7px solid transparent"
                    }}
                    icon={
                        <Heading as="h5" size="sm">
                            2
                        </Heading>
                    }
                    iconStyle={{
                        background: "#319795",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Heading as="h3" size="lg">
                        Create a controller account
                    </Heading>
                    <Text>
                        Controller account acts on behalf of the Stash account,
                        signalling decisions about nominating and validating. It
                        sets preferences like payout account and commission. It
                        only needs enough funds to pay transaction fees. The
                        steps to create a controller account are identical to
                        creating a stash account. The only difference is in the
                        usage. For now, just repeat the steps that were used to
                        create the stash account.
                    </Text>
                </VerticalTimelineElement>

                {/* Step 3: Bond your tokens */}
                <VerticalTimelineElement
                    contentStyle={{
                        background: "transparent",
                        paddingTop: 0,
                        borderRadius: 0
                    }}
                    contentArrowStyle={{
                        borderRight: "7px solid transparent"
                    }}
                    icon={
                        <Heading as="h5" size="sm">
                            3
                        </Heading>
                    }
                    iconStyle={{
                        background: "#319795",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Heading as="h3" size="lg">
                        Bond your tokens
                    </Heading>
                    <Text>
                        On the Polkadot UI, go to the “Staking” tab. On the
                        top-left of this section you’ll see a tab labelled
                        “Account actions”. Click on this tab. Next, click on the
                        button labelled “New stake” on your screen. This will
                        open up a form with fields for your stash account,
                        controller account, value to be bonded from the stash
                        account and payment destination. In the stash and
                        controller account fields, select your stash and
                        controller accounts respectively. In the “value bonded”
                        field, enter the amount of tokens that you would like to
                        stake in forthcoming rounds. Lastly, for the “payment
                        destination” select whichever payment destination you
                        like. If you’re unsure just click “Stash account
                        (increase amount at stake)”. Click on the “Bond” button.
                        This will open up an authenication form, enter the
                        password of your stash account and click “Sign and
                        Submit” button. Now, you’re bonded and ready to
                        nominate.
                    </Text>
                </VerticalTimelineElement>

                {/* Step 4: Nominate a validator */}
                <VerticalTimelineElement
                    contentStyle={{
                        background: "transparent",
                        paddingTop: 0,
                        borderRadius: 0
                    }}
                    contentArrowStyle={{
                        borderRight: "7px solid transparent"
                    }}
                    icon={
                        <Heading as="h5" size="sm">
                            4
                        </Heading>
                    }
                    iconStyle={{
                        background: "#319795",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Heading as="h3" size="lg">
                        Nominate a validator
                    </Heading>
                    <Text>
                        Go to the “Staking Overview” tab. You’ll see the list or
                        current validators on the left side. On the right side,
                        you’ll see a list of validators that have signalled
                        their intention to actively participate in the next era.
                        Pick one (or more) of these validators to nominate and
                        copy their address by clicking on the icon. Return to
                        the “Account Actions” screen and you will see your
                        bonded account. Click the “Nominate” button and fill in
                        the blank field with the address of the validator you
                        have chosen. Sign and submit the transaction, and you
                        are now nominating!
                    </Text>
                </VerticalTimelineElement>

                {/* Step 5: Stop nominating */}
                <VerticalTimelineElement
                    contentStyle={{
                        background: "transparent",
                        paddingTop: 0,
                        borderRadius: 0
                    }}
                    contentArrowStyle={{
                        borderRight: "7px solid transparent"
                    }}
                    icon={
                        <Heading as="h5" size="sm">
                            5
                        </Heading>
                    }
                    iconStyle={{
                        background: "#319795",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Heading as="h3" size="lg">
                        Stop nominating
                    </Heading>
                    <Text>
                        To stop nominating, click the “Stop nominating” button.
                        If you want to start nominating again, just repeat step
                        4.
                        <br />
                        Congratulations! You’re now a nominator on the Polkadot
                        Network.
                    </Text>
                </VerticalTimelineElement>

                {/* CTA: Ready to stake? */}
                <VerticalTimelineElement
                    contentStyle={{
                        background: "transparent",
                        paddingTop: 0,
                        borderRadius: 0
                    }}
                    contentArrowStyle={{
                        borderRight: "7px solid transparent"
                    }}
                    icon={
                        <Icon name="check" color="white" />
                    }
                    iconStyle={{
                        background: "#319795"
                    }}
                >
                    <Heading as="h3" size="lg">
                        Ready to stake?
                    </Heading>
                    <Link href="/dashboard" color="teal.500">
                        See how much you could earn
                    </Link>
                </VerticalTimelineElement>
            </VerticalTimeline>
        </React.Fragment>
    );
}
