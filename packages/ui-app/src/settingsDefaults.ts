// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import config from '../../../config';

export type ChainsInfo = Array<{
  name: string;
  chainId: number;
  decimals: number;
  unit: string;
}>;

export type Options = Array<{
  disabled?: boolean;
  text: string;
  value: string;
}>;

const CHAINS: ChainsInfo = [
  {
    name: 'Development',
    chainId: 0,
    decimals: 0,
    unit: 'Unit',
  },
];

const ENDPOINTS: Options = [
  {
    text: 'Development Node (https://cennznet-duo.centrality.me)',
    value: 'wss://cennznet-duo.centrality.me',
  },
  {
    text: 'UAT Node (https://cennznet-duo.centrality.cloud)',
    value: 'wss://cennznet-duo.centrality.cloud',
  },
  {
    text: 'Production Node (https://cennznet-duo.centralityapp.com)',
    value: 'wss://cennznet-duo.centralityapp.com',
  },
  { text: 'Local Node (127.0.0.1:9944)', value: 'ws://127.0.0.1:9944/' },
];

const LANGUAGES: Options = [{ value: 'default', text: 'Default browser language (auto-detect)' }];

const UIMODES: Options = [{ value: 'full', text: 'Fully featured' }, { value: 'light', text: 'Basic features only' }];

const UITHEMES: Options = [{ value: 'substrate', text: 'Substrate' }, { value: 'polkadot', text: 'Polkadot' }];

export { CHAINS, ENDPOINTS, LANGUAGES, UIMODES, UITHEMES };
