import { useEffect } from "react";
import { TStoreKeys } from "~/Shared/Store";

export const useApiReceiveEffect = (channel: string, callback: (data: any) => void) => {
  useEffect(() => {
    window.api.receive(channel, (data: any) => {
      console.log(`Received data on ${channel} channel`, data);
      callback(data)
    });

    return () => {
      window.api.clearListeners("lock");
    }
  }, []);
}


export const useApiSendEffect = (channel: string, data: any) => {
  useEffect(() => {
    console.log(`Sending data on ${channel} channel`, data);

    window.api.send(channel, data);
  }, [data]);
}

export const useApiSend = (channel: string, data: any) => {
  console.log(`Sending data on ${channel} channel`, data);

  window.api.send(channel, data);
}

export const useApiRetrieve = (name: TStoreKeys, callback: (data: any) => void) => {
  window.api.retrieveFromStore(name, (data: any) => {
    console.log(`Retrieving ${name} from Store`, data);
    callback(data)
  });
}