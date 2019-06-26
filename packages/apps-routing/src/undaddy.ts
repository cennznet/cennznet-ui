// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Template from '@polkadot/app-undaddy';

export default ([
  {
    Component: Template,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.xpay.createItem'
      ]
    },
    i18n: {
      defaultValue: 'UNDaddy'
    },
    icon: 'th',
    name: 'undaddy'
  }
] as Routes);
