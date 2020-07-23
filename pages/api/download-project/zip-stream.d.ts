declare module 'zip-stream' {
  export interface IZipStreamOptions {
    level?: number;

    /** Sets the zip archive comment */
    comment?: string;

    /**
     * Forces the archive to contain local file times instead of UTC.
     */
    forceLocalTime?: boolean;

    /** Forces the archive to contain ZIP64 headers.
     */
    forceZip64?: boolean;

    /** Sets the compression method to STORE */
    store?: boolean;
  }

  export interface IZipEntry {
    /**
     * Sets the entry type. Defaults to `directory`
     * if name ends with trailing slash.
     */
    type?: 'file' | 'directory' | 'symlink';

    /** Sets the entry name including internal path. */
    name: string;
    date?: Date;

    /* Sets the compression method to STORE. */
    store?: boolean;
    comment?: String;
    mode?: number;
    linkname?: string;
  }

  class ZipStream {
    constructor(options?: { level?: number });

    /**
     * Appends an entry given an input source (text string, buffer, or stream).
     */
    entry(
      source: string | NodeJS.ReadableStream | Buffer | null,
      data: IZipEntry,
      callback: Function,
    ): void;

    on(event: string, listener: Function): ZipStream;

    pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean }): T;

    /**
     * Finalizes the instance and prevents further appending to the archive
     * structure (queue will continue til drained).
     */
    finalize(): void;
  }

  export = ZipStream;
}
