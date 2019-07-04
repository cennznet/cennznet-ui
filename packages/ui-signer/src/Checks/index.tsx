// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { IExtrinsic } from '@polkadot/types/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React from 'react';
import { Method, u32, Balance } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';
import { Icon } from '@polkadot/ui-app';
import { compactToU8a, stringToU8a, formatBalance } from '@polkadot/util';
import { decodeAddress } from '@polkadot/keyring';
import { xxhashAsHex, blake2AsHex } from '@polkadot/util-crypto';

import translate from '../translate';
import Proposal from './Proposal';
import Transfer from './Transfer';
import { MAX_SIZE_BYTES, MAX_SIZE_MB, ZERO_FEES } from './constants';

type State = ExtraFees & {
  allFees: BN,
  allWarn: boolean,
  extMethod?: string,
  extSection?: string,
  hasAvailable: boolean,
  isRemovable: boolean,
  isReserved: boolean,
  overLimit: boolean,
  balance: BN,
  spendBalance: BN
};

type Props = I18nProps & {
  transactionByteFee?: BN,
  transactionBaseFee?: BN,
  token_balance?: any,
  spending_balance?: any,
  accountId?: string | null,
  accountKeyToken?: string | null,
  accountKeySpending?: string | null,
  extrinsic?: IExtrinsic | null,
  isSendable: boolean,
  onChange?: (hasAvailble: boolean) => void,
  system_accountNonce?: BN,
  assetId?: BN | number
};

const LENGTH_PUBLICKEY = 32 + 1; // publicKey + prefix
const LENGTH_SIGNATURE = 64;
const LENGTH_ERA = 1;
const SIGNATURE_SIZE = LENGTH_PUBLICKEY + LENGTH_SIGNATURE + LENGTH_ERA;

export class FeeDisplay extends React.PureComponent<Props, State> {
  state: State = {
    allFees: new BN(0),
    allWarn: false,
    extraAmount: new BN(0),
    extraFees: new BN(0),
    extraWarn: false,
    hasAvailable: false,
    isRemovable: false,
    isReserved: false,
    overLimit: false,
    balance: new BN(0),
    spendBalance: new BN(0)
  };

  static getDerivedStateFromProps ({ accountId, token_balance, spending_balance, extrinsic, transactionByteFee = new BN(0), transactionBaseFee = new BN(0), system_accountNonce = new BN(0) }: Props, prevState: State): State | null {
    if (!accountId || !extrinsic) {
      return null;
    }

    let tokenBalance = token_balance ? new Balance(token_balance.unwrapOr(0)).toBn() : new BN(0);
    let spendingBalance = spending_balance ? new Balance(spending_balance.unwrapOr(0)).toBn() : new BN(0);

    const fn = Method.findFunction(extrinsic.callIndex);
    const extMethod = fn.method;
    const extSection = fn.section;
    const txLength = SIGNATURE_SIZE + compactToU8a(system_accountNonce).length + (
      extrinsic
        ? extrinsic.encodedLength
        : 0
    );
    const isSameExtrinsic = prevState.extMethod === extMethod && prevState.extSection === extSection;
    const extraAmount = isSameExtrinsic
      ? prevState.extraAmount
      : new BN(0);
    const extraFees = isSameExtrinsic
      ? prevState.extraFees
      : new BN(0);
    const extraWarn = isSameExtrinsic
      ? prevState.extraWarn
      : false;
    const allFees = extraFees
      .add(transactionBaseFee)
      .add(transactionByteFee.muln(txLength));

    const hasAvailable = spendingBalance.gte(allFees) && tokenBalance.gte(extraAmount);
    const isRemovable = false; // TODO
    const isReserved = false; // TODO
    const allWarn = extraWarn;
    const overLimit = txLength >= MAX_SIZE_BYTES;

    return {
      allFees,
      allWarn,
      extMethod,
      extSection,
      extraAmount,
      extraFees,
      extraWarn,
      hasAvailable,
      isRemovable,
      isReserved,
      overLimit,
      balance: tokenBalance,
      spendBalance: spendingBalance
    };
  }

  componentDidUpdate () {
    const { onChange } = this.props;
    const { hasAvailable } = this.state;

    onChange && onChange(hasAvailable);
  }

