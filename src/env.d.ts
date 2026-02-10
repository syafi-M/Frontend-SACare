declare namespace App {
    interface Locals {
        user: {
            name: string;
            email: string;
            token?: string;
        } | null;
    }
}

import type { AttributifyAttributes } from '@unocss/preset-attributify'

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes extends AttributifyAttributes {}
  }
}