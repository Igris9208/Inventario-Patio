
export function useOrdenateShowFact(showProducts) {
  let showProductsFilters = [[]];
  let filtersFactura = showProducts[0].fact;
  let indexshowProductsFilters = 0;

  showProducts.map((product, index) => {
    if (product.fact == filtersFactura) {
      showProductsFilters[indexshowProductsFilters].push(product);
    } else {
      showProductsFilters.push([product]);
      indexshowProductsFilters++;
      filtersFactura = product.fact;
    }
  });

  return showProductsFilters;
}