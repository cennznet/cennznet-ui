// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedFees } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React from 'react';
import { Compact } from '@polkadot/types';
import { withMulti } from '@polkadot/ui-api';
import { Icon } from '@polkadot/ui-app';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & {
  assetId?: BN,
  amount: BN | Compact,
  fees: DerivedFees,
  recipientId: string,
  onChange: (fees: ExtraFees) => void
};

type State = ExtraFees & {
  isCreation: boolean,
  isNoEffect: boolean
};

export class Transfer extends React.PureComponent<Props, State> {
  state: State = {
    extraFees: new BN(0),
    extraAmount: new BN(0),
    extraWarn: false,
    isCreation: false,
    isNoEffect: false
  };

  static getDerivedStateFromProps ({ amount, fees, onChange }: Props): State {
    let extraFees = new BN(fees.transferFee);

    const extraAmount = amount instanceof Compact ? amount.toBn() : new BN(amount);
    const isCreation = false;
    const isNoEffect = false;
    const extraWarn = isCreation || isNoEffect;
    const update = {
      extraAmount,
      extraFees,
      extraWarn
    };

    // onChange(update);

    return {
      ...update,
      isCreation,
      isNoEffect
    };
  }

  render () {
    const { fees, t } = this.props;
    const { isCreation, isNoEffect } = this.state;

    return (
      <>
        {
          isNoEffect
            ? <div><Icon name='warning sign' />{t('The final recipient balance is less than the existential amount and will not be reflected')}</div>
            : undefined
        }
        {
          isCreation
            ? <div><Icon name='warning sign' />{t('A fee of {{creationFee}} will be deducted from the sender since the destination account does not exist', {
              replace: {
                creationFee: formatBalance(fees.creationFee)
              }
            })}</div>
            : undefined
        }
      </>
    );
  }
}

export default withMulti(
  Transfer,
  translate
);
