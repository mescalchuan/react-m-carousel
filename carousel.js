import React, { Component } from "react";
import PropTypes from "prop-types";

const getDeviceEnvironment = () => {
    const agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    let flag = true;
    agents.map(agent => {
        if (navigator.userAgent.indexOf(agent) > 0) {
            flag = false;
            return;
        }
    })
    return flag ? 0 : 1;
}
const deviceIsPC = getDeviceEnvironment() ? false : true;
const ARROW_DIRECTION = {
    LEFT: 0,
    RIGHT: 1
}

/**
 * index: 当前索引值
 * width：轮播图宽度（required）
 * height：轮播图高度（required）
 * autoPlay：是否自动播放
 * autoPlayTimeout：自动播放时每张图片的切换时间
 * showDot：是否展示圆点
 * dotColor：圆点的颜色
 * activeDotColor：激活圆点的颜色
 * dotWidth：圆点的宽度
 * dotBottomOffset：原点距离轮播图底部的距离，默认为圆点的宽度
 * arrowWidth：箭头宽度
 * onIndexChanged：索引值发生改变时的回掉
 */

export default class Carousel extends Component {
    static defaultProps = {
        index: 0,
        autoPlay: true,
        autoPlayTimeout: 3000,
        showDot: true,
        dotColor: "#666666",
        activeDotColor: "#68b1ed",
        dotWidth: 10,
        arrowWidth: 50,
        onIndexChanged: () => {}
    }

    static propTypes = {
        index: PropTypes.number,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        autoPlay: PropTypes.bool,
        autoPlayTimeout: PropTypes.number,
        showDot: PropTypes.bool,
        dotColor: PropTypes.string,
        activeDotColor: PropTypes.string,
        dotWidth: PropTypes.number,
        dotBottomOffset: PropTypes.number,
        arrowWidth: PropTypes.number,
        onIndexChanged: PropTypes.func
    }

