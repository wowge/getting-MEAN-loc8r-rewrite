版本|日期
----|----
1.0|2017-5-12

这是我对[<Getting MEAN with Mongo, Express, Angular, and Node>](https://www.manning.com/books/getting-mean-with-mongo-express-angular-and-node)书中[loc8r](https://github.com/simonholmes/getting-MEAN)程序的改写。

原书[chapter-11](https://github.com/simonholmes/getting-MEAN#the-application-at-various-stages)用户管理是使用[AngularJS](https://angularjs.org/)实现的。考虑到AngularJS升级到了[Angular2.0](https://angular.io/)，而版本之间跳跃比较大，我没有深入学习AngularJS。看到作者Simon Holmes有本书[新版](https://github.com/simonholmes/getting-MEAN-2)的计划，[在新版中会使用Angular2](https://github.com/simonholmes/getting-MEAN-2#getting-mean-second-edition-application-code)。

于是我便将[chapter-11](https://github.com/simonholmes/getting-MEAN#the-application-at-various-stages)改写成了基于Express的版本。这样整个系统都是基于Express，希望将来能加入更多前端框架，比如Angular、[vue.js](http://vuejs.org/)等。

原书程序使用localStorage来存储JWT数据，在参考了['Where to Store your JWTs – Cookies vs HTML5 Web Storage'](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage)这篇文章后，我决定采用cookie存储的方案，这一点上没有盲从作者，希望作者也能采纳这篇文章的观点。

原书程序用户不能提交地点信息，地点信息都是手工输入数据库。于是我增加了提交地点功能，提交页面显示用户的地理位置。在系统首页显示周边地点的地理位置。

由于国内google map不好用，我使用了百度地图的[JS API](http://lbsyun.baidu.com/index.php?title=jspopular)。大家clone代码后还需要申请百度地图的**密钥**，然后在js引用代码中增加密钥ak参数。

大家有什么想法和建议可以邮件联系:mailbox_closed:。

序号|改动
---|---
1|~~AngularJS~~  =>  基于Express改写
2|~~localStorage~~  =>  使用cookie
3|~~google map~~  =>  使用百度地图API
4|提交地点信息
5|显示用户和地点的位置
