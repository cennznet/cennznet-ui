// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import centralityLogo from '../static/centrality.svg';
import substrateSmall from '@polkadot/ui-assets/notext-parity-substrate-white.svg';

export default function getLogo (isSmall: boolean) {
  return isSmall ? substrateSmall : centralityLogo;
}
