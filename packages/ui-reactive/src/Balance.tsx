// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { AccountId, AccountIndex, Address, Balance } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';
import { formatBalance } from '@polkadot/util';
import { AssetId } from '@cennznet/types';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  label?: string,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null,
  assetId?: AssetId | string,
  genericAsset_freeBalance?: Balance
};

export class BalanceDisplay extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, genericAsset_freeBalance } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          genericAsset_freeBalance
            ? formatBalance(genericAsset_freeBalance)
            : '0'
          }{children}
      </div>
    );
  }
}

export default withCalls<Props>(
  ['derive.genericAsset.freeBalance', { paramName: ['assetId', 'params'] }]
)(BalanceDisplay);
