import fs from 'node:fs/promises';

/** @typedef {import('gampang').Client} Client */

/**
 * @class {Loader}
 */
export class Loader {
  /**
   * @constructor
   * @param {Client} client - Gampang.Client instance/class.
   * @param {string} folder - Load the folder.
   */
  constructor(client, folder) {
    this.client = client;
    this.folder = folder;
  }

  /**
   * Load
   *
   * @param {string?} dir A directory to load.
   * @return {Promise<void>}
   */
  async load(dir) {
    const st = await fs.stat(dir || this.folder);
    if (st.isDirectory()) {
      const files = await fs.readdir(dir || this.folder);
      for (const file of files) {
        const path = `${dir || this.folder}/${file}`;
        const st = await fs.stat(path);
        if (st.isDirectory()) {
          await this.load(path);
        } else {
          const ext = file.split('.').pop();
          if (ext === 'js') {
            const fl = require(path);
            fl.default(this.client);
            this.client.logger.info(`Loaded ${path}`);
          }
        }
      }
    } else {
      const ext = dir.split('.').pop();
      if (ext === 'js') {
        // const fl = require(dir);
        fl.default(this.client);
        this.client.logger.log(`Loaded ${dir}`);
      }
    }
  }
}
