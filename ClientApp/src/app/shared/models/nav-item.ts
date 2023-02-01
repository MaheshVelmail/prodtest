export interface NavItem {
    displayName: string;
    disabled?: boolean;
    iconName: string;
    route?: string;
    navId:any;
    children?: NavItem[];
  }  