# react-m-carousel
## 基于react实现的轮播图组件，在pc上通过点击左右箭头切换图片，在手机上通过滑动切换图片。
### How To Use
```
import Carousel from './carousel';
//render
return (
   <Carousel 
      width = {100}
      height = {100}
   >
      <img src = {'xxx/jpg'} />
      <img src = {'xxx/jpg'} />
      <img src = {'xxx/jpg'} />
   </Carousel>
)

```
### APIS
- index: 当前索引值
- width：轮播图宽度（required）
- height：轮播图高度（required）
- autoPlay：是否自动播放
- autoPlayTimeout：自动播放时每张图片的切换时间
- showDot：是否展示圆点
- dotColor：圆点的颜色
- activeDotColor：激活圆点的颜色
- dotWidth：圆点的宽度
- dotBottomOffset：原点距离轮播图底部的距离，默认为圆点的宽度
- arrowWidth：箭头宽度
- onIndexChanged：图片切换时的回调
