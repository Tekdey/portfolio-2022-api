module.exports = class {
  constructor(body) {
    this.request = body;
    this.authorizedKeys = ["fullname", "description"];
    this.$object = new Object();
  }
  async check() {
    const entries = Object.entries(this.request);
    entries.forEach(([key, value]) => {
      if (!this.authorizedKeys.includes(key)) {
        return this.#error(
          401,
          `Key unauthorized, please provide these : ${this.authorizedKeys}`
        );
      } else {
        this.#sanitizeString(key, value);
      }
    });

    return this.$object;
  }
  #_validation(key, value) {
    if (!value) {
      this.#error(401, "Les champs ne doivent pas être vides.");
    }
    if (value.length <= 10) {
      this.#error(401, "Les champs doivent faire minimum 10 caractères.");
    }
  }
  #sanitizeString(key, value) {
    const str = value.replace(/[^a-z0-9áéíóúñü \.,_\-\@]/gim, "");
    this.$object = { ...this.$object, [key]: str };
    this.#_validation(key, str);
  }
  #error(status, message) {
    const error = new Error(message);
    error.code = status;
    throw error;
  }
};