    constructor(props) {
        super(props);
        const { index, children } = this.props;
        const currentIndex = this.props.index + 1 >= this.props.children.length ? this.props.children.length : this.props.index + 1;
        this.state = {
            currentIndex,
            offsetX: -this.props.width * currentIndex,
            needAnimate: true
        }
        this.previousX = 0;
        this._offsetX = 0;
        this.moveX = 0;
        this.previousIndex = 0;
        this.touchStartHandler = this.touchStartHandler.bind(this);
        this.touchMoveHandler = this.touchMoveHandler.bind(this);
        this.touchEndHandler = this.touchEndHandler.bind(this);
        this.resetImgListPosition = this.resetImgListPosition.bind(this);
        this._onVisibleChange = this._onVisibleChange.bind(this);
    }
    //运行轮播图，启动定时器
    runCarousel() {
        return setInterval(
            () => {
                const currentIndex = this.state.currentIndex + 1;
                this.autoMoveCarousel(currentIndex, true);
            },
            this.props.autoPlayTimeout + 200
        );

    }
    //如果轮播到了第一张图片，立即将其轮播到最后一张图片
    //如果轮播到了最后一张图片，立即将其轮播到第一张图片
    resetImgListPosition() {
        let currentIndex = this.state.currentIndex;
        switch (this.state.currentIndex) {
            case this.props.children.length + 1:
                currentIndex = 1;
                this.autoMoveCarousel(currentIndex, false);
                break;
            case 0:
                currentIndex = this.props.children.length;
                this.autoMoveCarousel(currentIndex, false);
                break;
            default:
                break;
        }
        if (this.props.onIndexChanged && currentIndex != this.previousIndex) {
            this.props.onIndexChanged(currentIndex - 1);
        }
    }
    //移动端触摸，停止定时器，记录之前的索引值、当前的偏移量previousX、当前轮播图偏移量_offestX
    touchStartHandler(e) {
        clearInterval(this.interval);
        this.interval = null;
        this.previousX = e.touches[0].clientX;
        this._offsetX = this.state.offsetX;
        this.previousIndex = this.state.currentIndex;
        this.refs.carousel.addEventListener("touchmove", this.touchMoveHandler);
        this.refs.carousel.removeEventListener("webkitTransitionEnd", this.resetImgListPosition);
    }
    //记录最新的偏移量nowX，图片随用户手势的移动而移动
    touchMoveHandler(e) {
        const nowX = e.touches[0].clientX;
        this.moveX = nowX - this.previousX;
        this.setState({
            offsetX: this._offsetX + this.moveX,
            needAnimate: false
        })
    }
    //判断用户移动的距离，如果过短则返回之前的图片，否则，切换到下一张图片
    touchEndHandler(e) {
        let currentIndex;
        if (Math.abs(this.moveX) >= this.props.width / 5) {
            switch (true) {
                case (this.moveX > 0):
                    currentIndex = this.state.currentIndex - 1;
                    break;
                case (this.moveX < 0):
                    currentIndex = this.state.currentIndex + 1;
                    break;
                default:
                    currentIndex = this.state.currentIndex;
                    break;
            }
        } else {
            currentIndex = this.state.currentIndex;
        }
        this.refs.carousel.removeEventListener("touchmove", this.touchMoveHandler);
        this.refs.carousel.addEventListener("webkitTransitionEnd", this.resetImgListPosition);
        this.autoMoveCarousel(currentIndex, true);
        this.previousX = 0;
        this._offsetX = 0;
        this.moveX = 0;
        this.interval = this.props.autoPlay ? this.runCarousel() : null;
    }
    //用户点击按钮时触发
    clickHandler(arrowDirection) {
        const currentIndex = arrowDirection == ARROW_DIRECTION.LEFT ? this.state.currentIndex - 1 : this.state.currentIndex + 1;
        clearInterval(this.interval);
        this.interval = null;
        this.autoMoveCarousel(currentIndex, true);
        this.interval = this.runCarousel();
    }
    //当页面激活状态发生改变时触发，如果当前页面不处于激活态则停用定时器防止布局混乱
    _onVisibleChange() {
        if(document.hidden) {
            clearInterval(this.interval);
            this.interval = null;
        }
        else {
            if(!this.interval) {
                this.interval = this.props.children.length > 1 && this.props.autoPlay ?
                    this.runCarousel() : null;
            }
        }
    }
    //切换图片
    autoMoveCarousel(currentIndex, needAnimate) {
        this.setState({
            offsetX: -currentIndex * this.props.width,
            currentIndex,
            needAnimate
        });
    }
    //渲染轮播图
    _renderCarousel(imgList, enableDrag) {
        let imgViewList = [];
        let dotList = [];
        React.Children.map(this.props.children, (img, index) => {
            const imgView = React.cloneElement(img, {
                draggable: "false"
            });
            if (index == 0) {
                this._endImgView = imgView;
            }
            if (index == this.props.children.length - 1) {
                this._startImgView = imgView;
            }
            imgViewList.push(
                this._renderImg(imgView, index, enableDrag)
            );
            const dotWidth = this.props.dotWidth;
            const marginRight = index == this.props.children.length - 1 ? 0 : dotWidth;
            const backgroundColor = this.state.currentIndex - 1 == index ? this.props.activeDotColor : this.props.dotColor;
            const dotListStyle = {
                marginRight: marginRight + "px",
                backgroundColor,
                width: dotWidth + "px",
                height: dotWidth + "px",
                borderRadius: dotWidth + "px",
                float: "left"
            }
            dotList.push(
            	<div key = { index } className = "dot-list" style = { dotListStyle } ></div>
            );
        });
        imgViewList.splice(0, 0, this._renderImg(this._startImgView, -1, enableDrag));
        imgViewList.push(this._renderImg(this._endImgView, this.props.children.length, enableDrag));
        return {
            imgViewList,
            dotList
        }
    }
    //渲染图片
    _renderImg(imgView, key, enableDrag) {
        const touchStartHandler = enableDrag ? this.touchStartHandler : null;
        const touchEndHandler = enableDrag ? this.touchEndHandler : null;
        return (
        	<div
        		key = { key }
        		className = "carousel-list"
            	style = {{ width: this.props.width, float: "left" }}
            	onTouchStart = { touchStartHandler }
            	onTouchEnd = { touchEndHandler }
            >
            	{ imgView }
            </div>
        )
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.index != this.props.index && nextProps.index != (this.state.currentIndex - 1)) {
            this.autoMoveCarousel(nextProps.index + 1, true);
        }
        if (nextProps.autoPlay != this.props.autoPlay) {
            if (nextProps.autoPlay == false) {
                clearInterval(this.interval);
                this.interval = null;
            } else {
                this.interval = this.props.children.length > 1 ?
                    this.runCarousel() : null;
            }
        }
    }

    componentDidMount() {
        let carousel = this.refs.carousel;
        carousel.addEventListener("webkitTransitionEnd", this.resetImgListPosition);
        document.addEventListener("visibilitychange", this._onVisibleChange);
        this.interval = this.props.children.length > 1 && this.props.autoPlay ?
            this.runCarousel() : null;
    }

    render() {
        let enableDrag = this.props.children.length > 1 ? true : false;
        let { imgViewList, dotList } = this._renderCarousel(this.props.children, enableDrag);
        let animateTime = this.state.needAnimate ? 0.2 : 0;
        let bottom = this.props.dotBottomOffset ? this.props.dotBottomOffset : this.props.dotWidth;
        let containerStyle = {
            width: `${this.props.width}px`,
            height: `${this.props.height}px`,
            ...styles.container
        }
        let dotContainerStyle = {
            bottom,
            ...styles.dotContainer
        }
        let arrowLeft = {
            left: this.props.arrowWidth + "px",
            width: this.props.arrowWidth + "px",
            height: this.props.arrowWidth * 2 + "px",
            ...styles.arrowContainer
        }
        let arrowRight = {
            right: this.props.arrowWidth + "px",
            width: this.props.arrowWidth + "px",
            height: this.props.arrowWidth * 2 + "px",
            ...styles.arrowContainer
        }
        return (
        	<div className = "container" style = { containerStyle }>
            	<div
            		ref = "carousel"
            		className = "carousel-main"
            		style = {{ width: this.props.width * (this.props.children.length + 2), WebkitTransform: `translate(${this.state.offsetX}px,0px)`, WebkitTransition: `all ${animateTime}s` }}
            	>
            		{ imgViewList }
            	</div>
            	{
               		this.props.showDot ? (
               			<div className = "dot-container" style = { dotContainerStyle }> { dotList } </div>
                	) : null
            	}
            	{
                	deviceIsPC ? (
                		<div>
                    		<div style = { arrowLeft } onClick = { () => this.clickHandler(ARROW_DIRECTION.LEFT) } >
                    			<img src = "./img/back.png" style = {{ width: this.props.arrowWidth + "px", ...styles.arrow }}/>
                    		</div>
                    		<div style = { arrowRight } onClick = {() => this.clickHandler(ARROW_DIRECTION.RIGHT) } >
                    			<img src = "./img/right.png" style = {{ width: this.props.arrowWidth + "px", ...styles.arrow }}/>
                    		</div>
                    	</div>
                	) : null
            	}
            </div>
        )
    }
}

const styles = {
    container: {
        overflow: "hidden",
        position: "relative"
    },
    dotContainer: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)"
    },
    arrowContainer: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        backgroundColor: "rgba(0,0,0,0.5)",
        cursor: "pointer",
        userSelect: "none"
    },
    arrow: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)"
    }
}
