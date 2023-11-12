import { useApiReceiveEffect, useApiSend } from "@/Hooks/useApi";
import { ProgressInfo } from "electron-updater";
import React, { useEffect } from "react";
import { EChannels, channelLog } from "~/Shared/channels";
import "./UpdateBar.scss"

const animationTriggerEffect = (trigger: boolean, callback: () => void) => {
  useEffect(() => {
    if (trigger) {
      setTimeout(() => {
        callback();
      }, 500);
    }
  }, [trigger]);
}

const UpdateBar = () => {
  const [updateMessage, setUpdateMessage] = React.useState("");
  const [updateQueued, setUpdateQueued] = React.useState(false);
  const [downLoaded, setDownLoaded] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState<ProgressInfo>({
    percent: 0,
    transferred: 0,
    total: 0,
    bytesPerSecond: 0,
    delta: 0,
  });
  const [showUpdateBar, setShowUpdateBar] = React.useState(false);
  const [hide, setHide] = React.useState({trigger: false, hide: true});

  animationTriggerEffect(hide.trigger, () => {
    setHide({trigger: true, hide: true});
  });

  animationTriggerEffect(hide.hide, () => {
    setShowUpdateBar(false);
  })
  

  useApiReceiveEffect(EChannels.updateAvailable, (show: boolean) => {
    channelLog(EChannels.updateAvailable, "receiving", show);
    setShowUpdateBar(show);
  });
  useApiReceiveEffect(EChannels.updateDownloaded, (bool: boolean) => {
    channelLog(EChannels.updateDownloaded, "receiving", bool);
    setDownLoaded(bool);
  });
  useApiReceiveEffect(EChannels.updateInfo, (version: string) => {
    channelLog(EChannels.updateInfo, "receiving", version);
    setUpdateMessage(`Update to version ${version} available!`);
  });
  useApiReceiveEffect(
    EChannels.updateDownloadProgress,
    (progress: ProgressInfo) => {
      channelLog(EChannels.updateDownloadProgress, "receiving", progress);
      setDownloadProgress(progress);
      if (progress.percent === 100) {
        setTimeout(() => {
          setShowUpdateBar(false);
        }, 30000);
      }
    }
  );

  return (
    <div className={`${hide.trigger ? 'hide' : ""} ${showUpdateBar ? "show": ""} update-bar`}>
      <div className="update-bar-message">{updateMessage}</div>
      {!updateQueued && (
        <div className="update-bar-button-container">
          <button
            onClick={() => {
              useApiSend(EChannels.update, true);
              setUpdateQueued(true);
            }}
            className="update-bar-button"
          >
            Update Now
          </button>
          <button
            onClick={() => {
              useApiSend(EChannels.update, false);
              setUpdateQueued(true);
            }}
            className="update-bar-button"
          >
            Update Later
          </button>
        </div>
      )}
      {updateQueued && !downLoaded && (
        <div className="update-bar-progress">
          <div className="update-bar-progress-bar">
            <div
              className="update-bar-progress-bar-fill"
              style={{ width: `${downloadProgress.percent}%` }}
            ></div>

            <div className="update-bar-progress-bar-text">
              {downloadProgress.percent}%
            </div>
          </div>
        </div>
      )}
      {updateQueued && downLoaded && (
        <div style={{marginRight: '1rem'}}> Update Downloaded! Restart to apply changes.</div>
      )}
    </div>
  );
};

export default UpdateBar;
