import React from 'react';
import axios from 'axios';
import $ from 'jquery';

class GifBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            query : '',
            GIFs : [],
            offset : 0,
            message : 'Input a query to search related gif results'
        }
    }

    onChange(e){
        this.setState({
            query : e.target.value
        })
    }

    onKeyUp(e){
        if (e.key === 'Enter') {
            if(this.state.query.length){
                this.setState({
                    GIFs : [],
                    offset : 0
                });
                this.getGIFs();
            }else{
                alert('Please enter a search term to find gif');
            }
        }
    }

    registerScrollEvent(){
        let $gifs = $('.gifs')[0];
        $($gifs).on('scroll', function() {
            if($($gifs).scrollTop() + $($gifs).innerHeight() >= $($gifs).prop('scrollHeight')) {
                this.setState({
                    offset : this.state.offset + 10
                }, () => {
                    this.getGIFs();
                });

            }
        }.bind(this));
    }

    removeScrollEvent(){
        $('.gifs').off('scroll');
    }


    getGIFs(){
        this.removeScrollEvent();
        this.setState({
            message : '',
        });
        axios.get('https://api.giphy.com/v1/gifs/search', {
            params: {
                api_key: 'ln9tgm0RCZiGOcD5D6Gm3Wr8JYXLq4Zh',
                q : this.state.query,
                limit : 10,
                offset : this.state.offset
            }
        })
        .then(function (response) {
            let results = response.data.data;
            if(results.length){
                let gifs = results.map((gif) => {
                    return {
                        original : gif.images.original.url,
                        fixed : gif.images.fixed_height.url
                    };
                });
                this.setState({
                    GIFs : this.state.GIFs.concat(gifs)
                }, () => {
                    this.registerScrollEvent();
                });
            }else{
                this.setState({
                    GIFs : [],
                    message : 'No GIFs found'
                })
            }
        }.bind(this))
        .catch(function (error) {
            console.log(error);
        });
    }

    sendGIF(gif, e){
        console.log(gif);
        this.props.sendMessage({
            type : 'gif',
            url : gif.original
        });
    }


    render(){
        return (
            <div className="gifbox col-xs-12 col-sm-12 col-md-8 col-lg-10">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={this.props.toggleGif}
                        >
                            <i className="fa fa-comment"/> Messages
                        </button>
                    </div>
                    <input
                        className="form-control"
                        placeholder="Search Gif"
                        value={this.state.query}
                        onChange={this.onChange.bind(this)}
                        onKeyUp={this.onKeyUp.bind(this)}
                    />
                </div>

                <div className="gifs">
                    {this.state.GIFs.length ? this.state.GIFs.map((gif, i) => {
                        return (
                            <div className="gif" key={i}>
                                <i
                                    className="fa
                                    fa-share-square share"
                                    onClick={this.sendGIF.bind(this, gif)}
                                />
                                <img src={gif.fixed} alt=""/>
                            </div>
                        );
                    }) : <div className="searching h-100 text-center py-5">
                            <span>
                                {this.state.message}
                            </span>
                        </div>}
                </div>
            </div>
        );
    }
}

export default GifBox;