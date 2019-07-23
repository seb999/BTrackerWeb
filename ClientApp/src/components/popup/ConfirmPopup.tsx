import * as React from 'react';
import { Modal, Button } from "react-bootstrap";

interface State { 
}

interface Props {
    title : string,
    content : string,
    show: boolean,
    hide(p:boolean) : void, //hide is a function that return true or false
}

class ConfirmPopup extends React.Component<Props, State>{
    constructor(props: any) {
        super(props)
    }

    render() {
        return (
            <div>  
                 <Modal show={this.props.show} onHide={() => this.props.hide(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>{this.props.content}</div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>this.props.hide(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() =>this.props.hide(true)} >
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ConfirmPopup;