import React from 'react';
import styled from 'styled-components';
import BN from 'bn.js';
import { Option, AccountId, Tuple, UInt } from '@polkadot/types';
import { AddressMini, TxButton } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api/with';
import { formatBalance } from '@polkadot/util';
import { assetRegistry } from '@cennznet/crml-generic-asset';
import { itemsById } from './items';

const Wrapper = styled.div`
  border: 2px solid #eee;
  border-radius: 8px;
  margin: 10px;
  width: 280px;
  overflow: hidden;
`;

const ItemImageWrapper = styled.div`
  height: 180px;
  line-height: 100px;
  text-align: center;

  img {
    height: 100%;
    width: 100%;
  }
`;

const ItemDescWrapper = styled.div`
  padding: 10px;
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
};

const ItemCard = ({ accountId, itemId, item, owner, quantity, price, payingAsset, payingPrice }: Props) => {
  if (itemId === undefined || !item || item.isNone) {
    return (
      <Wrapper>
        <ItemImageWrapper>Loading...</ItemImageWrapper>
      </Wrapper>
    );
  }
  const itemValue = item.unwrap();
  const itemObj = itemsById[itemValue.toNumber()] || {};
  const itemImage = itemObj.image;
  const [asset, amount] = price ? price.unwrap() : [16000, 0];
  const assetObj = assetRegistry.findAssetById(+asset) || {} as any;
  const assetName = assetObj.symbol || `Asset ${asset}`;
  const quantityValue = quantity ? quantity.toNumber() : 0;
  return (
    <Wrapper>
      <ItemImageWrapper>
        <img src={itemImage} />
      </ItemImageWrapper>
      <ItemDescWrapper>
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
      </ItemDescWrapper>
    </Wrapper>
  );
};

export default withCalls<Props>(
  ['query.xPay.items', { paramName: 'itemId', propName: 'item' }],
  ['query.xPay.itemOwners', { paramName: 'itemId', propName: 'owner' }],
  ['query.xPay.itemQuantities', { paramName: 'itemId', propName: 'quantity' }],
  ['query.xPay.itemPrices', { paramName: 'itemId', propName: 'price' }]
)(ItemCard);
