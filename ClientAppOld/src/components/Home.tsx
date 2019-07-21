import * as React from 'react';
import {connect} from 'react-redux'

interface Props {
  userId : string;
  isLogged : boolean;
}

interface State {
  
}

class Home extends React.Component<Props, State>{
  constructor(props:any){
    super(props);
    console.log(props);
  }
  
  render(){
   console.log(this.props)
    return (
    <div>
      <h1>Hello, world!</h1> {this.props.userId}{this.props.isLogged}
      <p>Welcome to your new single-page application, built with:</p>
      <p>The <code>ClientApp</code> subdirectory is a standard React application based on the <code>create-react-app</code> template. If you open a command prompt in that directory, you can run <code>npm</code> commands such as <code>npm test</code> or <code>npm install</code>.</p>
    </div>
    )};
}

//map the props of this class to the root redux state
  const mapStateToProps = (state:any) =>{
    return {
      userId: state.userId,
      isLogged : state.isLogged,
    }
  }
  
  export default connect(mapStateToProps)(Home);

  //export default (Home);
