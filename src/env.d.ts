declare namespace App {
    interface Locals {
        user: {
            name: string;
            email: string;
            token?: string;
        } | null;
    }
}