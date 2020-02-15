import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Button, FormControl, Input, FormLabel, Select } from '@chakra-ui/core'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { isWeb3Injected, web3FromAddress } from '@polkadot/extension-dapp'
import Feature from '../Feature/index'
function StakeForm(props) {
    const listOfUsers = localStorage.getItem('users')
    const users = JSON.parse(listOfUsers)
    console.log('users', users)
    console.log('stepThree', props)
    return (
        <div>
            <div>
                {props.selectedValidators.map(validator => (
                    <Feature
                        title={`${validator.name}`}
                        desc="Validator Being staked on"
                    />
                ))}
            </div>
            <Formik
                initialValues={{
                    stakeAmount: '',
                    confirmation: false,
                }}
                onSubmit={async (values, actions) => {
                    const { stashId } = props.ids
                    const provider = new WsProvider(
                        'wss://kusama-rpc.polkadot.io/'
                    )
                    const api = await ApiPromise.create({ provider })

                    console.log('values', values)
                    // finds an injector for an address
                    const injector = await web3FromAddress(stashId)
                    api.setSigner(injector.signer)

                    // TODO: nominating removes previous nomination: confirmation is needed
                    api.tx.staking
                        .nominate(
                            props.selectedValidators.map(
                                validator => validator.stashId
                            )
                        )
                        .signAndSend(stashId, status => {
                            console.log(
                                'status',
                                JSON.parse(JSON.stringify(status))
                            )
                            props.goToStep(4)
                        })
                        .catch(error => {
                            console.log('Error', error)
                        })
                }}
                validate={values => {
                    const errors = {}
                    if (!values.confirmation) {
                        errors.confirmation = 'Confirmation is required'
                    }
                    return errors
                }}
                render={props => (
                    <Form onSubmit={props.handleSubmit}>
                        <Field
                            name="confirmation"
                            render={({ field, form }) => (
                                <FormControl
                                    isInvalid={
                                        form.errors.stakeAmount &&
                                        form.touched.stakeAmount
                                    }
                                >
                                    <label>
                                        <input
                                            {...field}
                                            type="checkbox"
                                            id="confirmation"
                                        />
                                        <span
                                            style={{
                                                color:
                                                    props.colorMode === 'light'
                                                        ? '#171923'
                                                        : '#fff',
                                                fontSize: 10,
                                                lineHeight: 1,
                                            }}
                                        >
                                            {' '}
                                            I understand that the funds will be
                                            bonded, meaning the tokens would be
                                            locked for a period of time and can
                                            only be redeemed after that period
                                            ends, and could be slashed if the
                                            validators I nominate misbehave
                                        </span>
                                    </label>
                                    <ErrorMessage
                                        style={{ color: 'red' }}
                                        name="confirmation"
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
                            Stake
                        </Button>
                    </Form>
                )}
            />
        </div>
    )
}

export default StakeForm
