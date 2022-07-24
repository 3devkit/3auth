import axios, { AxiosRequestConfig } from 'axios';
import { BusinessError } from '../errors';
import { processRequestError } from '../errors/processor';
import { AxiosRequest } from './types';

export type FetchToken = () => string;

const createRestfulClient = (baseURL: string, fetchToken?: FetchToken) => {
  const axiosIns = axios.create();
  axiosIns.interceptors.request.use(
    (config: AxiosRequestConfig): AxiosRequestConfig => {
      if (fetchToken) {
        try {
          const token = fetchToken() ?? '';
          config.headers!['Authorization'] = `Bearer ${token}`;
        } catch (error) {}
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
  axiosIns.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      const customError = processRequestError(error);
      return Promise.reject(customError);
    },
  );

  axiosIns.defaults.baseURL = baseURL;
  return axiosIns;
};

export class HttpClient {
  private restClient;
  public constructor(private baseURL: string, fetchToken?: FetchToken) {
    this.restClient = createRestfulClient(baseURL, fetchToken);
  }

  // 外部传入的baseUrl
  // 自定义header头
  protected headers: object = {
    ContentType: 'application/json;charset=UTF-8',
  };

  private async apiAxios({
    baseURL = this.baseURL,
    headers = this.headers,
    method,
    url,
    data,
    params,
    responseType,
  }: AxiosRequest): Promise<any> {
    const res = await this.restClient.request({
      baseURL,
      headers,
      method,
      url,
      data,
      params,
      responseType,
    });

    if (res.status === 200) {
      if (res.data.code === 0) {
        return res.data?.data;
      } else {
        throw BusinessError.Of(res.data.code, res.data.message);
      }
    } else {
      throw BusinessError.Of(res.status, 'network error');
    }
  }

  /**
   * GET类型的网络请求
   */
  public get({ baseURL, headers, url, data, params, responseType }: AxiosRequest) {
    return this.apiAxios({ baseURL, headers, method: 'GET', url, data, params, responseType });
  }

  /**
   * POST类型的网络请求
   */
  public post({ baseURL, headers, url, data, params, responseType }: AxiosRequest) {
    return this.apiAxios({ baseURL, headers, method: 'POST', url, data, params, responseType });
  }

  /**
   * PUT类型的网络请求
   */
  public put({ baseURL, headers, url, data, params, responseType }: AxiosRequest) {
    return this.apiAxios({ baseURL, headers, method: 'PUT', url, data, params, responseType });
  }

  /**
   * DELETE类型的网络请求
   */
  public delete({ baseURL, headers, url, data, params, responseType }: AxiosRequest) {
    return this.apiAxios({ baseURL, headers, method: 'DELETE', url, data, params, responseType });
  }

  /**
   * download
   */
  public async download({ baseURL, headers, url, proxy }: AxiosRequest) {
    const res = await this.restClient.request({
      baseURL,
      headers,
      method: 'GET',
      url,
      proxy,
    });
    return res.data;
  }
}
