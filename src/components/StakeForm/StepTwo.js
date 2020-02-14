import React from "react";
import { Formik, Form, Field } from "formik";
import {
  Button,
  FormControl,
  Input,
  FormHelperText,
  InputGroup,
  InputRightAddon
} from "@chakra-ui/core";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { isWeb3Injected, web3FromAddress } from "@polkadot/extension-dapp";

function BondForm(props) {
  const listOfUsers = localStorage.getItem("users");
  const users = JSON.parse(listOfUsers);

  console.log("Props", props);
  return (
    <Formik
      initialValues={{
        bondValue: ""
      }}
      onSubmit={async (values, actions) => {
        const { stashId, controllerId } = props.ids;
        const provider = new WsProvider("wss://kusama-rpc.polkadot.io/");
        const api = await ApiPromise.create({ provider });
        //Add logic for staking via polkadot extension here

        console.log("values", values);

        // finds an injector for an address
        const injector = await web3FromAddress(stashId);
        api.setSigner(injector.signer);

        const bonded = values.bondValue * 10 ** 12;

        //check whether user has already bonded some amt or not
        const ledger = await api.query.staking.ledger(stashId);

        if (!ledger) {
          console.log("api.tx.staking.bond");
          api.tx.staking
            .bond(controllerId, bonded, 0)
            .signAndSend(stashId, status => {
              console.log("status", JSON.parse(JSON.stringify(status)));
              props.goToStep(3);
              actions.setSubmitting(false);
            })
            .catch(error => {
              console.log("Error", error);
            });
        } else {
          console.log("api.tx.staking.bondExtra");
          api.tx.staking
            .bondExtra(bonded)
            .signAndSend(stashId, status => {
              console.log("status", JSON.parse(JSON.stringify(status)));
              props.goToStep(3);
              actions.setSubmitting(false);
            })
            .catch(error => {
              console.log("Error", error);
            });
        }

        //Step two
        //check whether user has given inputted amt amount or not for bonding
        //if yes --> proceed
        //else --> show error "Not enough balance"

        //Step Three
        //Nominate selected validators
        //show success message if everything goes alright
        //else --> show whatever error occurred

        // //check if some amount is already bonded or not
        // //if yes then

        // //check is already bonded or not
        // api.tx.staking
        //   .bond(values.controllerId, values.stakeAmount * 10 ** 12, 0)
        //   .bondExtra(values.stakeAmount * 10 ** 12)
        //   .signAndSend(values.stashId, status => {
        //     console.log('status', JSON.parse(JSON.stringify(status)));
        //   })
        //   .catch(error => {
        //     console.log('Error', error);
        //   });

        // api.tx.staking
        //   //   .bond(values.controllerId, values.stakeAmount * 10 ** 12, 0)
        //   //   .bondExtra(values.stakeAmount * 10 ** 12)
        //   .nominate(
        //     props.selectedValidators.map(validator => validator.stashId)
        //   )
        //   .signAndSend(values.stashId, status => {
        //     console.log('status', JSON.parse(JSON.stringify(status)));
        //   })
        //   .catch(error => {
        //     console.log('Error', error);
        //   });

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
        if (!values.bondValue) {
          errors.bondValue = "Bond Value is required!";
        }
        // TODO: also check that if bonded is available in balance, if not show error
        return errors;
      }}
      render={props => (
        <Form onSubmit={props.handleSubmit}>
          <Field
            name="bondValue"
            render={({ field, form }) => (
              <FormControl
                isInvalid={form.errors.bondValue && form.touched.bondValue}
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
              </FormControl>
            )}
          />
          <Button
            style={{ float: "right" }}
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
  );
}

export default BondForm;
