import { IeCommerceEnv } from './../ecommerce.env';
import { UserAuthOptions } from '@commercetools/sdk-client-v2';
import { IFilterPattern, IProductFilter, ISearchPattern, SortParams } from './apiClientTypes';
import Api from './apiBuilder';

export abstract class ApiBase {
  private ENV: IeCommerceEnv;
  protected user: UserAuthOptions | null = null;

  public api: Api;

  constructor(env: IeCommerceEnv) {
    this.ENV = env;

    this.api = new Api(this.ENV);
  }

  protected static makeFilter = (filter: Partial<IProductFilter>) => {
    const pattern: ISearchPattern = {
      // Add patterns for filtering here:
      categoryId: ({ param }: IFilterPattern): string[] => [`categories.id:"${param}"`],
      searchKeywords: ({ param }: IFilterPattern): string[] => {
        let res: string[] = [];
        if (Array.isArray(param)) {
          res = param.map((val) => `searchKeywords.${filter.searchLanguage || SortParams.searchEN}.text:"${val}"`);
        }
        return res;
      },
      price: ({ param }: IFilterPattern): string[] => {
        let from = '*';
        let to = '*';
        if (typeof param === 'object' && !Array.isArray(param)) {
          if (param.from && param.from > 0) from = param.from.toString();
          if (param.to && param.to > 0) to = param.to.toString();
        }
        return [`variants.price.centAmount:range (${from} to ${to})`];
      },
    };
    return Object.entries(filter)
      .reduce<string[][]>((acc, [key, val]) => {
        if (key in pattern) acc.push(pattern[key]({ param: val }));
        return acc;
      }, [])
      .flat();
  };
}
