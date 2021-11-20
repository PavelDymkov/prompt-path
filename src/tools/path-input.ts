import { normalize } from "path";
import { createInterface, emitKeypressEvents, Interface } from "readline";
import untildify from "untildify";

import { PromptPathParams, PromptPathTarget } from "../prompt-path";
import { DoubleDetector } from "./double-detector";
import { toShortBasePath } from "./to-short-base-path";
import { variantForTab, variantsForSuggest } from "./variants";

enum KeyName {
    Enter = "return",
    Tab = "tab",
    Backspace = "backspace",
}

interface Key {
    name: KeyName;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
}

const doubleTabDetector = new DoubleDetector(300);

class PathInput {
    private readonly io: Interface;
    private readonly targets: PromptPathTarget[];

    private get slice(): string {
        return this.io.line.slice(0, this.io.cursor);
    }

    constructor({ basePath, prefix, target }: PromptPathParams) {
        this.targets = target
            ? [target]
            : [PromptPathTarget.Directory, PromptPathTarget.File];

        this.io = createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: prefix || "> ",
        });

        emitKeypressEvents(process.stdin);

        if (process.stdin.isTTY) process.stdin.setRawMode(true);

        process.stdin.on("keypress", (_: string, key: Key) => {
            if (key.name === KeyName.Tab) {
                this.io.write("", { name: KeyName.Backspace });

                if (doubleTabDetector.isDouble) this.suggest();
                else this.tab();

                doubleTabDetector.tap();
            }
        });

        this.io.once("line", (path) => {
            this.send(normalize(untildify(path)));
        });

        this.io.once("close", () => {
            this.io.removeAllListeners();
            this.io.write("\n");

            this.send("");
        });

        this.io.prompt();
        this.io.write(toShortBasePath(basePath));
    }

    private send(value: string): void {
        process.send?.(value);
        process.exit();
    }

    private tab(): void {
        const variant = variantForTab(this.slice, this.targets);

        if (variant) this.io.write(variant);
    }

    private suggest(): void {
        const variants = variantsForSuggest(this.slice, this.targets);

        if (variants) {
            console.log("\n" + variants.join("  "));

            this.io.prompt(true);
        }
    }
}

process.once("message", (params: PromptPathParams) => {
    new PathInput(params);
});
