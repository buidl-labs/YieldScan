import React from 'react'

class ValBottombar extends React.Component{
    render(){
        return(
            <React.Fragment>
                <div className="totalbonded">
                    {this.props.totalbondedtext}
                </div>
                <div className="selfbonded">
                    {this.props.selfbondedtext}
                </div>
                <div className="nominatorbonded">
                {this.props.nominatorbondedtext}
                </div>
            </React.Fragment>
        )
    }
}

export default ValBottombar