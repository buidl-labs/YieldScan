import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, FormControl, Input, FormLabel, Select } from '@chakra-ui/core';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { isWeb3Injected, web3FromAddress } from '@polkadot/extension-dapp';

function StakeForm(props) {
  //   function validateName(value) {
  //     let error;
  //     if (!value) {
  //       error = 'Name is required';
  //     } else if (value !== 'Naruto') {
  //       error = "Jeez! You're not a fan 😱";
  //     }
  //     return error;
  //   }

  //check whether stash ID and controller ID is same or not

  const listOfUsers = localStorage.getItem('users');
  const users = JSON.parse(listOfUsers);
  console.log('users', users);

  return (
    <Formik
      initialValues={{
        stashId: '',
        controllerId: '',
        stakeAmount: '',
        confirmation: false
      }}
      onSubmit={async (values, actions) => {
        const provider = new WsProvider('wss://kusama-rpc.polkadot.io/');
        const api = await ApiPromise.create({ provider });
        //Add logic for staking via polkadot extension here

        console.log('values', values);
        // finds an injector for an address
        const injector = await web3FromAddress(values.controllerId);
        api.setSigner(injector.signer);

        //check is already bonded or not
        api.tx.staking
          //   .bond(values.controllerId, values.stakeAmount * 10 ** 12, 0)
          .bondExtra(values.stakeAmount * 10 ** 12)
          .signAndSend(values.stashId, status => {
            console.log('status', JSON.parse(JSON.stringify(status)));
          })
          .catch(error => {
            console.log('Error', error);
          });

        api.tx.staking
          //   .bond(values.controllerId, values.stakeAmount * 10 ** 12, 0)
          //   .bondExtra(values.stakeAmount * 10 ** 12)
          .nominate(
            props.selectedValidators.map(validator => validator.stashId)
          )
          .signAndSend(values.stashId, status => {
            console.log('status', JSON.parse(JSON.stringify(status)));
          })
          .catch(error => {
            console.log('Error', error);
          });

        // .bond(controllerId, bondValue, 'Staked')
        // .bondExtra(bondValue)
        // .nominate(['D5Xo7N2jginhYchuMNud2dYtby899koFcaRo2YWNmUquo5H'])
        //if yes execute extra bonded
        //after that nominate the selected validator
        // setTimeout(() => {
        //   alert(JSON.stringify(values, null, 2));
        //   actions.setSubmitting(false);
        // }, 1000);
      }}
      validate={values => {
        const errors = {};
        if (!values.stashId) {
          errors.email = 'Stash ID is required!';
        } else if (!values.controllerId) {
          errors.controllerId = 'Controller ID is required!';
        } else if (!values.stakeAmount) {
          errors.stakeAmount = 'Stake Amount is required!';
        } else if (!values.confirmation) {
          errors.confirmation = 'Confirmation is required';
        }
        return errors;
      }}
      render={props => (
        <Form onSubmit={props.handleSubmit}>
          <Field
            name="stashId"
            render={({ field, form }) => (
              <FormControl
                isInvalid={form.errors.stashId && form.touched.stashId}
              >
                <FormControl>
                  <FormLabel htmlFor="stashId">Stash ID</FormLabel>
                  <Select
                    onChange={props.handleChange}
                    id="stashId"
                    placeholder="Select Stash ID"
                    value={props.values.stashId}
                  >
                    {users.map(user => (
                      <option key={user.address} value={user.address}>
                        {user.meta.name} {user.address}
                      </option>
                    ))}
                  </Select>
                  <ErrorMessage
                    style={{ color: 'red' }}
                    name="stashId"
                    component="div"
                  />
                </FormControl>
              </FormControl>
            )}
          />
          <Field
            name="controllerId"
            render={({ field, form }) => (
              <FormControl
                isInvalid={
                  form.errors.controllerId && form.touched.controllerId
                }
              >
                <FormControl>
                  <FormLabel htmlFor="controllerId">Controller ID</FormLabel>
                  <Select
                    onChange={props.handleChange}
                    id="controllerId"
                    placeholder="Select Controller ID"
                    value={props.values.controllerId}
                  >
                    {users.map(user => (
                      <option value={user.address}>
                        {user.meta.name} {user.address}
                      </option>
                    ))}
                  </Select>
                  <ErrorMessage
                    style={{ color: 'red' }}
                    name="controllerId"
                    component="div"
                  />
                </FormControl>
              </FormControl>
            )}
          />
          <Field
            name="stakeAmount"
            render={({ field, form }) => (
              <FormControl
                isInvalid={form.errors.stakeAmount && form.touched.stakeAmount}
              >
                <FormControl>
                  <FormLabel htmlFor="stakeAmount">Stake Amount</FormLabel>
                  <Input
                    {...field}
                    type="number"
                    id="stakeAmount"
                    placeholder="Stake Amount"
                  />
                  <ErrorMessage
                    style={{ color: 'red' }}
                    name="stakeAmount"
                    component="div"
                  />
                </FormControl>
              </FormControl>
            )}
          />
          <Field
            name="confirmation"
            render={({ field, form }) => (
              <FormControl
                isInvalid={form.errors.stakeAmount && form.touched.stakeAmount}
              >
                <label>
                  <input {...field} type="checkbox" id="confirmation" />
                  <span
                    style={{ color: '#171923', fontSize: 10, lineHeight: 1 }}
                  >
                    {' '}
                    I understand that the funds will be bonded, meaning the
                    tokens would be locked for a period of time and can only be
                    redeemed after that period ends, and could be slashed if the
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
  );
}

export default StakeForm;
