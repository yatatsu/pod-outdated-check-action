import { EOL } from "os";
import { PodSpec } from "./podspec";

export type Outdated = {
    hasAnyOutdated: boolean;
    outdatedPods: OutdatedPod[];
    info: string;
};

export type OutdatedPod = {
    name: string;
    current: string;
    available: string | null;
    latestVersion: string;
    rawValue: string;
};

const buildOutdatedInfo = (pods: OutdatedPod[]): string => {
    return pods
        .map((p) => {
            const available = p.available ?? "(unused)";
            return `${p.name}: new version available ${p.current} -> ${available} (latest version ${p.latestVersion})`;
        })
        .join(EOL);
};

export const findOutdated = (
    source: string,
    excludes?: string[] | undefined,
    podspec?: PodSpec | undefined
): Outdated => {
    const pods: OutdatedPod[] = [];
    const lines = source.split(EOL);
    // e.g. - Firebase 6.28.0 -> 6.31.0 (latest version 6.31.0)
    const regex = /^-\s([\w]+)\s([\w.-]+)\s->\s([\w.-]+|\(unused\))\s\(latest\sversion\s([\w.-]+)\)$/;
    for (const line of lines) {
        if (line.startsWith("-")) {
            const found = line.match(regex) ?? [];
            if (found.length > 4) {
                const pod = {
                    name: found[1],
                    current: found[2],
                    available: found[3] === "(unused)" ? null : found[3],
                    latestVersion: found[4],
                    rawValue: line,
                };
                if (excludes && excludes.includes(pod.name)) {
                    continue;
                }
                if (!podspec || podspec.deps.findIndex((d) => d.name === pod.name) >= 0) {
                    pods.push(pod);
                }
            }
        }
    }
    return {
        hasAnyOutdated: pods.length > 0,
        outdatedPods: pods,
        info: buildOutdatedInfo(pods),
    };
};
