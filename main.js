import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Carousel from './carousel';
const imgArr = ['./img/1.jpg', './img/2.jpg', './img/3.jpg', './img/4.jpg'];
const SCREEN_INFO = {
    width: document.body.clientWidth,
    height: window.screen.availHeight
}
class Main extends Component {
    render() {
        return (
        	<div className = "container" >
            	<Carousel
            		width = { 500 }
            		height = { 500 }
            		arrowWidth = { 30 }
            		onIndexChanged = { (index) => console.log(index) }
               	>
               		{
                		imgArr && imgArr.map((url, index) =>
                    		<img key = { index } src = { url }/>
                		)
            		}
            	</Carousel>
            </div>
        )
    }
}
ReactDOM.render( < Main / > , document.getElementById('root'));
