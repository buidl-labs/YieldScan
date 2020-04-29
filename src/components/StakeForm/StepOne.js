import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Button, FormControl, FormLabel, Select } from '@chakra-ui/core'

function StakeForm(props) {
    //List of users
    const listOfUsers = localStorage.getItem('users')
    const users = JSON.parse(listOfUsers)
    console.log('users', users)

    return (
        <Formik
            initialValues={{
                stashId: '',
                controllerId: '',
            }}
            onSubmit={(values, actions) => {
                console.log('values', values)
                actions.setSubmitting(false)
                props.nextStep()
                props.onNext(values)
            }}
            validate={values => {
                const errors = {}
                if (!values.stashId) {
                    errors.stashId = 'Stash ID is required!'
                } else if (!values.controllerId) {
                    errors.controllerId = 'Controller ID is required!'
                }
                return errors
            }}
            render={props => (
                <Form onSubmit={props.handleSubmit}>
                    <Field
                        name="stashId"
                        render={({ field, form }) => (
                            <FormControl
                                isInvalid={
                                    form.errors.stashId && form.touched.stashId
                                }
                            >
                                <FormLabel htmlFor="stashId">
                                    Stash ID
                                </FormLabel>
                                <Select
                                    {...field}
                                    id="stashId"
                                    placeholder="Select Stash ID"
                                >
                                    {users.map(user => (
                                        <option
                                            key={user.address}
                                            value={user.address}
                                        >
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
                        )}
                    />
                    <Field
                        name="controllerId"
                        render={({ field, form }) => (
                            <FormControl
                                isInvalid={
                                    form.errors.controllerId &&
                                    form.touched.controllerId
                                }
                            >
                                <FormLabel htmlFor="controllerId">
                                    Controller ID
                                </FormLabel>
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

export default StakeForm
