import React from 'react';
import styled from 'styled-components';
import BN from 'BN.js';
import { Option, AccountId, Tuple, UInt} from '@polkadot/types';
import { AddressMini, TxButton } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api/with';
import { formatBalance } from '@polkadot/util';
import { assetRegistry } from '@cennznet/crml-generic-asset';
import { itemsById } from './items';

const Wrapper = styled.div`
  border: 2px solid #eee;
  padding: 10px;
  border-radius: 8px;
  margin: 10px;
  width: 333px;
`;

const Line = styled.div`
  height: 2px;
  background: #eee;
  margin: 10px -10px;
`;

const ItemImage = styled.div`
  height: 100px;
  line-height: 100px;
  text-align: center;
`;

type Props = {
  accountId?: string,
  itemId?: number,
  item?: Option<UInt>,
  owner?: Option<AccountId>,
  quantity?: UInt,
  price?: Option<Tuple>,
  payingAsset: number,
  payingPrice: BN
}

const ItemCard = ({ accountId, itemId, item, owner, quantity, price, payingAsset, payingPrice }: Props) => {
  if (itemId == null || !item || item.isNone) {
    return (
      <Wrapper>
        <ItemImage>Loading...</ItemImage>
      </Wrapper>
    );
  }
  const itemValue = item.unwrap();
  const itemObj = itemsById[itemValue.toNumber()] || {};
  const itemName = itemObj.name || `Item ${itemValue}`;
  const [asset, amount] = price ? price.unwrap() : [16000, 0];
  const assetObj = assetRegistry.findAssetById(+asset) || {} as any;
  const assetName = assetObj.symbol || `Asset ${asset}`;
  const quantityValue = quantity ? quantity.toNumber() : 0;
  return (
    <Wrapper>
      <ItemImage>{itemName}</ItemImage>
      <Line />
      <label>ID: {itemId}</label>
      <label>
        Merchant:
        <AddressMini
          value={owner && owner.unwrap()}
        />
      </label>
      <label>Stock: {quantityValue}</label>
      <label>Price: {assetName} {formatBalance(amount.toString())}</label>
      <TxButton
        isDisabled={quantityValue === 0}
        accountId={accountId}
        label='Buy'
        params={[1, itemId, payingAsset, payingPrice]}
        tx='xpay.purchaseItem'
      />
    </Wrapper>
  )
}

export default withCalls<Props>(
  ['query.xPay.items', { paramName: 'itemId', propName: 'item' }],
  ['query.xPay.itemOwners', { paramName: 'itemId', propName: 'owner' }],
  ['query.xPay.itemQuantities', { paramName: 'itemId', propName: 'quantity' }],
  ['query.xPay.itemPrices', { paramName: 'itemId', propName: 'price' }],
)(ItemCard);
