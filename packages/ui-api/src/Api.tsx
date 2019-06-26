// Copyright 2017-2019 @polkadot/ui-api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { QueueTx$ExtrinsicAdd, QueueTx$MessageSetStatus } from '@polkadot/ui-app/Status/types';
import { ApiProps } from './types';

import React from 'react';
import ApiPromise from '@polkadot/api/promise';
import { Api, WsProvider } from '@cennznet/api';
import defaults from '@polkadot/rpc-provider/defaults';
import { InputNumber } from '@polkadot/ui-app/InputNumber';
import keyring from '@polkadot/ui-keyring';
import { ChainProperties } from '@polkadot/types';
import { formatBalance, isTestChain } from '@polkadot/util';

import ApiContext from './ApiContext';

const CustomTypes = {
  'Item': 'u32',
  'ItemId': 'u64',
  'AssetId': 'u32',
  'AssetIdOf': 'u32',
  'Price': '(AssetId, Balance)',
  'PriceOf': '(AssetId, Balance)'
};

let api: ApiPromise;

type Props = {
  children: React.ReactNode,
  queueExtrinsic: QueueTx$ExtrinsicAdd,
  queueSetTxStatus: QueueTx$MessageSetStatus,
  url?: string
};

type State = ApiProps & {
  chain?: string
};

export { api };

export default class ApiWrapper extends React.PureComponent<Props, State> {
  state: State = {} as State;

  constructor (props: Props) {
    super(props);

    const { url } = props;
    const provider = new WsProvider(url);

    const setApi = (provider: ProviderInterface): void => {
      api = new Api({ provider, types: CustomTypes }) as any as ApiPromise;

      this.setState({ api }, () => {
        this.subscribeEvents();
      });
    };
    const setApiUrl = (url: string = defaults.WS_URL): void =>
      setApi(new WsProvider(url));

    api = new Api({ provider, types: CustomTypes }) as any as ApiPromise;

    this.state = {
      isApiConnected: false,
      isApiReady: false,
      api,
      setApiUrl
    } as State;
  }

  componentDidMount () {
    this.subscribeEvents();
  }

  private subscribeEvents () {
    const { api } = this.state;

    api.on('connected', () => {
      this.setState({ isApiConnected: true });
    });

    api.on('disconnected', () => {
      this.setState({ isApiConnected: false });
    });

    api.on('ready', async () => {
      try {
        await this.loadOnReady(api);
      } catch (error) {
        console.error('Unable to load chain', error);
      }
    });
  }

  private async loadOnReady (api: ApiPromise) {
    const [properties = new ChainProperties(), value] = await Promise.all([
      api.rpc.system.properties() as Promise<ChainProperties | undefined>,
      api.rpc.system.chain() as Promise<any>
    ]);
    const section = Object.keys(api.tx)[0];
    const method = Object.keys(api.tx[section])[0];
    const chain = value
      ? value.toString()
      : null;
    const isDevelopment = isTestChain(chain);

    console.log('api: found chain', chain, JSON.stringify(properties));

    // first setup the UI helpers
    formatBalance.setDefaults({
      decimals: properties.tokenDecimals,
      unit: properties.tokenSymbol
    });
    InputNumber.setUnit(properties.tokenSymbol);

    // finally load the keyring
    keyring.loadAll({
      addressPrefix: properties.get('networkId'),
      isDevelopment,
      type: 'ed25519'
    });

    this.setState({
      isApiReady: true,
      apiDefaultTx: api.tx[section][method],
      chain,
      isDevelopment
    });
  }

  render () {
    const { api, apiDefaultTx, chain, isApiConnected, isApiReady, isDevelopment, setApiUrl } = this.state;

    return (
      <ApiContext.Provider
        value={{
          api,
          apiDefaultTx,
          isApiConnected,
          isApiReady: isApiReady && !!chain,
          isDevelopment,
          setApiUrl
        }}
      >
        {this.props.children}
      </ApiContext.Provider>
    );
  }
}
