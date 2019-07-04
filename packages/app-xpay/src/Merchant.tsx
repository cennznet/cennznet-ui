// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import BN from 'bn.js';
import { withCalls } from '@polkadot/ui-api/with';
import { Button, TxButton, InputNumber, InputBalance, Dropdown } from '@polkadot/ui-app';
import { Option, UInt } from '@polkadot/types';
import items, { itemsById } from './items';

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
  itemsCount?: BN
};

type State = {
  item: number,
  quantity: BN,
  asset: number,
  price: BN,
  updatePrice: BN,
  itemId?: number
};

const assets = [
  {
    text: '16000: CENNZ-T',
    value: 16000
  },
  {
    text: '16001: CENTRAPAY-T',
    value: 16001
  }
];

type ItemIDLabelProp = {
  itemId: number,
  item?: Option<UInt>
};

const ItemIDLabelComp = ({ itemId, item }: ItemIDLabelProp) => {
  if (item === undefined) {
    return <span></span>;
  }
  const itemValue = item.unwrap().toNumber();
  const itemObj = itemsById[itemValue] || {};
  const itemName = itemObj.name || `Item ${itemValue}`;
  return (
    <>
      {`#${itemId} (${itemValue}: ${itemName})`}
    </>
  );
};

const ItemIDLabel = withCalls<ItemIDLabelProp>(
  ['query.xPay.items', { paramName: 'itemId', propName: 'item' }]
)(ItemIDLabelComp);

class Merchant extends React.PureComponent<Props, State> {
  state: State = {
    item: items[0].value,
    quantity: new BN(1),
    asset: assets[0].value,
    price: new BN(0),
    updatePrice: new BN(0),
    itemId: 0
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
    this.setState({ price: price || new BN(0) });
  }

  onUpdatePriceChange = (price?: BN) => {
    this.setState({ updatePrice: price || new BN(0) });
  }

  onItemIdChange = (itemId?: number) => {
    this.setState({ itemId });
  }

  render () {
    const { accountId, itemsCount } = this.props;
    const { item, quantity, asset, price, updatePrice, itemId } = this.state;
    const itemIds = [];
    const itemsCountNum = itemsCount ? itemsCount.toNumber() : 0;
    for (let i = 0; i < itemsCountNum; ++i) {
      itemIds.push({
        text: <ItemIDLabel key={i} itemId={i}/>,
        value: i
      });
    }
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
            <Dropdown
              value={itemId}
              label='Item ID'
              options={itemIds}
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
            <Dropdown
              value={itemId}
              label='Item ID'
              options={itemIds}
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
            <Dropdown
              value={itemId}
              label='Item ID'
              options={itemIds}
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
              label='Price'
              onChange={this.onUpdatePriceChange}
            />
          </div>
          <div className='large'>
            <Button.Group>
              <TxButton
                accountId={accountId}
                label='Update Item'
                params={[itemId, quantity, asset, updatePrice]}
                tx='xpay.updateItem'
              />
            </Button.Group>
          </div>
        </ActionWrapper>
      </section>
    );
  }
}

export default withCalls<Props>(
  ['query.xPay.nextItemId', { propName: 'itemsCount' }]
)(Merchant);
