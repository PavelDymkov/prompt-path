import { fork } from "child_process";
import { join } from "path";

export interface PromptPathParams {
    basePath?: string;
    prefix?: string;
    target?: PromptPathTarget;
}

export enum PromptPathTarget {
    Directory = "directory",
    File = "file",
}

export async function promptPath(params?: PromptPathParams): Promise<string> {
    const inputProcessPath = join(__dirname, "tools", "path-input.js");
    const inputProcess = fork(inputProcessPath);

    return new Promise((resolve) => {
        inputProcess.on("message", (path: string) => resolve(path));

        inputProcess.send(params || {});
    });
}
