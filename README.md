# The Isle Manager

The Isle Manager is an application designed to manage the game settings and paths for two different versions of a game called "The Isle". The two versions of the game are the deprecated Legacy version and the new Evrima version.

The application ensures that the correct version of the game is launched when the user selects a specific version. This is done by swapping the files per version of the game. The reason for swapping the files per version of the game is to avoid game-related bugs that may occur when switching from the Legacy version to the Evrima version of the game and vice versa.


## Prerequisite Setup
To install both versions of the game, follow these steps:

1. Install the Legacy version of the game through Steam.
2. Once the Legacy version is installed, navigate to the game folder. By default, the game folder is located at `C:\Program Files (x86)\Steam\steamapps\common\The Isle`.
3. Rename the `TheIsle` folder to `TheIsle-Legacy`.
4. Create a `steam_appid.txt` file in the `TheIsle-Legacy\\Binaries\\Win64\\` directory with the Steam game ID. The Steam game ID for The Isle is `376210`.
5. Install the Evrima version of the game through Steam.

## Installation

To install the application, download the latest release from the [GitHub releases page](https://github.com/SnekCode/TheIsleManager/releases). Once you have downloaded the release, run the `TheIsleManager-Windows-${version}-Setup.exe` file to install the application.

## Usage

To use the application, simply launch it from the Start menu or desktop shortcut. The application will automatically swap the game files between the Legacy and Evrima versions of the game.

## Features
* Automatically swap game config files between the Legacy and Evrima versions of the game.
* Launch the game from the application.

## Planned Features
* Automatically detect which game version is installed and guide the user though the installation process for the other version of the game.
* Change the game settings from the application.
* Discord integration for community servers to include ticket system, server status, direct connect, and more.

## Development

The application is built using the following technologies:

- JavaScript
- npm
- TypeScript
- React

To build the application from source, you will need to have Node.js and npm installed on your computer. Once you have installed Node.js and npm, you can download the source code for the application from the [GitHub repository](https://github.com/SnekCode/TheIsleManager) and run the following commands:

```
npm install
npm start
```

This will start the application in development mode and allow you to make changes to the code.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.