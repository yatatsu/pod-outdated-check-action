import { validatePodspec, PodSpecDependency } from "../src/podspec";

test("validate podspec", async () => {
    const expected: PodSpecDependency[] = [
        {
            name: "FirebaseAnalytics",
        },
        {
            name: "Firebase",
            subspec: "CoreOnly",
        },
        {
            name: "FirebaseCore",
        },
        {
            name: "Firebase",
            subspec: "Core",
        },
        {
            name: "FirebaseABTesting",
        },
    ];
    const podspec = validatePodspec(firebasePodspec);
    expect(podspec.raw).toEqual(firebasePodspec);
    expect(podspec.deps).toEqual(expected);
});

const firebasePodspec = `
Pod::Spec.new do |s|
  s.name             = 'Firebase'
  s.version          = '6.31.1'
  s.summary          = 'Firebase'

  s.description      = <<-DESC
Simplify your app development, grow your user base, and monetize more effectively with Firebase.
                       DESC

  s.homepage         = 'https://firebase.google.com'
  s.license          = { :type => 'Apache', :file => 'LICENSE' }
  s.authors          = 'Google, Inc.'

  s.source           = {
    :git => 'https://github.com/firebase/firebase-ios-sdk.git',
    :tag => 'CocoaPods-' + s.version.to_s
  }

  s.preserve_paths = [
    "CoreOnly/CHANGELOG.md",
    "CoreOnly/NOTICES",
    "CoreOnly/README.md"
  ]
  s.social_media_url = 'https://twitter.com/Firebase'
  s.ios.deployment_target = '8.0'
  s.osx.deployment_target = '10.11'
  s.tvos.deployment_target = '10.0'

  s.cocoapods_version = '>= 1.4.0'

  s.default_subspec = 'Core'

  s.subspec 'Core' do |ss|
    ss.ios.dependency 'FirebaseAnalytics', '6.8.0'
    ss.dependency 'Firebase/CoreOnly'
  end

  s.subspec 'CoreOnly' do |ss|
    ss.dependency 'FirebaseCore', '6.10.1'
    ss.source_files = 'CoreOnly/Sources/Firebase.h'
    ss.preserve_paths = 'CoreOnly/Sources/module.modulemap'
    if ENV['FIREBASE_POD_REPO_FOR_DEV_POD'] then
      ss.user_target_xcconfig = {
        'HEADER_SEARCH_PATHS' => "$(inherited) \\"" + ENV['FIREBASE_POD_REPO_FOR_DEV_POD'] + "/CoreOnly/Sources\\""
      }
    else
      ss.user_target_xcconfig = {
        'HEADER_SEARCH_PATHS' => "$(inherited) \${PODS_ROOT}/Firebase/CoreOnly/Sources"
      }
    end
    # Standard platforms PLUS watchOS.
    ss.ios.deployment_target = '8.0'
    ss.osx.deployment_target = '10.11'
    ss.tvos.deployment_target = '10.0'
    ss.watchos.deployment_target = '6.0'
  end

  s.subspec 'Analytics' do |ss|
    ss.dependency 'Firebase/Core'
  end

  s.subspec 'ABTesting' do |ss|
    ss.dependency 'Firebase/CoreOnly'
    ss.dependency 'FirebaseABTesting', '~> 4.2.0'
  end

end
`;
