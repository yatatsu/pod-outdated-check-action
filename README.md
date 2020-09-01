# Pod Outdated Check Action

- Run `pod outdated` on GitHub Action.
- Check your `Podfile` or `*.podspec` dependencies outdated.
- Only available on macOS.

## Action

### Input

|key|description|
|--|--|
|`project_directory`| _Reqiured_. The path to the root of the pods project. |
|`exclude_pods`| The pod group should be ignored. (comma separeted) |
|`podspec`| The path to the podspec that you want to check dependencies. |

### Output

|key|description|
|--|--|
|`has_any_outdated`| It will be `true` if any pods have been outdated, or `false`. |
|`outdated_pod_info`| The original text of outdated pods info. |
|`outdated_pod_json`| The json structured outdated pods info. |

## Example Usage

```yml
name: Your Action

on: push

jobs:
  npm:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v1
    - uses: yatatsu/pod-outdated-check-action@v4
      id: outdated
    - name: Create Issue
      if: steps.outdated.outputs.has_any_outdated != 'false'
      run: |
        hub issue create -m "Found outdated dependencies." -m "${{ steps.outdated.outputs.outdated_pod_info }}"
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## License

MIT
