/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

async function sleep (seconds) {
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    console.log("Sleeping test");
}
sleep(5);