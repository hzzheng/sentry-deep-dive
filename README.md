## Sentry 简明指南

本指南包含以下几个部分：

-  如何上手
-  如何处理事件
-  如何设置 Context
-  如何处理 Breadcrumbs
-  如何收集用户反馈

---

#### 如何上手

##### 1. 安装SDK

以Node.js为例：

```
yarn add @sentry/node@5.1.0
```
或者
```
npm install @sentry/node@5.1.0
```

##### 2. 配置SDK

首先在 [Sentry](https://sentry.io) 上注册，并创建一个project。创建后可以拿到一个dsn（Data Source Name）,它看起来有点像域名。

然后在你的项目中添加如下代码：

```node
const Sentry = require('@sentry/node');
// 注意替换成你项目的dsn
Sentry.init({ dsn: 'https://fdefeaabf2a243f695629d8b4e1a05b2@sentry.io/1448458' });
```

除了dsn，还有以下一些重要的配置项：

- `release`: 代表某个代码版本。设置`release`后会开启一些Sentry功能，包括应用`source maps`，具体见文章相应段落。
- `environment`: 设置环境。在Sentry后台可以通过环境过滤Issues，Releases等。
- `debug`: 是否开启debug模式，开启后会在浏览器控制台打印一些debugging信息。

其他配置项请参考官方文档 [Configuration](https://docs.sentry.io/error-reporting/configuration/?platform=node)。

#### 如何处理事件

##### 1. 捕获事件
Sentry SDK会自动上报fatal errors。你也可以自己手动上报错误。示例代码如下：

```node
try {
    aFunctionThatMightFail();
} catch (err) {
    Sentry.captureException(err);
}
```

你也可以使用`captureMessage`上报一段文本：
```node
Sentry.captureMessage('Something went wrong');
```

##### 2. 过滤事件

可以对上报的事件做一些自定义处理，使用`beforeSend`配置项，示例代码如下：

```node
Sentry.init({
  beforeSend(event) {
    // Modify the event here
    if (event.user) {
      // Don't send user's email address
      delete event.user.email;
    }
    return event;
  }
});
```

#### 如何设置 Context

可以通过设置上下文（context）的方式，在事件触发的时候上报更多有用的信息。主要包含以下几方面信息：

##### 1. Structured Contexts

比如OS、Runtime信息等。这个一般会自动设置并上传。

##### 2. User

当前用户信息。设置用户的示例代码如下：

```node
Sentry.configureScope((scope) => {
  scope.setUser({"email": "john.doe@example.com"});
});
```

可以通过`id`、`username`、`email`、`ip_address`来设置一个用户，这些字段都是可选的，但至少需要设置其中一个。

##### 3. Tags

可以给事件设置标签，在Sentry后台可以通过tags过滤事件。示例代码如下：

```node
Sentry.configureScope((scope) => {
  scope.setTag("page_locale", "de-at");
});
```

#### 4. Level

可以通过`level`设置事件的严重程度。可选值包括'fatal', 'error', 'warning', 'info', 和 'debug'。默认'error'。示例代码如下：

```node
Sentry.configureScope((scope) => {
  scope.setLevel('warning');
});
```

#### 5. Fingerprint

Sentry 通过`fingerprints`来决定如何将事件分组成issues。具体内容见Grouping部分。

#### 6. Extra Context

你也可以设置自定义的key/value数据，这些数据会和事件一起存储起来。示例代码如下：

```node
Sentry.configureScope((scope) => {
  scope.setExtra("character_name", "Mighty Fighter");
});
```

#### 如何处理 Breadcrumbs

Sentry中Breadcrumbs指的是某个事件触发的路径，它会记录事件触发前触发的一些列事件。通常Sentry会自动搜集记录这些事件，比如异常发生之前的点击事件等。

##### 1. 记录 Breadcrumbs

你可以通过SDK API手动记录。每个Breadcrumb可以包含这些字段：Message、Data、Category、Level、Type。

示例代码如下：
```node
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'Authenticated user ' + user.email,
  level: Sentry.Severity.Info
});
```

##### 2. 过滤 Breadcrumbs

和过滤事件一样，你可以在记录Breadcrumb之前，做一些自定义处理，或者干脆忽略这个Breadcrumb。示例代码如下：
```node
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://<key>@sentry.io/',
  beforeBreadcrumb(breadcrumb, hint) {
    return breadcrumb.category === 'ui.click' ? null : breadcrumb;
  },
});
```

#### 如何收集用户反馈

当错误发生的时候，如果你想从用户那儿了解究竟发生了什么，你可以通过Sentry提供的用户反馈组件来获取用户主动提供的相关信息。示例代码如下：

```node
Sentry.showReportDialog({ eventId: '{{ sentry_event_id }}' })
```

`eventId`是关联的事件id，其他可选参数可以参考官方文档 [User Feedback](https://docs.sentry.io/enriching-error-data/user-feedback/?platform=node)。

