export function Filters() {
  return (
    <section className="filters">

      <div>
        <label htmlFor="price">Price</label>
        <imput type="range" id="price" min="0" max="5000" />
      </div>

    </section>
  );
}
