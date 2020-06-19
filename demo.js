console.log("Before");
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
console.log("After");