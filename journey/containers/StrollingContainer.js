/**
 * Created by yonyou on 16/7/4.
 */
import React from 'react';
import {connect} from 'react-redux';
import Strolling from '../pages/StrollingThree';

class StrollingContainer extends React.Component{
    render(){
        return(
            <Strolling {...this.props} />
        );
    }
}

export default connect((state) =>{
    const {Strolling} = state;
    return{
        Strolling
    }
})(StrollingContainer);