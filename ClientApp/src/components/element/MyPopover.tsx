import * as React from 'react';
import { LookupItem } from '../../class/LookupItem';
import Popover from 'react-bootstrap/Popover';
import { OverlayTrigger } from 'react-bootstrap';

interface Props {
  content: string;
}

interface State {
}

class MyPopover extends React.Component<Props, State> {
  // constructor(props: any) {
  //     super(props);
  // }

  render() {
    const popover = (
      <Popover id="popover-basic">
        <Popover.Title as="h3">Notes</Popover.Title>
        <Popover.Content>
          {this.props.content}
        </Popover.Content>
      </Popover>
    );

    const Example = () => (
      <OverlayTrigger trigger="click" placement="right" overlay={popover}>
        <span style={{ color: "orange" }}>
          <i className="fas fa-info-circle"></i>
        </span>
      </OverlayTrigger>
    );

    return (
      <Example />
    );
  }
}

export default MyPopover