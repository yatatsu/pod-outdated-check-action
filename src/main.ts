import * as core from "@actions/core";
import { execPodOutdated, execCatPodspec } from "./exec";
import { validatePodspec } from "./podspec";
import { findOutdated } from "./outdated";

type Option = {
    readonly projectDirectory: string;
    readonly excludePods?: string[] | undefined;
    readonly podspec?: string | undefined;
};

function checkPlatform() {
    if (process.platform !== "darwin") {
        throw Error("Action only runs on macOS❌");
    }
}

const getOption = (): Option => {
    const projectDirectory = core.getInput("project_directory", { required: true });
    const excludePodsString = core.getInput("exclude_pods");
    const excludePods = excludePodsString?.split(",").map((p) => p.trim()) || undefined;
    const podspec = core.getInput("podspec") || undefined;

    return {
        projectDirectory,
        excludePods,
        podspec,
    };
};

async function run(): Promise<void> {
    try {
        core.info(`📦 Pod Outdated Check Action start running...`);
        checkPlatform();
        core.info(`👮 Validate input...`);
        const option = getOption();
        let podspec;
        if (option.podspec) {
            core.info(`📄 Validate podspec...`);
            const podspecSource = await execCatPodspec(option.podspec);
            podspec = validatePodspec(podspecSource);
        }
        core.info(`🔧 Run cocoapods command...`);
        const src = await execPodOutdated(option.projectDirectory);
        core.info(`🔍 Detect outdated pods...`);
        const result = findOutdated(src, option.excludePods, podspec);
        core.info("💅 Prepare outputs...");
        core.setOutput("has_any_outdated", result.hasAnyOutdated);
        core.setOutput("outdated_pod_info", result.info);
        core.setOutput("outdated_pod_json", JSON.stringify(result));
        core.info(`✅ Pod Outdated Check Action completed!`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
