// Copyright 2017-2019 @polkadot/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Options } from './types';

const LANGUAGE_DEFAULT = 'default';

const CRYPTOS: Options = [
  { text: 'Edwards (ed25519)', value: 'ed25519' },
  { text: 'Schnorrkel (sr25519)', value: 'sr25519' }
];

const ENDPOINTS: Options = [
  {
    text: 'Rimu testnet',
    value: 'wss://rimu.unfrastructure.io/public/ws'
  },
  {
    text: 'Kauri internal testnet',
    value: 'wss://cennznet-node-0.centrality.me:9944/'
  },
  { text: 'Local Node (127.0.0.1:9944)', value: 'ws://127.0.0.1:9944/', host: 'localhost' }
];

const LANGUAGES: Options = [
  { value: LANGUAGE_DEFAULT, text: 'Default browser language (auto-detect)' }
];

const UIMODES: Options = [
  { value: 'full', text: 'Fully featured' },
  { value: 'light', text: 'Basic features only' }
];

const UITHEMES: Options = [
  { value: 'centrality', text: 'Centrality' }
];

const ENDPOINT_DEFAULT = ENDPOINTS.find(item => item.host === window.location.hostname) || ENDPOINTS[0];

const UITHEME_DEFAULT = 'centrality';

const UIMODE_DEFAULT = 'full';

export {
  CRYPTOS,
  ENDPOINT_DEFAULT,
  ENDPOINTS,
  LANGUAGE_DEFAULT,
  LANGUAGES,
  UIMODE_DEFAULT,
  UIMODES,
  UITHEME_DEFAULT,
  UITHEMES
};
