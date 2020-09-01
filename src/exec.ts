import * as exec from "@actions/exec";
import * as shelljs from "shelljs";

export const execCatPodspec = async (path: string): Promise<string> => {
    const options: exec.ExecOptions = {};
    let output = "";
    let error = "";
    options.listeners = {
        stdout: (data) => {
            output += data.toString();
        },
        stderr: (data) => {
            error += data.toString();
        },
    };
    await exec.exec("cat", [path], options);
    if (error || !output) {
        throw Error("Cannot find podspec with path " + error);
    }
    return output;
};

export const execPodOutdated = async (projectPath: string): Promise<string> => {
    const temp = "temp.txt";
    shelljs.exec(`pod outdated --project-directory=${projectPath} --no-ansi`).to(temp);
    const result = shelljs.cat(temp);
    shelljs.rm(temp);
    if (result.stderr || !result.stdout) {
        throw Error("Fail to exec `pod outdated` " + result.stderr);
    }
    return result.stdout;
};
