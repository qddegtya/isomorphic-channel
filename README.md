### About

> Isomorphic channel for Micro Frontends.
### Motivation

In large web applications, we often load pages in different execution contexts. To solve historical technical debt problems, sometimes we choose not to be radical, but to choose more rapid integration. So many solutions are emerging in the community, such as what are called `Micro Frontends`, which are most popular. However, we still believe that the most perfect sandbox isolation scheme in the browser environment is `iframe`, so we choose to let them coexist with self-built sandboxes, at this time we need a developer-friendly communication solution, this is what `isomorphic-channel` does.

### Feature

![principle](https://raw.githubusercontent.com/qddegtya/isomorphic-channel/main/media/principle.jpeg)

* 🤝 Support `Cross-Context` communications.
* 📢 Support `broadcast-mode`.
* 🚀 Support handler binding to `iframe`, No Restrictions(structured clone).

### Install

**step 1: install**

```shell
$ npm install @atools/isomorphic-channel
```

### Core Api

#### setup

> If you need `broadcast-mode`, must call `setup` first.

```javascript
import { channel } from '@atools/isomorphic-channel';
channel.setup()
```

#### on

> Listen from `channel`, return a `cancellation`

```javascript
import { channel } from '@atools/isomorphic-channel';

const remove = channel.on('iframe-broadcast', (payload) => {
  alert(`in qiankun: ${JSON.stringify(payload)}`)

  // remove listener
  remove()
})
```

⚠️ **listen to iframe context**

> To break the `structured clone algorithm` limitation, we provide `cb.autoRun`, you need to use it to wrap your handler.

```javascript
import { channel, cb } from '@atools/isomorphic-channel';

// The magic of cb.autoRun
// 1. It will break the limitation of [structured clone algorithm].
// 2. Transform handler to current context.
channel.on('qiankun-broadcast', cb.autoRun((payload) => {
  alert(`in iframe: ${JSON.stringify(payload)}`)
}))
```

#### broadcast

> Broadcast to `channel`


```javascript
import { channel } from '@atools/isomorphic-channel';

setTimeout(() => {
  channel.broadcast('qiankun-broadcast', { key: 'hello, I am qianku.' })
}, 5000)
```

#### send

> Send to `channel`, without `broadcast-mode`

```javascript
import { channel } from '@atools/isomorphic-channel';

channel.send(message, payload);
```

### Enable Debug Mode

```javascript
import { channel } from '@atools/isomorphic-channel';

channel.debug();
```

### Handshake with iframe

#### handshake

> See https://github.com/dollarshaveclub/postmate


```javascript
const disconnect = channel.handshake({
  container: DOM_NODE,
  url: IFRAME_URL,
  name: NAME, // required
  classListArray: [], // your own classList
});

// disconnect
disconnect();
```

### Thanks

* [postmate - 📭 A powerful, simple, promise-based postMessage library.](https://github.com/dollarshaveclub/postmate)
