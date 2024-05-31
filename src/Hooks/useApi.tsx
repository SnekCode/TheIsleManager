/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { IStore, IStoreKeys } from "~/Shared/Store";
import { channelLog, EChannels, IChannelKeys, IChannelReceive, IChannels} from "~/Shared/channels";



/*

Last change made here was to set up a channel api using TS.  
A channel receive interface that shows the type expected to be returned to the front end
A channel send interface that shows the type expected to be sent to the back end
Each depends on the channel name
This is defined in ./Shared/channels.ts
*/

export const useApiReceiveEffect = <K extends IChannelKeys> (
  channel: K,
  callback: (data: IChannelReceive[K]) => void
) => {
  useEffect(() => {
    window.api.receive(channel, (data) => {
      channelLog(channel, "receiving", data);
      callback(data);
    });

    return () => {
      console.log(`Clean ${channel} listeners`)
      window.api.clearListeners(channel);
    };
  }, [channel, callback]);
};

export const useApiSendEffect = (channel: IChannelKeys, data: any) => {
  useEffect(() => {
    channelLog(channel, "sending", data);
    window.api.send(channel, data);

    return () => {
      console.log(`Clean ${channel} listeners`)
      window.api.clearListeners(channel);
    };
  }, [data, channel]);
};

export const apiSend = (channel: EChannels, data: any) => {
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

export const apiRetrieve = <K extends IStoreKeys>(
  name: K,
  callback: (data: IStore[K]) => void
) => {
  channelLog("retrieveFromStore", "sending", name);

  window.api.retrieveFromStore(name, (data: IStore[K]) => {
    channelLog("retrieveFromStore", "receiving", data);
    callback(data);
  });
};

export const apiSave = <K extends IStoreKeys>(
  name: K,
  data: IStore[K]
) => {
  channelLog("saveToStore", "sending", name);

  window.api.saveToStore(name, data)
};