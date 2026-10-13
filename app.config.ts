import type { ConfigContext, ExpoConfig } from "expo/config";

type AppEnvironment = "development" | "preview" | "production";

interface DynamicAppConfig {
  name: string;
  bundleIdentifier: string;
  packageName: string;
  icon: string;
  adaptiveIconForeground: string;
  scheme: string;
}

const PROJECT_SLUG = "rn-todo-list";
const APP_NAME = "Todo App";
const SCHEME = "rntodolist";
const BASE_APPLICATION_ID =
  process.env.APP_IDENTIFIER_PREFIX ?? "com.ewwwgg.rntodolist";

const PRODUCTION_ICONS = {
  icon: "./assets/images/icon.png",
  adaptiveIconForeground: "./assets/images/android-icon-foreground.png",
};

function getEnvironment(value: string | undefined): AppEnvironment {
  if (value === undefined || value === "development") {
    return "development";
  }
  if (value === "preview" || value === "production") {
    return value;
  }

  throw new Error(
    `Invalid APP_ENV "${value}". Use development, preview, or production.`,
  );
}

export function getDynamicAppConfig(
  environment: AppEnvironment,
): DynamicAppConfig {
  if (environment === "development") {
    return {
      name: `${APP_NAME} Dev`,
      bundleIdentifier: `${BASE_APPLICATION_ID}.dev`,
      packageName: `${BASE_APPLICATION_ID}.dev`,
      icon: "./assets/images/icons/icon-dev.png",
      adaptiveIconForeground:
        "./assets/images/icons/android-icon-foreground-dev.png",
      scheme: `${SCHEME}-dev`,
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BASE_APPLICATION_ID}.preview`,
      packageName: `${BASE_APPLICATION_ID}.preview`,
      icon: "./assets/images/icons/icon-preview.png",
      adaptiveIconForeground:
        "./assets/images/icons/android-icon-foreground-preview.png",
      scheme: `${SCHEME}-preview`,
    };
  }

  return {
    name: APP_NAME,
    bundleIdentifier: BASE_APPLICATION_ID,
    packageName: BASE_APPLICATION_ID,
    ...PRODUCTION_ICONS,
    scheme: SCHEME,
  };
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const environment = getEnvironment(process.env.APP_ENV);
  const dynamicConfig = getDynamicAppConfig(environment);
  const projectId = process.env.EAS_PROJECT_ID ?? config.extra?.eas?.projectId;
  const owner = process.env.EXPO_OWNER ?? config.owner;

  const extra = {
    ...config.extra,
    router: config.extra?.router ?? {},
    ...(projectId
      ? {
          eas: {
            ...config.extra?.eas,
            projectId,
          },
        }
      : {}),
  };

  return {
    ...config,
    name: dynamicConfig.name,
    slug: PROJECT_SLUG,
    version: "4.0.0",
    orientation: "portrait",
    icon: dynamicConfig.icon,
    scheme: dynamicConfig.scheme,
    userInterfaceStyle: "automatic",
    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: dynamicConfig.bundleIdentifier,
      buildNumber: config.ios?.buildNumber ?? "1",
    },
    android: {
      ...config.android,
      package: dynamicConfig.packageName,
      versionCode: config.android?.versionCode ?? 4,
      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
        backgroundColor:
          config.android?.adaptiveIcon?.backgroundColor ?? "#E6F4FE",
        foregroundImage: dynamicConfig.adaptiveIconForeground,
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
    },
    web: {
      ...config.web,
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    ...(projectId
      ? {
          updates: {
            ...config.updates,
            url: `https://u.expo.dev/${projectId}`,
          },
        }
      : {}),
    extra,
    ...(owner ? { owner } : {}),
  };
};
