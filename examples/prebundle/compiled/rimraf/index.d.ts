/// <reference types="node" />

import fs = require('fs');
import glob = require('glob');

declare function rimraf(path: string, options: rimraf.Options, callback: (error: Error | null | undefined) => void): void;

declare function rimraf(path: string, callback: (error: Error | null | undefined) => void): void;

declare namespace rimraf {
    /**
     * It can remove stuff synchronously, too.
     * But that's not so good. Use the async API.
     * It's better.
     */
    function sync(path: string, options?: Options): void;

    /**
     * see {@link https://github.com/isaacs/rimraf/blob/79b933fb362b2c51bedfa448be848e1d7ed32d7e/README.md#options}
     */
    interface Options {
        maxBusyTries?: number | undefined;
        emfileWait?: number | undefined;
        /** @default false */
        disableGlob?: boolean | undefined;
        glob?: glob.IOptions | false | undefined;

        unlink?: typeof fs.unlink | undefined;
        chmod?: typeof fs.chmod | undefined;
        stat?: typeof fs.stat | undefined;
        lstat?: typeof fs.lstat | undefined;
        rmdir?: typeof fs.rmdir | undefined;
        readdir?: typeof fs.readdir | undefined;
        unlinkSync?: typeof fs.unlinkSync | undefined;
        chmodSync?: typeof fs.chmodSync | undefined;
        statSync?: typeof fs.statSync | undefined;
        lstatSync?: typeof fs.lstatSync | undefined;
        rmdirSync?: typeof fs.rmdirSync | undefined;
        readdirSync?: typeof fs.readdirSync | undefined;
    }
}
export default rimraf;

export { }
