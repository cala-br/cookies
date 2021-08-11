# cookies
Simple class to handle cookies in javascript without crying

## Usage

Store the cookie
```js
const usernameCookie = Cookie.create({
  name: 'username',
  value: 'test@test.com',
  duration: {
    days: 30,
  },
});

usernameCookie.store();
```

Retrieve the cookie
```js
const username = Cookie
  .create({ name: 'username' })
  .load();
```

Other examples
```js
const opts = {
  name: 'count',
  value: 100,
  duration: {
    minutes: 30,
  },
};

const c =
  Cookie.create(opts);
  
c.addDuration({
  minutes: -15,
});

c.store();


const countCookie = 
  new Cookie({ name: 'count' });

if (countCookie.exists()) {
  // Count will be an integer
  const count = 
    countCookie.load(parseInt);

  countCookie.delete();
}
```
