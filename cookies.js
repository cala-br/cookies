class Cookie {
  /**
   * @param {Cookie.Options} 
   */
  constructor ({
    name,
    value = '',
    path = '/',
    duration = 'session',
    secure = false,
    domain = '',
    sameSite = '',
  }) {
    this.name = name;
    this.value = value;
    this.path = path;
    this.duration = duration;
    this.secure = secure;
    this.domain = domain;
    this.sameSite = sameSite;
  }


  store() {
    const [expires, maxAge] = this.expiresAt();
    const cookieString = `
      ${this.name}=${encodeURIComponent(this.value)}
      ;expires=${expires}
      ;max-age=${maxAge}
      ;path=${this.path}
      ;domain=${this.domain}
      ;samesite=${this.sameSite}
      ;${this.secure ? 'secure' : ''}
    `;

    document.cookie = cookieString.replaceAll('\n', '');
  }

  expiresAt() {
    if (this.duration == 'session')
      return ['', ''];

    return [
      Duration.asDate(this.duration).toUTCString(),
      Duration.asSeconds(this.duration),
    ];
  }


  /**
   * @param {Cookie.Convert} cast 
   * @returns {any}
   */
  load(cast = String) {
    return this.value = Cookie.load(this.name, cast);
  }

  exists() {
    return Cookie.exists(this.name);
  }


  delete() {
    this.value = undefined;
    this.duration = {
      milliseconds: 0,
    };

    this.store();
  }


  /**
   * @param {Cookie.Options} opts 
   */
  static store(opts) {
    Cookie
      .create(opts)
      .store();
  }

  /**
   * @param {string} name 
   * @param {Cookie.Convert} cast 
   * @returns {any}
   */
  static load(name, cast = String) {
    const filtered = Cookie
      .all()
      .filter(c => c.name == name);
  
    const value = 
      filtered[0]?.value;

    if (value)
      return cast(decodeURIComponent(value));
  }

  static exists(name) {
    return Cookie
      .all()
      .some(c => c.name == name)
  }

  /**
   * @param {string} name
   */
  static delete(name) {
    Cookie
      .withName(name)
      .delete();
  }


  /**
   * @param {string} name 
   * @returns {Cookie}
   */
  static withName(name) {
    return Cookie.create({ name: name });
  }

  /**
   * @param {Cookie.Options} options 
   * @returns {Cookie}
   */
  static create(options) {
    return new Cookie(options);
  }

  /**
   * @returns {Cookie[]} 
   */
  static all() {
    return document
      .cookie
      .split('; ')
      .map(c => c.split('='))
      .map(c => new Cookie({
        name: c[0], 
        value: c[1],
      }));
  }
}


class Duration {
  /**
   * @param {Duration.Options} options 
   * @returns {Date}
   */
  static asDate(options) {
    const durationMs = 
      Duration.asMilliseconds(options);
    
    return new Date(Date.now() + durationMs)
  }

  /**
   * @param {Duration.Options} options 
   */
  static asSeconds(options) {
    return Duration.asMilliseconds(options) / 1000;
  }

  /**
   * @param {Duration.Options} options 
   * @returns {number} 
   */
  static asMilliseconds(options) {
    const {
      milliseconds = 0,
      seconds = 0,
      minutes = 0,
      hours = 0,
      days = 0,
    } = options;

    return milliseconds 
      + (seconds * 1000)
      + (minutes * 60 * 1000)
      + (hours * 60 * 60 * 1000)
      + (days * 24 * 60 * 60 * 1000);
  }
}

/**
 * @typedef {object} Cookie.Options
 * @property {string} name
 * @property {any} [value]
 * @property {string} [path]
 * @property {Duration.Options | 'session'} [duration]
 * @property {boolean} [secure]
 * @property {string} [domain]
 * @property {'none' | 'lax' | 'strict'} [sameSite]
 */

/**
 * @callback Cookie.Convert
 * @param {string} value
 * @returns {any}
 */

/**
 * @typedef {object} Duration.Options
 * @property {number} [milliseconds]
 * @property {number} [seconds]
 * @property {number} [minutes]
 * @property {number} [hours]
 * @property {number} [days]
 */