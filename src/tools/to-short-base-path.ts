import not from "logical-not";
import { homedir } from "os";
import { resolve } from "path";

export function toShortBasePath(source?: string): string {
    if (not(source)) source = "~/";
    if (source.startsWith("~")) return source;

    source = resolve(source);

    const home = homedir();

    if (source.startsWith(home)) {
        source = "~" + source.slice(home.length);
    }

    return source;
}
