import { npmPackagr } from "npm-packagr";
import {
    assets,
    badge,
    BadgeType,
    doIf,
    git,
    packageJSON,
    test,
} from "npm-packagr/pipelines";

npmPackagr({
    pipelines: [
        packageJSON((packageJson) => {
            delete packageJson.scripts;
            delete packageJson.devDependencies;

            packageJson.main = "./index.js";
            packageJson.types = ".";
        }),

        doIf("build", [
            git("check-status"),

            ({ exec }) => exec("tsc"),

            badge(BadgeType.Build),

            test(),

            badge(BadgeType.Test),

            assets("LICENSE", "README.md"),
        ]),

        doIf("dev", [
            ({ exec }) => {
                exec("tsc --watch");
            },
        ]),
    ],
});
