let execute = (scheduler) => (observable) => observable.notifyThrough(scheduler);

let map = (operator) => (observable) => new Observable(
    (observer) => {
        observable.subscribe(
            (v) => observer.next(operator(v)),
            (e) => observer.error(e),
            () => observer.complete()
        );
    }
);

let mapTo = (value) => (observable) => new Observable(
    (observer) => {
        observable.subscribe(
            (v) => observer.next(value),
            (e) => observer.error(e),
            () => observer.complete()
        );
    }
);
