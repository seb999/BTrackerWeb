import * as React from 'react';
import './../css/DropDown.css'

interface Props {
    itemList: Array<any>;
    onClick(p:any): void;
    selectedItem: any;
}

interface State {
}

class DropDown extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="dropdown">
                <button className="btn btn-outline-info dropdown-toggle mt-1" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.props.selectedItem ? this.props.selectedItem.deviceDescription : "Select tracker"}
            </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {this.props.itemList.map((item, index) => {
                        return <a key={index} className={this.props.selectedItem == item ? "dropdown-item active" : "dropdown-item"} id={item} onClick={()=>this.props.onClick(item)}>{item.deviceDescription}</a>
                    })}
                </div>
            </div>
        );
    }
}

export default DropDown