export interface IRoute {
  title: string;
  href: string;
  classNames: IRouteClasses;
}

export interface IRouteClasses {
  container: string;
  link?: string;
}

export interface IMenuLink extends IRoute {
  alt: string;
  icon: string;
}
