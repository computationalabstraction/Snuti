const execute = (scheduler) => (observable) => observable.notifyThrough(scheduler);

const map = (operator) => (observable) => new Observable(
    (observer) => {
        observable.subscribe(
            (v) => observer.next(operator(v)),
            (e) => observer.error(e),
            () => observer.complete()
        );
    }
);

const mapTo = (value) => (observable) => new Observable(
    (observer) => {
        observable.subscribe(
            (v) => observer.next(value),
            (e) => observer.error(e),
            () => observer.complete()
        );
    }
);

const scan = (operator,seed=undefined) => (observable) => new Observable(
    (observer) => {
        let acc = seed;
        let index = 0;
        observable.subscribe(
            (v) => observer.next(operator(acc,value,index)),
            (e) => observer.error(e),
            () => observer.complete()
        );
    }
);

const reduce = (operator,seed=undefined) => (observable) => new Observable(
    (observer) => {
        let acc = seed;
        let index = 0;
        observable.subscribe(
            (v) => (acc = operator(acc,value,index)),
            (e) => observer.error(e),
            () => {
                observer.next(acc);
                observer.complete();
            }
        );
    }
);

const buffer = (buffered) => (observable) => new Observable(
    (observer) => {
        let internalBuff = [];
        buffered.subscribe(
            (v) => internalBuff.push(v),
            e => observer.error(e),
            () => observer.complete()
        );
        observable.subscribe(
            (v) => {
                observer.next(internalBuff)
                internalBuff = []
            },
            e => observer.error(e),
            () => observer.complete()
        )
    }
);