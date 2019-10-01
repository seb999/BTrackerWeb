import * as React from 'react';
import './../css/DropDown.css'
import { LookupItem } from '../../class/LookupItem';

interface Props {
    lookupList: Array<LookupItem>;
    onClick(p:LookupItem): void;
    selectedItem: LookupItem;
}

interface State {
}

class DropDown extends React.Component<Props, State> {
    // constructor(props: any) {
    //     super(props);
    // }

    render() {
        return (
            <div className="dropdown">
                <button className="btn btn-outline-info dropdown-toggle mt-1" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.props.selectedItem ? this.props.selectedItem.value : "Select tracker"}
            </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {this.props.lookupList.map((item, index) => {
                        return <a key={index} className={this.props.selectedItem === item ? "dropdown-item active" : "dropdown-item"} id={item.value} onClick={()=>this.props.onClick(item)}>{item.value}</a>
                    })}
                </div>
            </div>
        );
    }
}

export default DropDown