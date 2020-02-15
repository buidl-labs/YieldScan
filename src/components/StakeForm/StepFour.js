import React from 'react'
import './stake.css'

export default function StepFour(props) {
    return (
        <div>
            <div class="success-checkmark">
                <div class="check-icon">
                    <span class="icon-line line-tip"></span>
                    <span class="icon-line line-long"></span>
                    <div class="icon-circle"></div>
                    <div class="icon-fix"></div>
                </div>
            </div>
            <p
                style={{
                    color: props.colorMode === 'light' ? '#3c393c' : '#fff',
                }}
                className="success-para"
            >
                Yay! You have successfully nominated validator{' '}
                <span
                    style={{
                        color:
                            props.colorMode === 'light' ? '#656565' : '#bdbcbc',
                    }}
                    className="validator-name"
                >
                    {props.selectedValidators.map(validator => validator.name)}
                </span>
            </p>
            <button
                className="success-button"
                onClick={() => {
                    props.onModalClose()
                    props.setShowBottomCart(false)
                }}
            >
                Ok Cool
            </button>
        </div>
    )
}
