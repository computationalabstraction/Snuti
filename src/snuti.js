const Receiving = Symbol("Receiving");
const Stopped = Symbol("Stopped");
const Micro = Symbol("Micro");
const Macro = Symbol("Micro");

class Scheduler {
    schedule(cb) { }
}

class SyncScheduler extends Scheduler {
    schedule(cb) {
        cb();
    }
}

class AsyncScheduler extends Scheduler {
    constructor(type) {
        super();
        this.type = type == Macro ? type : Micro;
    }

    schedule(cb) {
        if (this.type == Micro) nextTick(cb);
        else setTimeout(cb, 0);
    }
}

class Observer {
    constructor(observer, scheduler) {
        this.state = Receiving;
        this.scheduler = scheduler;
        if (typeof observer === "object") {
            if (observer["next"] !== undefined) {
                this._next = observer.next;
                if (observer["complete"]) this._complete = observer.complete;
                if (observer["error"]) this._error = observer.error;
            }
            else throw new TypeError("Please atleast provide next")
        }
        else if (typeof observer === "function") {
            this._next = observer;
        }
        else throw new TypeError("Please pass a function or object");
    }

    next(v) {
        if (this.state === Receiving) {
            this.scheduler.schedule(() => this._next(v));
        }
    }

    error(e) {
        if (this.state === Receiving) {
            this.state = Stopped;
            if (this._error) this.scheduler.schedule(() => this._error(e));
        }
    }

    complete() {
        if (this.state === Receiving) {
            this.state = Stopped;
            if (this._complete) this.scheduler.schedule(() => this._complete());
        }
    }
}

class Subscription {
    constructor(observer, cb) {
        this.observer = observer;
        this.teardown = cb;
        this.dependants = [];
    }

    add(...sub) {
        sub.forEach(s => this.dependants.push(s));
        return this;
    }

    remove(sub) {
        for (let s in this.dependants) {
            if (this.dependants[s] == sub) this.dependants.splice(s, 1);
        }
        return this;
    }

    unsubscribe() {
        this.observer.state = Stopped;
        if (this.teardown) this.teardown();
        this.dependants.forEach(s => s.unsubscribe());
        return this;
    }
}

class Observable {
    constructor(producer) {
        this.producer = producer;
        this.scheduler = new SyncScheduler();
    }

    subscribe(observer, ...other) {
        if (typeof observer === "function" && other.length > 0) {
            let o = {};
            o.next = observer;
            o.error = other[0];
            o.complete = other[1];
            o.scheduler = other[2];
            observer = o;
        }
        let o;
        if (observer["scheduler"]) o = new Observer(observer, o.scheduler);
        else o = new Observer(observer, this.scheduler);
        return new Subscription(o, this.producer(o));
    }

    pipe(...operators) {
        let current = undefined;
        for (let operator of operators) {
            if (current) current = operator(current);
            else current = operator(this);
        }
        return current
    }

    notifyThrough(s) {
        if (s instanceof Scheduler) this.scheduler = s;
        return this;
    }
}

class ConnectableObservable {
    constructor() {

    }

    connect() {

    }

    refCount() {

    }
}

class Subject {
    constructor() {
        this.state = Receiving;
        this.observers = [];
        this.scheduler = new SyncScheduler();
    }

    subscribe(observer, ...other) {
        if (typeof observer === "function" && other.length > 0) {
            let o = {};
            o.next = observer;
            o.error = other[0];
            o.complete = other[1];
            o.scheduler = other[2];
            observer = o;
        }
        let o;
        if (observer["scheduler"]) o = new Observer(observer, o.scheduler);
        else o = new Observer(observer, this.scheduler);
        this.observers.push(o);
        return new Subscription(o, () => {
            for (let s in this.observers) {
                if (this.observers[s] == o) this.dependants.splice(s, 1);
            }
        });
    }

    next(v) {
        if (this.state === Receiving) {
            this.observers.forEach(o => o.next(v));
        }
        return this;
    }

    error(e) {
        if (this.state === Receiving) {
            this.observers.forEach(o => o.error(e));
        }
        return this;
    }

    complete() {
        if (this.state === Receiving) {
            this.observers.forEach(o => o.complete());
        }
        return this;
    }

    notifyThrough(s) {
        if (s instanceof Scheduler) this.scheduler = s;
        return this;
    }
}

class BehaviorSubject extends Subject {
    constructor(initial) {
        super();
        this.last = initial;
    }

    subscribe(observer, ...other) {
        const subs = super.subscribe(observer, ...other);
        subs.observer.next(this.last);
        return subs;
    }

    next(v) {
        if (this.state === Receiving) {
            this.last = v;
            super.next(v);
        }
    }
}

const of = (...vals) => new Observable((observer) => {
    vals.forEach(v => observer.next(v))
    observer.complete()
})

const range = (start=0,count=undefined,scheduler) => new Observable((observer) => {
    count? Array(count).fill(0).forEach((v,i) => observer.next(start+i)):0
    observer.complete()
})

const empty = () => new Observable((observer) => observer.complete())

const interval = (period,scheduler) => new Observable((observer) => {
    let count = 0;
    setInterval(() => observer.next(count++),period)
})

const timer = (dueTime,period,scheduler) => new Observable((observer) => {
    let count = 0;
    if(period) setInterval(()=>setInterval(() => observer.next(count++),period),dueTime)
    else setInterval(() => observer.next(count++),dueTime)
})

const iff = (cond,ob1,ob2) => new Observable((observer) => {
    if(cond()) ob1.subscribe(observer.next,observer.error,observer.complete)
    else ob2.subscribe(observer.next,observer.error,observer.complete)
})