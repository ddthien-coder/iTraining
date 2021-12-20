export type RestResponse = {
  receivedAtTime: number;
  finishedAtTime: number;
  executionTime: number;
  module: string;
  service: string;
  method: string;
  data: any;
  logs: Array<string>
  status: any;
  error: any;
}

export type SuccessCallback = (response: RestResponse) => void;
export type FailCallback = (response: RestResponse) => void;
