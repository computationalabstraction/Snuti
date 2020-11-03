<!-- ### <img src="./Snuti.png" /> -->
<div align="center">
<img src="./static/expression.png" />
<br>
<img src="./static/Snuti.svg" height="70em" width="140em"/>
</div>

## Reactive Programming library in Javascript (WIP)

<a href="https://promisesaplus.com/">
    <img src="https://promisesaplus.com/assets/logo-small.png" width="82" height="82" alt="Promises/A+ logo"
         title="Promises/A+ 1.0 compliant" align="left" />
</a>
<a href="https://github.com/fantasyland/fantasy-land"><img width="82" height="82" alt="Fantasy Land logo" src="https://raw.github.com/puffnfresh/fantasy-land/master/logo.png" align="left"></a>
<a href="https://github.com/fantasyland/static-land"><img height="82" alt="Static Land logo" src="https://raw.githubusercontent.com/fantasyland/static-land/master/logo/logo.png" align="left"></a>

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

<br>

Snuti is a fast comprehensive reactive programming library inspired by RxJS, Bacon.js and most.js. It is conforming to the ES Observable proposal, Promise/A+ spec, Fantasy Land and Static Land. It is crossplatform, lightweight with no dependancies and reliable.

### `Example Usage`

```javascript
let { Observable, AsyncScheduler } = require("snuti")

let o1 = new Observable((observer) => {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => observer.next(i), i * 100);
    }
    setTimeout(() => observer.complete(), 1000);
}).notifyThrough(new AsyncScheduler());

o1.pipe(map(v => v + 5)).subscribe({
    next: (v) => console.log(v),
    complete: () => console.log("Stream Ends!")
});
```

## Installation
> Currently not hosted (This section is placeholder, will be hosted soon)
### Node
```
npm i snuti
```
### Browser
```
<script src="https://unpkg.com/snuti"></script>
```
### Browser Optimized (gzipped)
```
<script src="https://unpkg.com/snuti/dist/browser/snuti.dist.min.js.gz"></script>
```

## Documentation
Complete reference has been given on the official documentation website link given below - <br>
* [Documentation](https://snuti.archan.io)

## Fantasy Land and Static Land

Snuti implements the following algebraic structures -
* [Semigroup](https://github.com/fantasyland/fantasy-land#semigroup)
* [Monoid](https://github.com/fantasyland/fantasy-land#monoid)
* [Filterable](https://github.com/fantasyland/fantasy-land#filterable)
* [Functor](https://github.com/fantasyland/fantasy-land#functor)
* [Apply](https://github.com/fantasyland/fantasy-land#apply)
* [Applicative](https://github.com/fantasyland/fantasy-land#applicative)
* [Alt](https://github.com/fantasyland/fantasy-land#alt)
* [Plus](https://github.com/fantasyland/fantasy-land#plus)
* [Alternative](https://github.com/fantasyland/fantasy-land#alternative)
* [Chain](https://github.com/fantasyland/fantasy-land#chain)
* [Monad](https://github.com/fantasyland/fantasy-land#monad)
* [Bifunctor](https://github.com/fantasyland/fantasy-land#bifunctor)
