import type {RouterContextProvider} from 'react-router';

/**
 * Buyer variables used to contextualize Storefront API queries through the
 * `@inContext(buyer: $buyer)` directive.
 *
 * Passing these variables makes the Storefront API return the catalog assigned
 * to the buyer's company location (including B2B pricing and product
 * visibility) instead of the shop's default catalog.
 *
 * @see https://shopify.dev/docs/storefronts/headless/hydrogen/cookbook/b2b
 */
export type BuyerVariables =
  | {
      buyer: {
        companyLocationId: string;
        customerAccessToken: string;
      };
    }
  | {};

/**
 * Resolves the B2B buyer context for the current request.
 *
 * Returns an empty object for guests and for customers that don't belong to a
 * company location, so the same queries keep working for non-B2B visitors.
 *
 * Every product-related query (home, collections, search, product, ...) should
 * be contextualized with these variables, otherwise the response contains the
 * shop's default catalog instead of the buyer's company location catalog.
 */
export async function getBuyerVariables(
  context: Readonly<RouterContextProvider>,
): Promise<BuyerVariables> {
  const buyer = await context.customerAccount.getBuyer();

  if (buyer?.companyLocationId && buyer?.customerAccessToken) {
    return {
      buyer: {
        companyLocationId: buyer.companyLocationId,
        customerAccessToken: buyer.customerAccessToken,
      },
    };
  }

  return {};
}
