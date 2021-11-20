import { statSync as getStat } from "fs";
import { dirname as toDirectory, join } from "path";
import { ls, test } from "shelljs";

import untildify from "untildify";

import { PromptPathTarget } from "../prompt-path";

export function variantForTab(
    path: string,
    targets: PromptPathTarget[],
): string {
    const { variants, directory, startsWith } = getVariants(path, targets);

    if (variants.length === 0) return "";

    if (variants.length === 1) {
        const [name] = variants;

        let variant = name.slice(startsWith.length);

        if (test("-d", join(directory, name))) variant += "/";

        return variant;
    }

    commonPart: {
        let commonPart = "";
        let character = "";

        const [example] = variants;

        main: for (let i = 0, lim = example.length; i < lim; i++) {
            character = example[i];

            for (let j = 1, lim = variants.length; j < lim; j++)
                if (variants[j][i] !== character) break main;

            commonPart += character;
        }

        return commonPart.slice(startsWith.length);
    }
}

export function variantsForSuggest(
    path: string,
    targets: PromptPathTarget[],
): string[] | null {
    const { variants } = getVariants(path, targets);

    return variants.length >= 2 ? variants : null;
}

function getVariants(
    path: string,
    targets: PromptPathTarget[],
): { directory: string; startsWith: string; variants: string[] } {
    path = untildify(path);

    const isFile = test("-f", path);

    if (isFile) return { variants: [], directory: "", startsWith: "" };

    const [directory, startsWith] = parse(path);

    return {
        directory,
        startsWith,
        variants: Array.from(ls("-A", directory))
            .filter((name) => name.startsWith(startsWith))
            .filter((name) => checkType(join(directory, name), targets)),
    };
}

function parse(path: string): [string, string] {
    if (test("-d", path) && path.endsWith("/")) return [path, ""];

    const directory = toDirectory(path);

    return [directory, path.slice(directory.length + 1)];
}

function checkType(path: string, targets: PromptPathTarget[]): boolean {
    const stat = getStat(path);

    return targets.some((type) => {
        switch (type) {
            case PromptPathTarget.File:
                return stat.isFile();
            case PromptPathTarget.Directory:
                return stat.isDirectory();
        }
    });
}
