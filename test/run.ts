import { not } from "logical-not";
import { basename, resolve } from "path";
import { exec, exit, ls } from "shelljs";

const cases = Array.from(ls("test/cases/case-*.ts"));
const tsConfig = resolve("test/tsconfig.json");

const passing = cases.every((path) => {
    const testProcess = exec(`npx ts-node --project ${tsConfig} ${path}`, {
        silent: true,
    });

    const success = testProcess.code === 0;
    const prefix = success ? "✔" : "✖";

    console.log(`${prefix} ${basename(path, ".ts")}`);

    return success;
});

if (not(passing)) exit(1);
