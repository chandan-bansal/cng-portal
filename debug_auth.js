const auth = require('./server/middleware/auth.js');
console.log('Type of auth:', typeof auth);
if (typeof auth !== 'function') {
    console.log('Auth is NOT a function!');
    console.log('Auth value:', auth);
} else {
    console.log('Auth is a function, signature:', auth.length);
}
