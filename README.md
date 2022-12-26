### About

> Isomorphic channel for Micro Frontends.

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

> To break the `structured clone algorithm` limitation，We provide `cb.autoRun`, you need to use it to wrap your handler.

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
