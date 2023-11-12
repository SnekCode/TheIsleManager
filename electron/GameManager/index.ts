import fs from "fs";
import { sys } from "typescript";
import { execFile, execSync, exec } from "child_process";
import { EGameNames } from "Shared/gamenames";

export const LOCAL_APP_DATA = process.env.LOCALAPPDATA;

type TGameNames = "legacy" | "evrima";

export const config = {
  steam: {
    path: "C:\\Program Files (x86)\\Steam",
  },
  legacy: {
    path: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Isle Legacy",
    name: "TheIsle.exe",
    runtimeAppDataName: "TheIsle",
    thisStandbyAppDataName: "TheIsleLegacy",
    otherStandbyAppDataName: "TheIsleEvirma",
    installIndicator: "Engine\\Extras\\Redist\\en-us\\UE4PrereqSetup_x64.exe",
  },
  evrima: {
    path: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\The Isle",
    name: "TheIsle\\Binaries\\Win64\\TheIsleClient-Win64-Shipping.exe",
    runtimeAppDataName: "TheIsle",
    thisStandbyAppDataName: "TheIsleEvirma",
    otherStandbyAppDataName: "TheIsleLegacy",
    installIndicator: "EasyAntiCheat",
    isEvrimaAppDataFolderIndicator:
      "Saved\\Config\\WindowsClient\\ApexDestruction.ini",
  },
};

export function setUpLegacy() {
  // confirm legacy is installed as evrima path
  if (
    fs.existsSync(config.evrima.path) &&
    fs.existsSync(`${config.evrima.path}\\${config.legacy.installIndicator}`)
  ) {
    // game starts as legacy in steam we want to rename it so we can install evrima too
    fs.renameSync(config.evrima.path, config.legacy.path);
    // create a file to store steam id

    fs.writeFileSync(
      `${config.legacy.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`,
      "376210"
    );
    // create a shortcut (symlink) named TheIsleLegacy on the OneDrive // desktop
    checkInAppData(EGameNames.legacy);
    return true;
  } else if (checksForInstall("legacy")) {
    if (
      fs.existsSync(
        `${config.legacy.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`
      )
    ) {
      fs.writeFileSync(
        `${config.legacy.path}\\TheIsle\\Binaries\\Win64\\steam_appid.txt`,
        "376210"
      );
    }
    // game is installed as legacy
    checkInAppData(EGameNames.legacy);
    return true;
  } else {
    // game is not installed as legacy
    return false;
  }
}

export function checkInAppData(name: EGameNames) {
  const game = config[name];
  if (fs.existsSync(`${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`)) {
    return false;
    console.log("checkin failed");
  }
  try {
    fs.renameSync(
      `${LOCAL_APP_DATA}\\${game.runtimeAppDataName}`,
      `${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`
    );
    return true;
  } catch {
    console.log("checkin failed");
    return false;
  }
}

export function checkOutAppData(name: TGameNames) {
  const game = config[name];
  if (!fs.existsSync(`${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`)) {
    return false;
  }

  try {
    fs.renameSync(
      `${LOCAL_APP_DATA}\\${game.thisStandbyAppDataName}`,
      `${LOCAL_APP_DATA}\\${game.runtimeAppDataName}`
    );
    return true;
  } catch {
    return false;
  }
}

export function swapVersion(name: TGameNames) {
  const currentGame = checkCurrentAppDataFolderType();
  console.log("swapVersion", currentGame, " > ", name);

  if (currentGame === name) {
    return true;
  } else {
    checkInAppData(currentGame);
    checkOutAppData(name);
  }
  return checkCurrentAppDataFolderType();
}

export function checkCurrentAppDataFolderType(): EGameNames {
  return fs.existsSync(
    `${LOCAL_APP_DATA}\\${config.evrima.runtimeAppDataName}\\${config.evrima.isEvrimaAppDataFolderIndicator}`
  )
    ? EGameNames.evrima
    : EGameNames.legacy;
}

export function checksForInstall(name: TGameNames) {
  return (
    fs.existsSync(config[name].path) &&
    fs.existsSync(`${config[name].path}\\${config[name].installIndicator}`)
  );
}

export function getAppDataFolder(name: TGameNames) {
  const currentAppDataFolder = checkCurrentAppDataFolderType();
  if (currentAppDataFolder === name) {
    return `${LOCAL_APP_DATA}\\${config[name].runtimeAppDataName}`;
  } else {
    return `${LOCAL_APP_DATA}\\${config[name].thisStandbyAppDataName}`;
  }
}

export function startGame(name: TGameNames) {
  const game = config[name];
  const gameExe = `${game.path}\\${game.name}`;
  //check for standbyAppData Folder
  swapVersion(name);
  // return a promise after 5 secs for testing
  return new Promise((resolve) => {
    execFile(gameExe, () => {
      setTimeout(() => {
        resolve("game ended");
      }, 5000);
    });
  });
}
