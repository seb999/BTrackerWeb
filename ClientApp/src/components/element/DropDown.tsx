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
                <button className="btn btn-outline-info dropdown-toggle mt-1 btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.props.selectedItem ? this.props.selectedItem.label : "Select tracker"}
            </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {this.props.lookupList.map((item, index) => {
                        return <a href="#" key={index} className={this.props.selectedItem === item ? "dropdown-item active" : "dropdown-item"} id={item.label} onClick={()=>this.props.onClick(item)}>{item.label}</a>
                    })}
                </div>
            </div>
        );
    }
}

export default DropDown