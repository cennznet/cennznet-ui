// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import BN from 'bn.js';
import { withCalls } from '@polkadot/ui-api/with';
import { InputBalance, Dropdown } from '@polkadot/ui-app';

import ItemCard from './ItemCard';

const Wrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
`;

const assets = [
  {
    text: 'CENNZ-T',
    value: 16000
  },
  {
    text: 'CENTRAPAY-T',
    value: 16001
  }
];

type Props = {
  accountId?: string,
  itemsCount?: BN
};

type State = {
  asset: number,
  price: BN
};

class Shop extends React.PureComponent<Props, State> {
  state: State = {
    asset: 16000,
    price: new BN(1000000000)
  };

  onAssetChange = (asset: number) => {
    this.setState({ asset });
  }

  onPriceChange = (price?: BN) => {
    this.setState({ price: price || new BN(1000000) });
  }

  render () {
    const { accountId, itemsCount = new BN(0) } = this.props;
    const { asset, price } = this.state;
    const items = [];
    const count = itemsCount.toNumber();
    for (let i = 0; i < count; ++i) {
      items.push(
        <ItemCard
          key={i}
          itemId={i}
          payingAsset={asset}
          payingPrice={price}
          accountId={accountId}
        />
      );
    }
    return (
      <>
        <div className='ui--row'>
          <Dropdown
            value={asset}
            label='Asset'
            options={assets}
            onChange={this.onAssetChange}
          />
          <InputBalance
            value={price}
            label='Maximum Paying Amount'
            onChange={this.onPriceChange}
          />
        </div>
        <Wrapper>
          {items}
        </Wrapper>
      </>
    );
  }
}

export default withCalls<Props>(
  ['query.xPay.nextItemId', { propName: 'itemsCount' }]
)(Shop);
