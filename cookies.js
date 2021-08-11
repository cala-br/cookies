class Cookie {
  /**
   * @param {Cookie.Options} 
   */
  constructor ({
    name,
    value = '',
    path = '/',
    duration = {},
  }) {
    this.name = name;
    this.value = value;
    this.path = path;
    this.addDuration(duration);
  }

  store() {
    const expires =
      new Date(Date.now() + this.durationMs);

    document.cookie = 
      `${this.name}=${escape(this.value)}; expires=${expires.toUTCString()}; path=${this.path}`;
  }

  load(cast = String) {
    const target = Cookie
      .all()
      .filter(c => c.name == this.name);
    
    if (target.length == 0)
      return;

    const value = target[0].value;
    this.value = cast(unescape(value));
    return this.value;
  }

  exists() {
    return Cookie
      .all()
      .some(c => c.name == this.name)
  }

  /**
   * @param {Duration.Options} options 
   */
  addDuration(options) {
    this.durationMs = 
      Duration.asMilliseconds(options);
  }

  delete() {
    this.value = undefined;
    this.durationMs = -1;
    this.store();
  }


  /**
   * @param {Cookie.Options} options 
   * @returns {Cookie}
   */
  static create(options) {
    return new Cookie(options);
  }

  static all() {
    return document
      .cookie
      .split(';')
      .map(c => c.trimStart())
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
   * @returns 
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
 * @property {Duration.Options} [duration]
 */

/**
 * @typedef {object} Duration.Options
 * @property {number} [milliseconds]
 * @property {number} [seconds]
 * @property {number} [minutes]
 * @property {number} [hours]
 * @property {number} [days]
 */
