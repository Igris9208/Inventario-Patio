export function useOrdenateShowFact(showProducts) {
  let showProductsFilters = [[]];
  let filtersFactura = showProducts[0].fact
    ? showProducts[0].fact
    : showProducts[0].trasl;
  let indexshowProductsFilters = 0;

  showProducts.forEach((product) => {
    if (
      (product.fact && product.fact === filtersFactura) ||
      (product.trasl && product.trasl === filtersFactura)
    ) {
      showProductsFilters[indexshowProductsFilters].push(product);
    } else {
      showProductsFilters.push([product]);
      indexshowProductsFilters++;
      filtersFactura = product.fact ? product.fact : product.trasl;
    }
  });

  return showProductsFilters;
}
