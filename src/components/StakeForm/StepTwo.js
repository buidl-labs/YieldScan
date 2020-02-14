import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import {
    Button,
    FormControl,
    Input,
    FormHelperText,
    InputGroup,
    InputRightAddon,
} from '@chakra-ui/core'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3FromAddress } from '@polkadot/extension-dapp'

function getFreeBalanceOnce() {
    let callOnce = false
    let freeBalance
    return async function(stashId) {
        const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
        const api = await ApiPromise.create({ provider })
        if (callOnce) {
            return freeBalance
        } else {
            try {
                const result = await api.query.balances.freeBalance(stashId)
                freeBalance = parseFloat(
                    (JSON.parse(JSON.stringify(result)) / 10 ** 12).toFixed(3)
                )
                callOnce = true
                return freeBalance
            } catch (err) {
                console.error('error', err)
            }
        }
    }
}

function BondForm(props) {
    const callGetFreeBalanceOnce = getFreeBalanceOnce()
    console.log('Props', props)
    return (
        <Formik
            initialValues={{
                bondValue: '',
            }}
            onSubmit={async (values, actions) => {
                const { stashId, controllerId } = props.ids
                const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
                const api = await ApiPromise.create({ provider })
                //Add logic for staking via polkadot extension here

                console.log('values', values)

                // finds an injector for an address
                const injector = await web3FromAddress(stashId)
                api.setSigner(injector.signer)

                //TODO: check is balance available for bonding
                const bonded = values.bondValue * 10 ** 12

                //check whether user has already bonded some amt or not
                const ledger = await api.query.staking.ledger(stashId)

                if (!ledger) {
                    console.log('api.tx.staking.bond')
                    api.tx.staking
                        .bond(controllerId, bonded, 0)
                        .signAndSend(stashId, status => {
                            console.log(
                                'status',
                                JSON.parse(JSON.stringify(status))
                            )
                            props.goToStep(3)
                            actions.setSubmitting(false)
                        })
                        .catch(error => {
                            console.log('Error', error)
                        })
                } else {
                    console.log('api.tx.staking.bondExtra')
                    api.tx.staking
                        .bondExtra(bonded)
                        .signAndSend(stashId, status => {
                            console.log(
                                'status',
                                JSON.parse(JSON.stringify(status))
                            )
                            props.goToStep(3)
                            actions.setSubmitting(false)
                        })
                        .catch(error => {
                            console.log('Error', error)
                        })
                }
            }}
            validate={async values => {
                //TODO: might lead to unexpected user behaviour(to keep in mind)
                const errors = {}
                const freeBalance = await callGetFreeBalanceOnce(
                    props.ids.stashId
                )

                if (values.bondValue > freeBalance) {
                    errors.bondValue = `Your current free balance is: ${freeBalance} KSM, you can't bond value of more then your free balance!`
                } else if (!values.bondValue) {
                    errors.bondValue = 'Bond Value is required!'
                }
                return errors
            }}
            render={props => (
                <Form onSubmit={props.handleSubmit}>
                    <Field
                        name="bondValue"
                        render={({ field, form }) => (
                            <FormControl
                                isInvalid={
                                    form.errors.bondValue &&
                                    form.touched.bondValue
                                }
                            >
                                <InputGroup>
                                    <Input
                                        {...field}
                                        placeholder="Bond Amount"
                                        variant="filled"
                                        type="number"
                                        min="0"
                                        step="0.000000000001"
                                        max="999999999999999"
                                        textAlign="center"
                                        roundedLeft="2rem"
                                    />
                                    <InputRightAddon
                                        children="KSM"
                                        backgroundColor="teal.500"
                                        roundedRight="2rem"
                                    />
                                </InputGroup>
                                <FormHelperText id="email-helper-text">
                                    Amount Allocation for staking
                                </FormHelperText>
                                <ErrorMessage
                                    style={{ color: 'red' }}
                                    name="bondValue"
                                    component="div"
                                />
                            </FormControl>
                        )}
                    />
                    <Button
                        style={{ float: 'right' }}
                        mt={4}
                        variantColor="teal"
                        isLoading={props.isSubmitting}
                        type="submit"
                    >
                        Next
                    </Button>
                </Form>
            )}
        />
    )
}

export default BondForm
