module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env'
        }
      ],
      'react-native-paper/babel',
      // [
      //   'expo-build-properties',
      //   {
      //     android: {
      //       compileSdkVersion: 31,
      //       targetSdkVersion: 31,
      //       buildToolsVersion: '31.0.0',
      //     },
      //     ios: {
      //       deploymentTarget: '13.4',
      //     }
      //   },
      // ]
    ]
  };
};
