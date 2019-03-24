const Receiving = Symbol("Receiving");
const Stopped = Symbol("Stopped");

class Observer
{
    constructor(observer,scheduler)
    {
        this.state = Receiving;
        this.scheduler = scheduler;
        if(typeof observer === "object")
        {
            if(observer["next"] !== undefined)
            {
                this._next = observer.next;
                if(observer["complete"]) this._complete = observer.complete;
                if(observer["error"]) this._error = observer.error;
            }
            else throw new TypeError("Please atleast provide next")
        }
        else if(typeof observer === "function")
        {
            this._next = observer;
        }
        else throw new TypeError("Please pass a function or object");
    }

    next(v)
    {
        if(this.state === Receiving)
        {
            this.scheduler.schedule(() => this._next(v));
        }
    }

    error(e)
    {
        if(this.state === Receiving)
        {
            this.state = Stopped;
            if(this._error) this.scheduler.schedule(() => this._error(e));
        }
    }

    complete()
    {
        if(this.state === Receiving)
        {
            this.state = Stopped;
            if(this._complete) this.scheduler.schedule(() => this._complete());
        }
    }
}

class Scheduler
{
    schedule(cb){}
}

class SyncScheduler extends Scheduler
{
    schedule(cb)
    {
        cb();
    }
}

class AsyncScheduler extends Scheduler
{
    schedule(cb)
    {
        setTimeout(cb,0);
    }
}

class Subscription
{
    constructor(observer,cb)
    {
        this.observer = observer;
        this.teardown = cb;
        this.dependants = [];
    }

    add(...sub)
    {
        sub.forEach(s => this.dependants.push(s));
    }

    remove(sub)
    {
        for(let s in this.dependants)
        {
            if(this.dependants[s] == sub) this.dependants.splice(s,1);
        }
    }

    unsubscribe()
    {
        this.observer.state = Stopped;
        if(this.custom) this.teardown();
        this.dependants.forEach(s => s.unsubscribe());
    }
}

class Observable
{
    constructor(producer)
    {
        this.producer = producer;
        this.scheduler = new SyncScheduler();
    }

    subscribe(observer,...other)
    {
        if(other.length > 0)
        {
            let o = {};
            o.next = observer;
            o.error = other[0];
            o.complete = other[1];
            observer = o;
        }
        const o = new Observer(observer,this.scheduler);
        return new Subscription(o,this.producer(o));
    }   

    notifyThrough(s)
    {
        if(s instanceof Scheduler) this.scheduler = s;
        return this;
    }
}

console.log("Before");
let o1 = new Observable((observer) => {
    for(let i = 0;i < 10;i++)
    {   
        setTimeout(() => observer.next(i),i*100);
    }
}).notifyThrough(new AsyncScheduler());

o1.subscribe({
    next:(v) => console.log(v),
    complete:()=>console.log("Stream Ends!")
});
console.log("After");