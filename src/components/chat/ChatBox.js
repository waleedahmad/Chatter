import React from 'react';

class ChatBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message : ''
        }
    }

    onChange(e){
        this.setState({
            message : e.target.value
        })
    }

    onKeyUp(e){
        if (e.key === 'Enter') {
            if(this.state.message.length){
                this.props.sendMessage({
                    type : 'message',
                    text : this.state.message
                });
                this.setState({message : ''});
            }else{
                alert('Please enter a message');
            }
        }
    }


    render(){
        return (
            <div className="input-group chatbox col-xs-12 col-sm-12 col-md-8 col-lg-10">
                <div className="input-group-prepend">
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={this.props.toggleGif}
                    >
                        <i className="fa fa-image"/> GIF
                    </button>
                </div>
                <input
                    className="form-control"
                    placeholder="Type message"
                    value={this.state.message}
                    onChange={this.onChange.bind(this)}
                    onKeyUp={this.onKeyUp.bind(this)}
                />
            </div>
        );
    }
}

export default ChatBox;