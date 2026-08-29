function makeFoo(bar, baz) {
    /* debug-start */
    console.log('creating Foo'); /* debug-end */
    // development_start
    if (bar instanceof Bar !== true) {
        throw new Error('makeFoo: bar param must be an instance of Bar');
    }
    // development_end
    // devteam2:open
    if (baz instanceof Baz !== true) {
        throw new Error('makeFoo: baz param must be an instance of Baz');
    }
    // devteam2:close
    // This code will remain
    return new Foo(bar, baz);
}
