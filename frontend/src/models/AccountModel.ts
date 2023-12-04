export interface Account {
  account_id: number;
  account_name: string;
  details: string;
  category_id: number;
  type_id: number;
}

export interface AccountType {
  type_id: number;
  type_name: string;
  icon_path: string;
}

export interface AccountCategory {
  category_id: number;
  category_name: string;
}