  render () {
    const { accountId, className, isSendable, t, assetId } = this.props;
    const { allFees, allWarn, hasAvailable, isRemovable, isReserved, overLimit, balance, spendBalance } = this.state;

    if (!accountId) {
      return null;
    }

    const feeClass = !hasAvailable || overLimit || isRemovable
      ? 'error'
      : (
        allWarn
          ? 'warning'
          : 'normal'
      );

    // display all the errors, warning and information messages (in that order)
    return (
      <article
        className={[className, feeClass, 'padded'].join(' ')}
        key='txinfo'
      >
        {
          isSendable
            ? undefined
            : <div><Icon name='ban' />{t('The selected account does not exist on your keyring')}</div>
        }
        {
          hasAvailable
            ? undefined
            : <div><Icon name='ban' />{t('The selected account does not have the required balance available for this transaction')}</div>
        }
        {
          overLimit
            ? <div><Icon name='ban' />{t(`This transaction will be rejected by the node as it is greater than the maximum size of ${MAX_SIZE_MB}MB`)}></div>
            : undefined
        }
        {
          balance && assetId && <div title={balance.toString()}><Icon name='arrow right' />{`Asset ID: ${assetId.toString()} - Balance: ${formatBalance(balance)}`}</div>
        }
        <div title={spendBalance.toString()}><Icon name='arrow right' />{`CENTRAPAY - Balance: ${formatBalance(spendBalance)}`}</div>
        {this.renderTransfer()}
        {this.renderProposal()}
        {
          isRemovable && hasAvailable
            ? <div><Icon name='ban' />{t('Submitting this transaction will drop the account balance to below the existential amount, which can result in the account being removed from the chain state associated funds burned.')}</div>
            : undefined
        }
        {this.renderTransfer()}
        {this.renderProposal()}
        {
          isReserved
            ? <div><Icon name='arrow right' />{t('This account does have a reserved/locked balance, not taken into account')}</div>
            : undefined
        }
        <div><Icon name='arrow right' />{t('Fees includes the transaction fee and the per-byte fee')}</div>
        <div><Icon name='arrow right' />{t('Fees totalling {{fees}} unit of CENTRAPAY will be applied to the submission', {
          replace: {
            fees: formatBalance(allFees)
          }
        })}</div>
      </article>
    );
  }

  private renderProposal () {
    const { extrinsic, transactionBaseFee, transactionByteFee } = this.props;
    const { extMethod, extSection } = this.state;

    if (!transactionBaseFee || !transactionByteFee || !extrinsic || extSection !== 'democracy' || extMethod !== 'propose') {
      return null;
    }

    const [, deposit] = extrinsic.args;

    return (
      <Proposal
        deposit={deposit}
        fees={{ ...ZERO_FEES, transactionBaseFee, transactionByteFee }}
        onChange={this.onExtraUpdate}
      />
    );
  }

  private renderTransfer () {
    const { extrinsic, transactionBaseFee, transactionByteFee } = this.props;
    const { extMethod, extSection } = this.state;

    if (!transactionBaseFee || !transactionByteFee || !extrinsic || extSection !== 'genericAsset' || extMethod !== 'transfer') {
      return null;
    }

    const [assetId, recipientId, amount] = extrinsic.args;

    return (
      <Transfer
        assetId={assetId}
        amount={amount}
        fees={{ ...ZERO_FEES, transactionBaseFee, transactionByteFee }}
        recipientId={recipientId}
        onChange={this.onExtraUpdate}
      />
    );
  }

  private onExtraUpdate = (extra: ExtraFees) => {
    this.setState({ ...extra });
  }
}

const generateKey = (addr: string | null | undefined, token: any) => {
  if (!addr || !token) {
    return '0x';
  }
  const prefix = stringToU8a('GenericAsset FreeBalance');
  const assetIdEncoded = new u32(token.toBn ? token.toBn() : token).toU8a();
  const keyEncoded = new Uint8Array(prefix.length + assetIdEncoded.length);
  keyEncoded.set(prefix);
  keyEncoded.set(assetIdEncoded, prefix.length);
  const addrEncoded = xxhashAsHex(decodeAddress(addr), 128).substr(2);
  return blake2AsHex(keyEncoded, 256) + addrEncoded;
};

const getAssetId = (props: Props): BN | number => {
  if (!props.extrinsic) {
    return 0;
  }
  const fn = Method.findFunction(props.extrinsic.callIndex);
  const extMethod = fn.method;
  const extSection = fn.section;

  if (extSection !== 'genericAsset' || extMethod !== 'transfer') {
    return 0;
  }

  const [assetId] = props.extrinsic.args;

  return assetId as any;
};

const mapProps = (props: Props): Props => {
  const assetId = getAssetId(props);
  return {
    ...props,
    accountKeyToken: generateKey(props.accountId, assetId),
    accountKeySpending: generateKey(props.accountId, 16001), // TODO: read from chain
    assetId
  };
};

const withKeys = (Component: React.ComponentType<Props>) => (props: Props) => <Component {...mapProps(props)}/>;

export default translate(
  withKeys(
    withCalls<Props>(
      ['query.fees.transactionBaseFee', { propName: 'transactionBaseFee' }],
      ['query.fees.transactionByteFee', { propName: 'transactionByteFee' }],
      ['rpc.state.getStorage', { paramName: 'accountKeyToken', propName: 'token_balance' }],
      ['rpc.state.getStorage', { paramName: 'accountKeySpending', propName: 'spending_balance' }],
      ['query.system.accountNonce', { paramName: 'accountId' }]
    )(FeeDisplay)
  )
);
