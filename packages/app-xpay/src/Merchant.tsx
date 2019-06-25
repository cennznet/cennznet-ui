// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import BN from 'bn.js';
import { Button, TxButton, InputNumber, InputBalance, Dropdown } from '@polkadot/ui-app';

import items from './items';

const ActionWrapper = styled.div`
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e4e4;
  h2 {
    display: inline-block;
  }
`;

type Props = {
  accountId?: string,
};

type State = {
  item: number,
  quantity: BN,
  asset: number,
  price: BN,
  itemId: BN,
};

const assets = [
  {
    text: '16000: CENNZ-T',
    value: 16000
  },
  {
    text: '16001: CENTRAPAY-T',
    value: 16001
  },
];

class Merchant extends React.PureComponent<Props, State> {
  state: State = {
    item: items[0].value,
    quantity: new BN(1),
    asset: assets[0].value,
    price: new BN(100),
    itemId: new BN(0)
  };

  onItemChange = (item: number) => {
    this.setState({ item });
  }

  onQuantityChange = (quantity?: BN) => {
    this.setState({ quantity: quantity || new BN(1) });
  }

  onAssetChange = (asset: number) => {
    this.setState({ asset });
  }

  onPriceChange = (price?: BN) => {
    this.setState({ price: price || new BN(100) });
  }

  onItemIdChange = (itemId?: BN) => {
    this.setState({ itemId: itemId || new BN(0) });
  }

  render () {
    const { accountId } = this.props;
    const { item, quantity, asset, price, itemId } = this.state;
    return (
      <section>
        <ActionWrapper>
          <summary>
            <h2>Create Item</h2>
          </summary>
          <div className='ui--row'>
            <Dropdown
              value={item}
              label='Item'
              options={items}
              onChange={this.onItemChange}
            />
            <InputNumber
              value={quantity}
              label='Quantity'
              onChange={this.onQuantityChange}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              value={asset}
              label='Asset'
              options={assets}
              onChange={this.onAssetChange}
            />
            <InputBalance
              value={price}
              label='Price'
              onChange={this.onPriceChange}
            />
          </div>
          <div className='large'>
            <Button.Group>
              <TxButton
                accountId={accountId}
                label='Create Item'
                params={[quantity, item, asset, price]}
                tx='xpay.createItem'
              />
            </Button.Group>
          </div>
        </ActionWrapper>
        <ActionWrapper>
          <summary>
            <h2>Add Item</h2>
          </summary>
          <div className='ui--row'>
            <InputNumber
              value={itemId}
              label='Item ID'
              onChange={this.onItemIdChange}
            />
            <InputNumber
              value={quantity}
              label='Add Quantity'
              onChange={this.onQuantityChange}
            />
          </div>
          <div className='large'>
            <Button.Group>
              <TxButton
                accountId={accountId}
                label='Add Item'
                params={[itemId, quantity]}
                tx='xpay.addItem'
              />
            </Button.Group>
          </div>
        </ActionWrapper>
        <ActionWrapper>
          <summary>
            <h2>Remove Item</h2>
          </summary>
          <div className='ui--row'>
            <InputNumber
              value={itemId}
              label='Item ID'
              onChange={this.onItemIdChange}
            />
            <InputNumber
              value={quantity}
              label='Remove Quantity'
              onChange={this.onQuantityChange}
            />
          </div>
          <div className='large'>
            <Button.Group>
              <TxButton
                accountId={accountId}
                label='Add Item'
                params={[itemId, quantity]}
                tx='xpay.removeItem'
              />
            </Button.Group>
          </div>
        </ActionWrapper>
        <ActionWrapper>
          <summary>
            <h2>Update Item</h2>
          </summary>
          <div className='ui--row'>
            <InputNumber
              value={itemId}
              label='Item ID'
              onChange={this.onItemIdChange}
            />
            <InputNumber
              value={quantity}
              label='Quantity'
              onChange={this.onQuantityChange}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              value={asset}
              label='Asset'
              options={assets}
              onChange={this.onAssetChange}
            />
            <InputBalance
              value={price}
              label='Price'
              onChange={this.onPriceChange}
            />
          </div>
          <div className='large'>
            <Button.Group>
              <TxButton
                accountId={accountId}
                label='Update Item'
                params={[itemId, quantity, asset, price]}
                tx='xpay.updateItem'
              />
            </Button.Group>
          </div>
        </ActionWrapper>
      </section>
    );
  }
}

export default Merchant;
