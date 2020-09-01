import { findOutdated, OutdatedPod } from "../src/outdated";
import { PodSpec } from "../src/podspec";

test("validate `pod outdated` output", async () => {
    const expected: OutdatedPod[] = [
        {
            name: "Firebase",
            current: "6.28.0",
            available: "6.31.1",
            latestVersion: "6.31.1",
            rawValue: "- Firebase 6.28.0 -> 6.31.1 (latest version 6.31.1)",
        },
        {
            name: "FirebaseAnalytics",
            current: "6.6.2",
            available: "6.6.5",
            latestVersion: "6.8.0",
            rawValue: "- FirebaseAnalytics 6.6.2 -> 6.6.5 (latest version 6.8.0)",
        },
        {
            name: "GoogleUtilities",
            current: "6.7.0",
            available: null,
            latestVersion: "6.7.2",
            rawValue: "- GoogleUtilities 6.7.0 -> (unused) (latest version 6.7.2)",
        },
    ];
    const outdated = findOutdated(outdatedExample);
    expect(outdated.hasAnyOutdated).toBe(true);
    expect(outdated.outdatedPods).toEqual(expected);
});

test("exclude pods", async () => {
    const expected: OutdatedPod[] = [
        {
            name: "FirebaseAnalytics",
            current: "6.6.2",
            available: "6.6.5",
            latestVersion: "6.8.0",
            rawValue: "- FirebaseAnalytics 6.6.2 -> 6.6.5 (latest version 6.8.0)",
        },
        {
            name: "GoogleUtilities",
            current: "6.7.0",
            available: null,
            latestVersion: "6.7.2",
            rawValue: "- GoogleUtilities 6.7.0 -> (unused) (latest version 6.7.2)",
        },
    ];
    const outdated = findOutdated(outdatedExample, ["Firebase"]);
    expect(outdated.hasAnyOutdated).toBe(true);
    expect(outdated.outdatedPods).toEqual(expected);
});

test("find outdateds only in podspec", async () => {
    const expected: OutdatedPod[] = [
        {
            name: "GoogleUtilities",
            current: "6.7.0",
            available: null,
            latestVersion: "6.7.2",
            rawValue: "- GoogleUtilities 6.7.0 -> (unused) (latest version 6.7.2)",
        },
    ];
    const podspec: PodSpec = {
        raw: "",
        deps: [
            {
                name: "GoogleUtilities",
                subspec: "AppDelegateSwizzler",
            },
        ],
    };
    const outdated = findOutdated(outdatedExample, [], podspec);
    expect(outdated.hasAnyOutdated).toBe(true);
    expect(outdated.outdatedPods).toEqual(expected);
});

test("exclude pods with podspec", async () => {
    const expected: OutdatedPod[] = [];
    const podspec: PodSpec = {
        raw: "",
        deps: [
            {
                name: "GoogleUtilities",
                subspec: "AppDelegateSwizzler",
            },
        ],
    };
    const outdated = findOutdated(outdatedExample, ["Firebase", "GoogleUtilities"], podspec);
    expect(outdated.hasAnyOutdated).toBe(false);
    expect(outdated.outdatedPods).toEqual(expected);
});

test("build info text", async () => {
    const outdated = findOutdated(outdatedExample, ["Firebase"]);
    expect(outdated.hasAnyOutdated).toBe(true);
    expect(outdated.info).toEqual(
        `FirebaseAnalytics: new version available 6.6.2 -> 6.6.5 (latest version 6.8.0)
GoogleUtilities: new version available 6.7.0 -> (unused) (latest version 6.7.2)`
    );
});

const outdatedExample = `
Updating spec repo \`trunk\`

Analyzing dependencies
The following pod updates are available:
- Firebase 6.28.0 -> 6.31.1 (latest version 6.31.1)
- FirebaseAnalytics 6.6.2 -> 6.6.5 (latest version 6.8.0)
- GoogleUtilities 6.7.0 -> (unused) (latest version 6.7.2)
`;
