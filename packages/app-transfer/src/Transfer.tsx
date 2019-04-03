// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-app/Status/types';
import { ApiProps } from '@polkadot/ui-api/types';

import BN from 'bn.js';
import React from 'react';
import { IExtrinsic } from '@polkadot/types/types';
import { AddressSummary, InputAddress, InputBalance, InputNumber } from '@polkadot/ui-app/index';
import { withApi, withMulti } from '@polkadot/ui-api/index';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';
import keyring from '@polkadot/ui-keyring';
import Checks from '@polkadot/ui-signer/Checks';

import Submit from './Submit';
import translate from './translate';

type Props = I18nProps & ApiProps & {};

type State = {
  accountId: string | null,
  amount: BN,
  assetId: BN,
  extrinsic: IExtrinsic | null,
  hasAvailable: boolean,
  recipientId: string | null
};

const ZERO = new BN(0);

// Declared and addded `ASSETID` for the initial release.
const ASSETID = new BN(16000);

class Transfer extends React.PureComponent<Props, State> {
  state: State = {
    accountId: null,
    amount: ZERO,
    assetId: ASSETID,
    extrinsic: null,
    hasAvailable: true,
    recipientId: null
  };

  render () {
    const { t } = this.props;
    const { accountId, extrinsic, recipientId, hasAvailable } = this.state;

    return (
      <div className='transfer--Transfer'>
        <div className='transfer--Transfer-info'>
          {this.renderAddress(accountId, 'medium')}
          <div className='transfer--Transfer-data'>
            <InputAddress
              label={t('from my source account')}
              onChange={this.onChangeFrom}
              type='account'
            />
            <InputAddress
              label={t('to the recipient address')}
              onChange={this.onChangeTo}
              type='all'
            />
            <InputNumber
              defaultValue={ZERO}
              label={t('asset ID (16000 for CENNZ and 16001 for CENTRAPAY)')}
              onChange={this.onChangeAssetId}
            />
            <InputBalance
              autoFocus
              isError={!hasAvailable}
              label={t('transfer a value of')}
              onChange={this.onChangeAmount}
            />
            Sender:
            <Checks
              accountId={accountId}
              extrinsic={extrinsic}
              isSendable
              onChange={this.onChangeFees}
            />
            Recipient:
            <Checks
              accountId={recipientId}
              extrinsic={extrinsic}
              isSendable
            />
            <QueueConsumer>
              {({ queueExtrinsic }: QueueProps) => (
                <Submit
                  accountId={accountId}
                  isDisabled={!hasAvailable}
                  extrinsic={extrinsic}
                  queueExtrinsic={queueExtrinsic}
                />
              )}
            </QueueConsumer>
          </div>
          {this.renderAddress(recipientId, 'large')}
        </div>
      </div>
    );
  }

  private renderAddress (accountId: string | null, media: 'large' | 'medium') {
    if (!accountId) {
      return null;
    }

    try {
      keyring.decodeAddress(accountId);
    } catch (err) {
      return null;
    }

    return (
      <div className={`transfer--Transfer-address ui--media-${media}`}>
        <AddressSummary
          value={accountId}
          withCopy={false}
        />
      </div>
    );
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api } = this.props;
      const { accountId = prevState.accountId, amount = prevState.amount, assetId = prevState.assetId, recipientId = prevState.recipientId, hasAvailable = prevState.hasAvailable } = newState;
      const extrinsic = accountId && recipientId
        ? api.tx.genericAsset.transfer(assetId, recipientId, amount)
        : null;

      return {
        accountId,
        amount,
        assetId,
        extrinsic,
        hasAvailable,
        recipientId
      };
    });
  }

  private onChangeFrom = (accountId: string) => {
    this.nextState({ accountId });
  }

  private onChangeAmount = (amount: BN = new BN(0)) => {
    this.nextState({ amount });
  }

  private onChangeTo = (recipientId: string) => {
    this.nextState({ recipientId });
  }

  private onChangeFees = (hasAvailable: boolean) => {
    this.setState({ hasAvailable });
  }

  private onChangeAssetId = (assetId: BN = new BN(0)) => {
    this.nextState({ assetId });
  }
}

export default withMulti(
  Transfer,
  translate,
  withApi
);
