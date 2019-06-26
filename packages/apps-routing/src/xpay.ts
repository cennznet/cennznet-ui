// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import XPay from '@polkadot/app-xpay';

export default ([
  {
    Component: XPay as any,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.xpay.createItem'
      ]
    },
    i18n: {
      defaultValue: 'XPay'
    },
    icon: 'th',
    name: 'xpay'
  }
] as Routes);
