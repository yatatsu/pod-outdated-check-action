import { EOL } from "os";

export type PodSpec = {
    raw: string;
    deps: PodSpecDependency[];
};

export type PodSpecDependency = {
    name: string;
    subspec?: string | undefined;
};

export const validatePodspec = (source: string): PodSpec => {
    const lines = source.split(EOL);
    const depsMap: { [key: string]: PodSpecDependency } = {};
    const regex = /^\s+[\w\\.]+\.dependency[\s]+["']([\w]+)(?:\/([\w]+))?["'].*$/;
    for (const line of lines) {
        const found = line.match(regex) ?? [];
        if (found.length > 1) {
            const pod = {
                name: found[1],
                subspec: found.length == 3 ? found[2] : undefined,
            };
            const key = pod.name + (pod.subspec ? `/${pod.subspec}` : "");
            depsMap[key] = pod;
        }
    }
    return {
        raw: source,
        deps: Object.values(depsMap),
    };
};
