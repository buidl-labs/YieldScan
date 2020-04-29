import React from 'react'
import { LogOnMount } from '@amplitude/react-amplitude'

const LogEvent = ({ eventType }) => {
    return <LogOnMount eventType={eventType} />
}

export default LogEvent
