import React, { useState } from 'react'
import StepWizard from 'react-step-wizard'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'

export default function Steps(props) {
    const [ids, setIds] = useState({
        controllerId: '',
        stashId: '',
    })

    const onStepOneCompletion = values => {
        setIds({
            controllerId: values.controllerId,
            stashId: values.stashId,
        })
    }

    return (
        <StepWizard
            transitions={{
                from: {
                    opacity: 0,
                },
                to: {
                    opacity: 1,
                },
            }}
        >
            <StepFour
                onModalClose={props.onModalClose}
                setShowBottomCart={props.setShowBottomCart}
                selectedValidators={props.selectedValidators}
                colorMode={props.colorMode}
            />
            <StepOne onNext={onStepOneCompletion} />
            <StepTwo ids={ids} />
            <StepThree
                ids={ids}
                selectedValidators={props.selectedValidators}
                colorMode={props.colorMode}
            />
        </StepWizard>
    )
}

// function One(props) {
//   console.log('one', props);
//   return <div>One</div>;
// }
