import { useEffect } from "react";
import { TStoreKeys } from "~/Shared/Store";
import { channelLog } from "~/Shared/channels";

export const useApiReceiveEffect = (
  channel: string,
  callback: (data: any) => void
) => {
  useEffect(() => {
    window.api.receive(channel, (data: any) => {
      channelLog(channel, "receiving", data);
      callback(data);
    });

    return () => {
      console.log(`Clean ${channel} listeners`)
      window.api.clearListeners(channel);
    };
  }, []);
};

export const useApiSendEffect = (channel: string, data: any) => {
  useEffect(() => {
    channelLog(channel, "sending", data);
    window.api.send(channel, data);

    return () => {
      console.log(`Clean ${channel} listeners`)
      window.api.clearListeners(channel);
    };
  }, [data]);
};

export const useApiSend = (channel: string, data: any) => {
  channelLog(channel, "sending", data);
  window.api.send(channel, data);
};

// useApiSend but gets a response back
export const useApiInvoke = (
  channel: string,
  data: any,
  callback: (data: any) => void
) => {
  channelLog(channel, "sending", data);

  window.api.invoke(channel, data, (data: any) => {
    channelLog(channel, "receiving", data);
    callback(data);
  });
};

export const useApiRetrieve = (
  name: TStoreKeys,
  callback: (data: any) => void
) => {
  channelLog("retrieveFromStore", "sending", name);

  window.api.retrieveFromStore(name, (data: any) => {
    channelLog("retrieveFromStore", "receiving", data);
    callback(data);
  });
};
