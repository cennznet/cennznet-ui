// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-signer/types';
import { RxBalanceMap } from '@polkadot/api-observable/types';
import { AccountId, Balance } from '@polkadot/types';

import React from 'react';
import keyring from '@polkadot/ui-keyring/index';
import { QueueConsumer } from '@polkadot/ui-signer/Context';

import Account from './Account';
import translate from '../translate';

type Props = I18nProps & {
  balances: RxBalanceMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  intentions: Array<string>,
  validators: Array<string>
};

class StakeList extends React.PureComponent<Props> {
  render () {
    const { balances, balanceArray, intentions, validators } = this.props;

    return (
      <QueueConsumer>
        {({ queueExtrinsic }: QueueProps) => (
          <div className='staking--StakeList'>
            {keyring.getAccounts().map((account) => {
              const address = account.address();
              const name = account.getMeta().name || '';

              return (
                <Account
                  accountId={address}
                  balances={balances}
                  balanceArray={balanceArray}
                  intentions={intentions}
                  isValidator={validators.includes(address)}
                  key={address}
                  name={name}
                  queueExtrinsic={queueExtrinsic}
                />
              );
            })}
          </div>
        )}
      </QueueConsumer>
    );
  }
}

// @ts-ignore Definitions seem to have gone wonky
export default translate(StakeList);
