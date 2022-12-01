module.exports = class {
  constructor(body) {
    this.request = body;
    this.authorizedKeys = ["email", "message"];
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
        if (key == "message") {
          this.#sanitizeString(key, value);
        } else {
          this.#_validation(key, value);
        }
      }
      if (key != "message") {
        this.$object = { ...this.$object, [key]: value };
      }
    });

    return this.$object;
  }
  #_validation(key, value) {
    if (!value) {
      this.#error(401, "Les champs ne doivent pas être vides.");
    }
    if (
      key == "email" &&
      !/^[a-zA-Z0-9_\.]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/.test(value)
    ) {
      this.#error(401, "Veuillez entrer un email valide");
    }
    if (value.length <= 10) {
      this.#error(
        401,
        "L'email et le message doivent faire minimum 10 caractères."
      );
    }
  }
  #sanitizeString(key, value) {
    const str = value.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
    this.$object = { ...this.$object, [key]: str };
    this.#_validation(key, str);
  }
  #error(status, message) {
    const error = new Error(message);
    error.code = status;
    throw error;
  }
};
